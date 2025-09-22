// src/users/users.service.ts
import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.zod';
import * as bcrypt from 'bcrypt';
import { EventEmitter2 } from '@nestjs/event-emitter';

export const userSelect = {
    id: true, fullName: true, username: true, isActive: true,
    branch: { select: { id: true, name: true } },
    role: { select: { id: true, name: true } },
    branchId: true, roleId: true
};

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService, private eventEmitter: EventEmitter2) {}
  
  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
  }

  private async getUserPermissionsInternal(userId: number): Promise<string[]> {
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

  private async canUserManageRole(userId: number, roleId: number): Promise<boolean> {
    const userPermissions = await this.getUserPermissionsInternal(userId);
    
    // Super admin can manage any role
    if (userPermissions.includes('system_admin') || userPermissions.includes('create_global_admin')) {
      return true;
    }

    // Get the target role to check if it's a system role
    const targetRole = await this.prisma.role.findUnique({
      where: { id: roleId },
      include: {
        permissions: {
          include: {
            permission: true
          }
        }
      }
    });

    if (!targetRole) return false;

    // Check if target role has admin permissions
    const targetRolePermissions = targetRole.permissions.map(rp => rp.permission.name);
    const hasAdminPermissions = targetRolePermissions.some(p => 
      p.includes('system_admin') || 
      p.includes('create_global_admin') || 
      p.includes('manage_system_roles') ||
      p.includes('view_all_') ||
      p.includes('manage_all_')
    );

    // Non-super admin users cannot assign admin roles
    if (hasAdminPermissions) {
      return false;
    }

    return true;
  }

  async create(createUserDto: CreateUserDto, requestUserId?: number) {
    const { password, roleId, ...userData } = createUserDto;
    
    // Check if requesting user can assign this role
    if (requestUserId && roleId) {
      const canManage = await this.canUserManageRole(requestUserId, roleId);
      if (!canManage) {
        throw new ForbiddenException('You cannot assign admin roles or system-level permissions');
      }
    }
    
    const hashedPassword = await this.hashPassword(password);
    
    try {
        const user = await this.prisma.user.create({
            data: { ...userData, roleId, passwordHash: hashedPassword },
            select: userSelect,
        });
        this.eventEmitter.emit('user.created', { user });
        return user;
    } catch (error) {
        if (error.code === 'P2002') {
            throw new ConflictException('A user with this username already exists.');
        }
        throw error;
    }
  }

  async findAll(requestUserId?: number) {
    if (!requestUserId) {
      return this.prisma.user.findMany({ select: userSelect, orderBy: { fullName: 'asc' } });
    }

    const userPermissions = await this.getUserPermissionsInternal(requestUserId);
    
    // Super admin can see all users
    if (userPermissions.includes('view_all_users') || userPermissions.includes('system_admin')) {
      return this.prisma.user.findMany({ select: userSelect, orderBy: { fullName: 'asc' } });
    }

    // Regular users can only see users from their branch
    if (userPermissions.includes('view_own_branch_users_only')) {
      const requestingUser = await this.prisma.user.findUnique({
        where: { id: requestUserId },
        select: { branchId: true }
      });

      if (!requestingUser?.branchId) {
        return [];
      }

      return this.prisma.user.findMany({
        where: { branchId: requestingUser.branchId },
        select: userSelect,
        orderBy: { fullName: 'asc' }
      });
    }

    // If no appropriate permissions, return empty array
    return [];
  }

  async findOne(id: number, requestUserId?: number) {
    const user = await this.prisma.user.findUnique({ 
      where: { id }, 
      select: userSelect 
    });
    
    if (!user) throw new NotFoundException(`User with ID #${id} not found`);

    // If no requesting user ID, return the user (for internal use)
    if (!requestUserId) return user;

    const userPermissions = await this.getUserPermissionsInternal(requestUserId);
    
    // Super admin can see any user
    if (userPermissions.includes('view_all_users') || userPermissions.includes('system_admin')) {
      return user;
    }

    // Regular users can only see users from their branch
    if (userPermissions.includes('view_own_branch_users_only')) {
      const requestingUser = await this.prisma.user.findUnique({
        where: { id: requestUserId },
        select: { branchId: true }
      });

      if (requestingUser?.branchId !== user.branchId) {
        throw new ForbiddenException('You can only view users from your own branch');
      }
    }

    return user;
  }

  async getUserPermissions(id: number) {
    const user = await this.prisma.user.findUnique({ 
      where: { id },
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

    if (!user) {
      throw new NotFoundException(`User with ID #${id} not found`);
    }

    // Get role permissions
    const rolePermissions = user.role?.permissions?.map(rp => rp.permission) || [];
    
    // Get permission overrides
    const overrides = user.permissionOverrides || [];
    
    // Apply overrides
    const finalPermissions = [...rolePermissions];
    
    overrides.forEach(override => {
      if (override.hasPermission) {
        // Add permission if not already present
        if (!finalPermissions.find(p => p.id === override.permission.id)) {
          finalPermissions.push(override.permission);
        }
      } else {
        // Remove permission
        const index = finalPermissions.findIndex(p => p.id === override.permission.id);
        if (index > -1) {
          finalPermissions.splice(index, 1);
        }
      }
    });

    return finalPermissions.map(p => p.name);
  }
  
  async update(id: number, updateUserDto: UpdateUserDto, requestUserId?: number) {
    await this.findOne(id, requestUserId);
    
    const { password, roleId, ...userData } = updateUserDto;
    
    // Check if requesting user can assign this role
    if (requestUserId && roleId) {
      const canManage = await this.canUserManageRole(requestUserId, roleId);
      if (!canManage) {
        throw new ForbiddenException('You cannot assign admin roles or system-level permissions');
      }
    }
    
    const updateData: any = { ...userData };
    if (roleId) updateData.roleId = roleId;
    
    // Hash password if provided
    if (password) {
      updateData.passwordHash = await this.hashPassword(password);
    }
    
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: updateData,
      select: userSelect,
    });
    this.eventEmitter.emit('user.updated', { userId: id, changes: updateUserDto });
    return updatedUser;
  }
  
  async remove(id: number, requestUserId?: number) {
    // Check if user can access this user first
    await this.findOne(id, requestUserId);
    
    const deactivatedUser = await this.prisma.user.update({
      where: { id }, data: { isActive: false }, select: userSelect,
    });
    this.eventEmitter.emit('user.deactivated', { user: deactivatedUser });
    return deactivatedUser;
  }
}
