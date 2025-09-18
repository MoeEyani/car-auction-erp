// src/roles/roles.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoleDto, UpdateRoleDto } from './dto/role.zod';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class RolesService {
  constructor(
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2,
  ) {}

  async create({ permissionIds, ...roleData }: CreateRoleDto) {
    const role = await this.prisma.$transaction(async (tx) => {
      const newRole = await tx.role.create({ data: roleData });
      if (permissionIds && permissionIds.length > 0) {
        await tx.rolePermission.createMany({
          data: permissionIds.map((id) => ({
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

  async findAll() {
    return this.prisma.role.findMany({ include: { permissions: { include: { permission: true } } } });
  }
  
  async findAllPermissions() {
    return this.prisma.permission.findMany();
  }

  async findOne(id: number) {
    const role = await this.prisma.role.findUnique({
      where: { id },
      include: { permissions: { include: { permission: true } } },
    });
    if (!role) throw new NotFoundException(`Role with ID #${id} not found`);
    return role;
  }
  
  async update(id: number, { permissionIds, ...roleData }: UpdateRoleDto) {
    const originalRole = await this.findOne(id);
    
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

  async remove(id: number) {
    const role = await this.findOne(id);
    if (role.isSystemRole) {
        throw new BadRequestException('System roles cannot be deleted.');
    }
    const deletedRole = await this.prisma.role.delete({ where: { id } });
    this.eventEmitter.emit('role.deleted', { role: deletedRole });
    return deletedRole;
  }
}
