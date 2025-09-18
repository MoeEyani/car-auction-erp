// src/roles/roles.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ParseIntPipe, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import type { CreateRoleDto, UpdateRoleDto } from './dto/role.zod';
import { createRoleSchema, updateRoleSchema } from './dto/role.zod';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('roles')
@UseGuards(JwtAuthGuard)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createRoleSchema))
  create(@Body() createRoleDto: CreateRoleDto) { return this.rolesService.create(createRoleDto); }
  
  @Get()
  findAll() { return this.rolesService.findAll(); }

  @Get('permissions')
  findAllPermissions() { return this.rolesService.findAllPermissions(); }
  
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) { return this.rolesService.findOne(id); }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body(new ZodValidationPipe(updateRoleSchema)) updateRoleDto: UpdateRoleDto) { return this.rolesService.update(id, updateRoleDto); }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) { return this.rolesService.remove(id); }
}
