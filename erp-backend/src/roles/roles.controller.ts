// src/roles/roles.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ParseIntPipe, UseGuards, Request } from '@nestjs/common';
import { RolesService } from './roles.service';
import type { CreateRoleDto, UpdateRoleDto } from './dto/role.zod';
import { createRoleSchema, updateRoleSchema } from './dto/role.zod';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BranchAccessGuard } from '../common/guards/branch-access.guard';

@Controller('roles')
@UseGuards(JwtAuthGuard, BranchAccessGuard)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createRoleSchema))
  create(@Body() createRoleDto: CreateRoleDto, @Request() req: any) { 
    return this.rolesService.create(createRoleDto, req.user.userId); 
  }
  
  @Get()
  findAll(@Request() req: any) { 
    return this.rolesService.findAll(req.user.userId); 
  }

  @Get('permissions')
  findAllPermissions(@Request() req: any) { 
    return this.rolesService.getAvailablePermissions(req.user.userId); 
  }

  @Get('templates')
  getRoleTemplates(@Request() req: any) { 
    return this.rolesService.getRoleTemplates(req.user.userId); 
  }

  @Get('templates/:templateId')
  getRoleTemplate(@Param('templateId') templateId: string, @Request() req: any) { 
    return this.rolesService.getRoleTemplateById(templateId, req.user.userId); 
  }
  
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req: any) { 
    return this.rolesService.findOne(id, req.user.userId); 
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body(new ZodValidationPipe(updateRoleSchema)) updateRoleDto: UpdateRoleDto, @Request() req: any) { 
    return this.rolesService.update(id, updateRoleDto, req.user.userId); 
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Request() req: any) { 
    return this.rolesService.remove(id, req.user.userId); 
  }
}
