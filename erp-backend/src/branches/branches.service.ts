// src/branches/branches.service.ts
import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBranchDto, UpdateBranchDto } from './dto/branch.zod';

@Injectable()
export class BranchesService {
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

  async create(createBranchDto: CreateBranchDto) {
    try {
      return await this.prisma.branch.create({ data: createBranchDto });
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new ConflictException('A branch with this name already exists.');
      }
      throw error;
    }
  }

  async findAll(includeInactive: boolean = false, requestUserId?: number) {
    const whereClause = includeInactive ? {} : { isActive: true };
    
    // If no requesting user, return all branches (for internal use)
    if (!requestUserId) {
      return this.prisma.branch.findMany({ where: whereClause, orderBy: { name: 'asc' } });
    }

    const userPermissions = await this.getUserPermissions(requestUserId);
    
    // Super admin can see all branches
    if (userPermissions.includes('view_all_branches') || userPermissions.includes('system_admin')) {
      return this.prisma.branch.findMany({ where: whereClause, orderBy: { name: 'asc' } });
    }

    // Regular users can only see their own branch
    if (userPermissions.includes('view_own_branch_only')) {
      const user = await this.prisma.user.findUnique({
        where: { id: requestUserId },
        select: { branchId: true }
      });

      if (!user?.branchId) {
        return [];
      }

      return this.prisma.branch.findMany({
        where: { ...whereClause, id: user.branchId },
        orderBy: { name: 'asc' }
      });
    }

    // If no appropriate permissions, return empty array
    return [];
  }

  async findOne(id: number, requestUserId?: number) {
    const branch = await this.prisma.branch.findUnique({ where: { id } });
    
    if (!branch) {
      throw new NotFoundException(`Branch with ID #${id} not found`);
    }

    // If no requesting user ID, return the branch (for internal use)
    if (!requestUserId) return branch;

    const userPermissions = await this.getUserPermissions(requestUserId);
    
    // Super admin can see any branch
    if (userPermissions.includes('view_all_branches') || userPermissions.includes('system_admin')) {
      return branch;
    }

    // Regular users can only see their own branch
    if (userPermissions.includes('view_own_branch_only')) {
      const user = await this.prisma.user.findUnique({
        where: { id: requestUserId },
        select: { branchId: true }
      });

      if (user?.branchId !== id) {
        throw new ForbiddenException('You can only view your own branch');
      }
    }

    return branch;
  }

  async update(id: number, updateBranchDto: UpdateBranchDto, requestUserId?: number) {
    // Check if user can access this branch first
    await this.findOne(id, requestUserId);
    return this.prisma.branch.update({ where: { id }, data: updateBranchDto });
  }

  async remove(id: number, requestUserId?: number) {
    // Check if user can access this branch first
    await this.findOne(id, requestUserId);
    return this.prisma.branch.update({ where: { id }, data: { isActive: false } });
  }
}
