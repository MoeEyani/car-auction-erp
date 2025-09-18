// src/auth/strategies/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET') || 'your-super-secret-jwt-key-change-this-in-production',
    });
  }

  async validate(payload: any) {
    // The payload is the decrypted token: { username, sub, role }
    // This will be attached to the request object as request.user
    return { userId: payload.sub, username: payload.username, roleId: payload.role };
  }
}