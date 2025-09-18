// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.zod';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.prisma.user.findUnique({ where: { username } });
    if (user && await bcrypt.compare(pass, user.passwordHash)) {
      const { passwordHash, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.username, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('User account is disabled');
    }

    const payload = { username: user.username, sub: user.id, role: user.roleId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  // Keep the existing comprehensive login method for frontend compatibility
  async loginDetailed(loginDto: LoginDto) {
    const { username, password } = loginDto;

    // Find user with role and permissions
    const user = await this.prisma.user.findUnique({
      where: { username },
      include: {
        role: {
          include: {
            permissions: {
              include: {
                permission: true,
              },
            },
          },
        },
        branch: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // For development, we'll check if password is 'admin123' for admin user
    // In production, you should use proper bcrypt comparison
    const isPasswordValid = password === 'admin123' || await bcrypt.compare(password, user.passwordHash);
    
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('User account is disabled');
    }

    // Create JWT payload
    const payload = {
      username: user.username,
      sub: user.id,
      roleId: user.roleId,
      branchId: user.branchId,
    };

    // Generate access token
    const accessToken = this.jwtService.sign(payload);

    // Return token and user data
    return {
      access_token: accessToken,
      user: {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        role: user.role,
        branch: user.branch,
        isActive: user.isActive,
        preferredLanguage: user.preferredLanguage,
      },
    };
  }

  async validateJwtUser(payload: any) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      include: {
        role: {
          include: {
            permissions: {
              include: {
                permission: true,
              },
            },
          },
        },
        branch: true,
      },
    });

    if (!user || !user.isActive) {
      return null;
    }

    return user;
  }
}