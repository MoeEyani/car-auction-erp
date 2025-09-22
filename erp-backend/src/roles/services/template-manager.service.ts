// src/roles/services/template-manager.service.ts
import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { ROLE_TEMPLATES, type RoleTemplate } from '../constants/role-templates';
import { CreateTemplateDto, UpdateTemplateDto } from '../dto/template.zod';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TemplateManagerService {
  // In a real application, this would be stored in database
  // For now, we'll manage templates in memory with persistence to a JSON file or database
  private customTemplates: RoleTemplate[] = [];

  constructor(private prisma: PrismaService) {}

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

  private async canManageTemplates(userId: number): Promise<boolean> {
    const userPermissions = await this.getUserPermissions(userId);
    return userPermissions.includes('system_admin') || 
           userPermissions.includes('create_global_admin') ||
           userPermissions.includes('manage_system_roles');
  }

  getAllTemplates(userId?: number): RoleTemplate[] {
    // Return all templates (default + custom)
    return [...ROLE_TEMPLATES, ...this.customTemplates];
  }

  async getAvailableTemplates(userId: number): Promise<RoleTemplate[]> {
    const userPermissions = await this.getUserPermissions(userId);
    const isSuperAdmin = userPermissions.includes('system_admin') || 
                        userPermissions.includes('create_global_admin');

    const allTemplates = this.getAllTemplates();

    return allTemplates.filter(template => {
      // Super admin can use any template
      if (isSuperAdmin) return true;
      
      // Regular users can only use branch-scoped templates
      return template.branchScope === 'branch';
    });
  }

  async getTemplateById(templateId: string, userId?: number): Promise<RoleTemplate | null> {
    const allTemplates = this.getAllTemplates();
    const template = allTemplates.find(t => t.id === templateId);
    
    if (!template) return null;

    if (!userId) {
      return template;
    }

    const availableTemplates = await this.getAvailableTemplates(userId);
    return availableTemplates.find(t => t.id === templateId) || null;
  }

  async createTemplate(createTemplateDto: CreateTemplateDto, userId: number): Promise<RoleTemplate> {
    // Check if user can manage templates
    const canManage = await this.canManageTemplates(userId);
    if (!canManage) {
      throw new ForbiddenException('You do not have permission to manage role templates');
    }

    // Check if template ID already exists
    const existingTemplate = await this.getTemplateById(createTemplateDto.id);
    if (existingTemplate) {
      throw new BadRequestException('Template with this ID already exists');
    }

    // Validate that permissions exist in the system
    const permissions = await this.prisma.permission.findMany({
      where: { name: { in: createTemplateDto.permissions } }
    });

    if (permissions.length !== createTemplateDto.permissions.length) {
      const missingPermissions = createTemplateDto.permissions.filter(
        p => !permissions.some(perm => perm.name === p)
      );
      throw new BadRequestException(`The following permissions do not exist: ${missingPermissions.join(', ')}`);
    }

    const newTemplate: RoleTemplate = {
      ...createTemplateDto,
    };

    this.customTemplates.push(newTemplate);
    return newTemplate;
  }

  async updateTemplate(templateId: string, updateTemplateDto: UpdateTemplateDto, userId: number): Promise<RoleTemplate> {
    // Check if user can manage templates
    const canManage = await this.canManageTemplates(userId);
    if (!canManage) {
      throw new ForbiddenException('You do not have permission to manage role templates');
    }

    // Check if trying to update a default template
    const isDefaultTemplate = ROLE_TEMPLATES.some(t => t.id === templateId);
    if (isDefaultTemplate) {
      throw new BadRequestException('Cannot modify default templates. Create a custom template instead.');
    }

    const templateIndex = this.customTemplates.findIndex(t => t.id === templateId);
    if (templateIndex === -1) {
      throw new NotFoundException('Template not found');
    }

    // Validate permissions if provided
    if (updateTemplateDto.permissions) {
      const permissions = await this.prisma.permission.findMany({
        where: { name: { in: updateTemplateDto.permissions } }
      });

      if (permissions.length !== updateTemplateDto.permissions.length) {
        const missingPermissions = updateTemplateDto.permissions.filter(
          p => !permissions.some(perm => perm.name === p)
        );
        throw new BadRequestException(`The following permissions do not exist: ${missingPermissions.join(', ')}`);
      }
    }

    // Update the template
    this.customTemplates[templateIndex] = {
      ...this.customTemplates[templateIndex],
      ...updateTemplateDto,
    };

    return this.customTemplates[templateIndex];
  }

  async deleteTemplate(templateId: string, userId: number): Promise<{ message: string }> {
    // Check if user can manage templates
    const canManage = await this.canManageTemplates(userId);
    if (!canManage) {
      throw new ForbiddenException('You do not have permission to manage role templates');
    }

    // Check if trying to delete a default template
    const isDefaultTemplate = ROLE_TEMPLATES.some(t => t.id === templateId);
    if (isDefaultTemplate) {
      throw new BadRequestException('Cannot delete default templates');
    }

    const templateIndex = this.customTemplates.findIndex(t => t.id === templateId);
    if (templateIndex === -1) {
      throw new NotFoundException('Template not found');
    }

    this.customTemplates.splice(templateIndex, 1);
    return { message: 'Template deleted successfully' };
  }

  async getManageableTemplates(userId: number): Promise<{
    defaultTemplates: RoleTemplate[],
    customTemplates: RoleTemplate[]
  }> {
    // Check if user can manage templates
    const canManage = await this.canManageTemplates(userId);
    if (!canManage) {
      throw new ForbiddenException('You do not have permission to manage role templates');
    }

    return {
      defaultTemplates: ROLE_TEMPLATES,
      customTemplates: this.customTemplates
    };
  }
}