// src/common/guards/branch-access.guard.ts
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class BranchAccessGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // Get user with role and permissions
    const userWithPermissions = await this.prisma.user.findUnique({
      where: { id: user.userId },
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

    if (!userWithPermissions) {
      throw new ForbiddenException('User not found');
    }

    // Check if user has super admin permissions
    const hasSystemAdmin = this.hasPermission(userWithPermissions, 'system_admin');
    const hasViewAllBranches = this.hasPermission(userWithPermissions, 'view_all_branches');
    const hasViewAllUsers = this.hasPermission(userWithPermissions, 'view_all_users');

    if (hasSystemAdmin || hasViewAllBranches || hasViewAllUsers) {
      // Super admin can access everything
      return true;
    }

    // For non-super admin users, they can only access their own branch data
    // This guard will be used in combination with service-level filtering
    return true; // Guard passes, but services will filter by branch
  }

  private hasPermission(user: any, permissionName: string): boolean {
    // Check role permissions
    const rolePermissions = user.role?.permissions?.map(rp => rp.permission.name) || [];
    
    // Check permission overrides
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
    const finalPermissions = allPermissions.filter(p => !removedPermissions.includes(p));
    
    return finalPermissions.includes(permissionName);
  }
}