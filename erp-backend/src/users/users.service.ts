// src/users/users.service.ts
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.zod';
import * as bcrypt from 'bcrypt';
import { EventEmitter2 } from '@nestjs/event-emitter';

export const userSelect = {
    id: true, fullName: true, username: true, isActive: true,
    branch: { select: { id: true, name: true } },
    role: { select: { id: true, name: true } }
};

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService, private eventEmitter: EventEmitter2) {}
  
  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
  }

  async create(createUserDto: CreateUserDto) {
    const { password, ...userData } = createUserDto;
    const hashedPassword = await this.hashPassword(password);
    
    try {
        const user = await this.prisma.user.create({
            data: { ...userData, passwordHash: hashedPassword },
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

  async findAll() {
    // TODO: Add pagination in a future sprint
    return this.prisma.user.findMany({ select: userSelect, orderBy: { fullName: 'asc' } });
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id }, select: userSelect });
    if (!user) throw new NotFoundException(`User with ID #${id} not found`);
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
  
  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.findOne(id);
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
      select: userSelect,
    });
    this.eventEmitter.emit('user.updated', { userId: id, changes: updateUserDto });
    return updatedUser;
  }
  
  async remove(id: number) {
    await this.findOne(id);
    const deactivatedUser = await this.prisma.user.update({
      where: { id }, data: { isActive: false }, select: userSelect,
    });
    this.eventEmitter.emit('user.deactivated', { user: deactivatedUser });
    return deactivatedUser;
  }
}
