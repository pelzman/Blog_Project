import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dtos/siguUp.dto';
import { LoginDto } from './dtos/login.dto';
import { JwtGuard } from 'src/common/auth/guards/jwt.guard';
import { RolesGuard } from 'src/common/auth/guards/role.guard';
import { User } from 'src/common/auth/decorators/user.decorator';
import { Roles } from 'src/common/auth/decorators/role.decorator';
import { plainToInstance } from 'class-transformer';
import { AuthResponse } from './dtos/response.dto';
import { RefereshDto } from './dtos/refreshToken.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signup(@Body() dto: SignUpDto) {
    const data = await this.authService.signUp(dto);
    return {
      status: 200,
      message: 'User login successfully',
      data,
    };
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    const data = await this.authService.login(dto);
    return {
      status: 201,
      message: 'User login successfully',
      data,
    };
  }

  @Post('refresh')
  async refresh(@Body() dto: RefereshDto) {
    const token = await this.authService.refresh(dto);
    return {
      status: 201,
      message: 'Token refreshed successfully',
      token,
    };
  }

  // TEST  AUTHENTICATED USER
  @UseGuards(JwtGuard)
  @Get('get-me')
  async getProfile(@User() data) {
    return {
      status: 201,
      message: 'Profile fetched successfully',
      data,
    };
  }

  // TEST ROLE PROTECTED ROUTE

  @Get('admin-only')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('ADMIN')
  async getAdminData(@User() user) {
    try {
      return plainToInstance(AuthResponse, {
        status: 201,
        message: 'You are an admin',
        user,
      });
    } catch (error) {
      console.log(error);
    }
  }
}
