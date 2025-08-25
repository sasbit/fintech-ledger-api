import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ description: 'Username', example: 'testuser' })
  username: string;

  @ApiProperty({ description: 'Password', example: 'testpass' })
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async login(loginDto: LoginDto): Promise<LoginResponse> {
    // For demo purposes, accept any username/password
    // In production, you would validate against a user database
    if (!loginDto.username || !loginDto.password) {
      throw new Error('Username and password are required');
    }

    const payload = { username: loginDto.username, sub: Date.now() };
    
    return {
      access_token: this.jwtService.sign(payload),
      token_type: 'Bearer',
      expires_in: 86400, // 24 hours
    };
  }

  async validateToken(token: string): Promise<any> {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}
