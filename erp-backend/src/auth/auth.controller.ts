// src/auth/auth.controller.ts
import { Controller, Post, Body, UsePipes, HttpCode, HttpStatus, Get, UseGuards, Request } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler'; // Import Throttle
import { AuthService } from './auth.service';
import { loginSchema } from './dto/login.zod';
import type { LoginDto } from './dto/login.zod';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService
  ) {}

  // Override the global rate limit for this specific endpoint
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 requests per 1 minute
  @HttpCode(HttpStatus.OK)
  @Post('login')
  @UsePipes(new ZodValidationPipe(loginSchema))
  signIn(@Body() loginDto: LoginDto) {
    return this.authService.loginDetailed(loginDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('permissions')
  getCurrentUserPermissions(@Request() req: any) {
    console.log('User from JWT:', req.user); // Debug log
    return this.usersService.getUserPermissions(req.user.userId);
  }
}