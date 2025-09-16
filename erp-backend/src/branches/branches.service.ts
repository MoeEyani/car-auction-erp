// src/branches/branches.service.ts
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBranchDto, UpdateBranchDto } from './dto/branch.zod';

@Injectable()
export class BranchesService {
  constructor(private prisma: PrismaService) {}

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

  async findAll(includeInactive: boolean = false) {
    const whereClause = includeInactive ? {} : { isActive: true };
    return this.prisma.branch.findMany({ where: whereClause, orderBy: { name: 'asc' } });
  }

  async findOne(id: number) {
    const branch = await this.prisma.branch.findUnique({ where: { id } });
    if (!branch) {
      throw new NotFoundException(`Branch with ID #${id} not found`);
    }
    return branch;
  }

  async update(id: number, updateBranchDto: UpdateBranchDto) {
    await this.findOne(id);
    return this.prisma.branch.update({ where: { id }, data: updateBranchDto });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.branch.update({ where: { id }, data: { isActive: false } });
  }
}
