// src/users/users.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ParseIntPipe, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import type { CreateUserDto, UpdateUserDto } from './dto/user.zod';
import { createUserSchema, updateUserSchema } from './dto/user.zod';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BranchAccessGuard } from '../common/guards/branch-access.guard';

@Controller('users')
@UseGuards(JwtAuthGuard, BranchAccessGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  
  @Post()
  @UsePipes(new ZodValidationPipe(createUserSchema))
  create(@Body() createUserDto: CreateUserDto, @Request() req: any) { 
    return this.usersService.create(createUserDto, req.user.userId); 
  }

  @Get('permissions')
  getCurrentUserPermissions(@Request() req: any) { 
    console.log('User from JWT:', req.user); // Debug log
    return this.usersService.getUserPermissions(req.user.userId); 
  }

  @Get()
  findAll(@Request() req: any) { 
    return this.usersService.findAll(req.user.userId); 
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req: any) { 
    return this.usersService.findOne(id, req.user.userId); 
  }

  @Get(':id/permissions')
  getUserPermissions(@Param('id', ParseIntPipe) id: number) { 
    return this.usersService.getUserPermissions(id); 
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body(new ZodValidationPipe(updateUserSchema)) updateUserDto: UpdateUserDto, @Request() req: any) { 
    return this.usersService.update(id, updateUserDto, req.user.userId); 
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Request() req: any) { 
    return this.usersService.remove(id, req.user.userId); 
  }
}
