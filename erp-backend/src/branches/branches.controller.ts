// src/branches/branches.controller.ts
import { 
  Controller, Get, Post, Body, Patch, Param, Delete, 
  UsePipes, ParseIntPipe, Query, ParseBoolPipe,
  UseGuards, Request 
} from '@nestjs/common';
import { BranchesService } from './branches.service';
import { createBranchSchema, updateBranchSchema } from './dto/branch.zod';
import type { CreateBranchDto, UpdateBranchDto } from './dto/branch.zod';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BranchAccessGuard } from '../common/guards/branch-access.guard';

@Controller('branches')
@UseGuards(JwtAuthGuard, BranchAccessGuard)
export class BranchesController {
  constructor(private readonly branchesService: BranchesService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createBranchSchema))
  create(@Body() createBranchDto: CreateBranchDto) {
    return this.branchesService.create(createBranchDto);
  }

  @Get()
  findAll(@Query('includeInactive') includeInactive?: string, @Request() req?: any) {
    const includeInactiveBool = includeInactive === 'true';
    return this.branchesService.findAll(includeInactiveBool, req?.user?.userId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req?: any) {
    return this.branchesService.findOne(id, req?.user?.userId);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body(new ZodValidationPipe(updateBranchSchema)) updateBranchDto: UpdateBranchDto, @Request() req?: any) {
    return this.branchesService.update(id, updateBranchDto, req?.user?.userId);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Request() req?: any) {
    return this.branchesService.remove(id, req?.user?.userId);
  }
}