import { Controller, Post, Body, HttpStatus, HttpException, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';
import { AuthService, LoginDto, LoginResponse } from './auth.service';

@ApiTags('Authentication')
@Controller('api/v1/auth')
@UseGuards(ThrottlerGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'User login', description: 'Authenticates user and returns JWT token' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Authentication failed' })
  async login(@Body() loginDto: LoginDto): Promise<LoginResponse> {
    try {
      return await this.authService.login(loginDto);
    } catch (error) {
      throw new HttpException(
        error instanceof Error ? error.message : 'Authentication failed',
        HttpStatus.UNAUTHORIZED
      );
    }
  }
}
