// src/branches/branches.controller.ts
import { 
  Controller, Get, Post, Body, Patch, Param, Delete, 
  UsePipes, ParseIntPipe, Query, ParseBoolPipe,
  UseGuards 
} from '@nestjs/common';
import { BranchesService } from './branches.service';
import { createBranchSchema, updateBranchSchema } from './dto/branch.zod';
import type { CreateBranchDto, UpdateBranchDto } from './dto/branch.zod';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('branches')
@UseGuards(JwtAuthGuard) // Applying the placeholder guard to the entire controller
export class BranchesController {
  constructor(private readonly branchesService: BranchesService) {}

  @Post()
  // TODO: Add permission guard here e.g. @Permissions('manage_branches')
  @UsePipes(new ZodValidationPipe(createBranchSchema))
  create(@Body() createBranchDto: CreateBranchDto) {
    return this.branchesService.create(createBranchDto);
  }

  @Get()
  // TODO: Add permission guard here e.g. @Permissions('view_branches')
  findAll(@Query('includeInactive') includeInactive?: string) {
    const includeInactiveBool = includeInactive === 'true';
    return this.branchesService.findAll(includeInactiveBool);
  }

  @Get(':id')
  // TODO: Add permission guard here e.g. @Permissions('view_branches')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.branchesService.findOne(id);
  }

  @Patch(':id')
  // TODO: Add permission guard here e.g. @Permissions('manage_branches')
  update(@Param('id', ParseIntPipe) id: number, @Body(new ZodValidationPipe(updateBranchSchema)) updateBranchDto: UpdateBranchDto) {
    return this.branchesService.update(id, updateBranchDto);
  }

  @Delete(':id')
  // TODO: Add permission guard here e.g. @Permissions('manage_branches')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.branchesService.remove(id);
  }
}