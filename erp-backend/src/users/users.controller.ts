// src/users/users.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ParseIntPipe, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import type { CreateUserDto, UpdateUserDto } from './dto/user.zod';
import { createUserSchema, updateUserSchema } from './dto/user.zod';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  
  @Post()
  @UsePipes(new ZodValidationPipe(createUserSchema))
  create(@Body() createUserDto: CreateUserDto) { return this.usersService.create(createUserDto); }

  @Get('permissions')
  getCurrentUserPermissions(@Request() req: any) { 
    console.log('User from JWT:', req.user); // Debug log
    return this.usersService.getUserPermissions(req.user.userId); 
  }

  @Get()
  findAll() { return this.usersService.findAll(); }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) { return this.usersService.findOne(id); }

  @Get(':id/permissions')
  getUserPermissions(@Param('id', ParseIntPipe) id: number) { 
    return this.usersService.getUserPermissions(id); 
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body(new ZodValidationPipe(updateUserSchema)) updateUserDto: UpdateUserDto) { return this.usersService.update(id, updateUserDto); }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) { return this.usersService.remove(id); }
}
