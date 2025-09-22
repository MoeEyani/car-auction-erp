// src/roles/roles.service.ts
import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoleDto, UpdateRoleDto } from './dto/role.zod';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ROLE_TEMPLATES, getRoleTemplateById, getAvailableTemplatesForUser, type RoleTemplate } from './constants/role-templates';
import { TemplateManagerService } from './services/template-manager.service';

@Injectable()
export class RolesService {
  constructor(
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2,
    private templateManager: TemplateManagerService,
  ) {}

  private async getUserPermissions(userId: number): Promise<string[]> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        role: {
          include: {
            permissions: {
              include: {
                permission: true
              }
            }
          }
        },
        permissionOverrides: {
          include: {
            permission: true
          }
        }
      }
    });

    if (!user) return [];

    // Get role permissions
    const rolePermissions = user.role?.permissions?.map(rp => rp.permission.name) || [];
    
    // Get permission overrides
    const overrides = user.permissionOverrides || [];
    const overridePermissions = overrides
      .filter(override => override.hasPermission)
      .map(override => override.permission.name);
    
    const removedPermissions = overrides
      .filter(override => !override.hasPermission)
      .map(override => override.permission.name);

    // Combine permissions
    const allPermissions = [...rolePermissions, ...overridePermissions];
    
    // Remove overridden permissions
    return allPermissions.filter(p => !removedPermissions.includes(p));
  }

  private async canUserManagePermissions(userId: number, permissionIds: number[]): Promise<boolean> {
    const userPermissions = await this.getUserPermissions(userId);
    
    // Super admin can manage any permissions
    if (userPermissions.includes('system_admin') || userPermissions.includes('create_global_admin')) {
      return true;
    }

    // Get the permissions being assigned
    const permissions = await this.prisma.permission.findMany({
      where: { id: { in: permissionIds } }
    });

    // Check if any of the permissions are admin-level
    const hasAdminPermissions = permissions.some(p => 
      p.name.includes('system_admin') || 
      p.name.includes('create_global_admin') || 
      p.name.includes('manage_system_roles') ||
      p.name.includes('view_all_') ||
      p.name.includes('manage_all_')
    );

    // Non-super admin users cannot assign admin permissions
    if (hasAdminPermissions) {
      return false;
    }

    return true;
  }

  async create({ permissionIds, templateId, ...roleData }: CreateRoleDto, requestUserId?: number) {
    let finalPermissionIds = permissionIds;

    // If a template is specified, get permissions from template
    if (templateId) {
      const template = await this.templateManager.getTemplateById(templateId, requestUserId);
      if (!template) {
        throw new BadRequestException(`Role template with ID '${templateId}' not found or not accessible`);
      }

      // Get permission IDs from template permission names
      const templatePermissions = await this.prisma.permission.findMany({
        where: { name: { in: template.permissions } }
      });

      if (templatePermissions.length !== template.permissions.length) {
        throw new BadRequestException('Some permissions from the template do not exist in the system');
      }

      finalPermissionIds = templatePermissions.map(p => p.id);

      // Set role name and description from template if not provided
      if (!roleData.name) {
        roleData.name = template.name;
      }
      if (!roleData.description) {
        roleData.description = template.description;
      }
    }

    // Check if user can assign these permissions
    if (requestUserId && finalPermissionIds && finalPermissionIds.length > 0) {
      const canManage = await this.canUserManagePermissions(requestUserId, finalPermissionIds);
      if (!canManage) {
        throw new ForbiddenException('You cannot create roles with admin or system-level permissions');
      }
    }

    const role = await this.prisma.$transaction(async (tx) => {
      const newRole = await tx.role.create({ data: roleData });
      if (finalPermissionIds && finalPermissionIds.length > 0) {
        await tx.rolePermission.createMany({
          data: finalPermissionIds.map((id) => ({
            roleId: newRole.id,
            permissionId: id,
          })),
        });
      }
      return newRole;
    });
    this.eventEmitter.emit('role.created', { role });
    return role;
  }

  async findAll(requestUserId?: number) {
    // If no requesting user, return all roles (for internal use)
    if (!requestUserId) {
      return this.prisma.role.findMany({ include: { permissions: { include: { permission: true } } } });
    }

    const userPermissions = await this.getUserPermissions(requestUserId);
    
    // Super admin can see all roles
    if (userPermissions.includes('system_admin') || userPermissions.includes('manage_system_roles')) {
      return this.prisma.role.findMany({ include: { permissions: { include: { permission: true } } } });
    }

    // Regular users can see non-system roles only
    return this.prisma.role.findMany({ 
      where: { isSystemRole: false },
      include: { permissions: { include: { permission: true } } } 
    });
  }
  
  async findAllPermissions(requestUserId?: number) {
    // If no requesting user, return all permissions (for internal use)
    if (!requestUserId) {
      return this.prisma.permission.findMany();
    }

    const userPermissions = await this.getUserPermissions(requestUserId);
    
    // Super admin can see all permissions
    if (userPermissions.includes('system_admin') || userPermissions.includes('create_global_admin')) {
      return this.prisma.permission.findMany();
    }

    // Regular users can only see non-admin permissions
    return this.prisma.permission.findMany({
      where: {
        name: {
          notIn: [
            'system_admin',
            'create_global_admin', 
            'manage_system_roles',
            'view_all_branches',
            'view_all_users',
            'manage_all_users'
          ]
        }
      }
    });
  }

  async findOne(id: number, requestUserId?: number) {
    const role = await this.prisma.role.findUnique({
      where: { id },
      include: { permissions: { include: { permission: true } } },
    });
    if (!role) throw new NotFoundException(`Role with ID #${id} not found`);

    // If no requesting user, return the role (for internal use)
    if (!requestUserId) return role;

    const userPermissions = await this.getUserPermissions(requestUserId);
    
    // Super admin can see any role
    if (userPermissions.includes('system_admin') || userPermissions.includes('manage_system_roles')) {
      return role;
    }

    // Regular users cannot see system roles with admin permissions
    const rolePermissions = role.permissions.map(rp => rp.permission.name);
    const hasAdminPermissions = rolePermissions.some(p => 
      p.includes('system_admin') || 
      p.includes('create_global_admin') || 
      p.includes('manage_system_roles') ||
      p.includes('view_all_') ||
      p.includes('manage_all_')
    );

    if (hasAdminPermissions) {
      throw new ForbiddenException('You cannot view roles with admin permissions');
    }

    return role;
  }
  
  async update(id: number, { permissionIds, ...roleData }: UpdateRoleDto, requestUserId?: number) {
    const originalRole = await this.findOne(id, requestUserId);
    
    // Check if user can assign these permissions
    if (requestUserId && permissionIds && permissionIds.length > 0) {
      const canManage = await this.canUserManagePermissions(requestUserId, permissionIds);
      if (!canManage) {
        throw new ForbiddenException('You cannot assign admin or system-level permissions');
      }
    }
    
    return this.prisma.$transaction(async (tx) => {
      await tx.role.update({ where: { id }, data: roleData });
      if (permissionIds !== undefined) {
        await tx.rolePermission.deleteMany({ where: { roleId: id } });
        if (permissionIds.length > 0) {
          await tx.rolePermission.createMany({
            data: permissionIds.map((pid) => ({ roleId: id, permissionId: pid })),
          });
        }
      }
      
      const finalRole = await tx.role.findUnique({ where: { id }, include: { permissions: true } });
      this.eventEmitter.emit('role.updated', { 
          roleId: finalRole?.id, 
          changes: roleData,
      });
      return finalRole;
    });
  }

  async remove(id: number, requestUserId?: number) {
    const role = await this.findOne(id, requestUserId);
    
    if (role.isSystemRole) {
        throw new BadRequestException('System roles cannot be deleted.');
    }

    // Check if requesting user has permission to delete roles
    if (requestUserId) {
      const userPermissions = await this.getUserPermissions(requestUserId);
      
      // Only super admin can delete roles with admin permissions
      const rolePermissions = role.permissions.map(rp => rp.permission.name);
      const hasAdminPermissions = rolePermissions.some(p => 
        p.includes('system_admin') || 
        p.includes('create_global_admin') || 
        p.includes('manage_system_roles') ||
        p.includes('view_all_') ||
        p.includes('manage_all_')
      );

      if (hasAdminPermissions && !userPermissions.includes('system_admin') && !userPermissions.includes('create_global_admin')) {
        throw new ForbiddenException('You cannot delete roles with admin permissions');
      }
    }
    
    const deletedRole = await this.prisma.role.delete({ where: { id } });
    this.eventEmitter.emit('role.deleted', { role: deletedRole });
    return deletedRole;
  }

  async getAvailablePermissions(requestUserId?: number) {
    if (!requestUserId) {
      // Return all permissions for internal use
      return this.prisma.permission.findMany({
        orderBy: { name: 'asc' }
      });
    }

    const userPermissions = await this.getUserPermissions(requestUserId);
    
    // Super admin can see all permissions
    if (userPermissions.includes('system_admin') || userPermissions.includes('create_global_admin')) {
      return this.prisma.permission.findMany({
        orderBy: { name: 'asc' }
      });
    }

    // Regular users can only see non-admin permissions
    return this.prisma.permission.findMany({
      where: {
        NOT: {
          name: {
            in: [
              'system_admin',
              'create_global_admin', 
              'manage_system_roles',
              'view_all_branches',
              'view_all_users',
              'manage_all_users'
            ]
          }
        }
      },
      orderBy: { name: 'asc' }
    });
  }

  async getRoleTemplates(requestUserId?: number): Promise<RoleTemplate[]> {
    if (!requestUserId) {
      // Return all templates for internal use
      return this.templateManager.getAllTemplates();
    }

    return this.templateManager.getAvailableTemplates(requestUserId);
  }

  async getRoleTemplateById(templateId: string, requestUserId?: number): Promise<RoleTemplate | null> {
    return this.templateManager.getTemplateById(templateId, requestUserId);
  }
}
