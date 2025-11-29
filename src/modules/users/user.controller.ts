import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDTO } from './dtos/user.dto';
import { JwtGuard } from 'src/common/auth/guards/jwt.guard';
import { Roles } from 'src/common/auth/decorators/role.decorator';
import { RolesGuard } from 'src/common/auth/guards/role.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get()
  @Roles('ADMIN')
  @UseGuards(JwtGuard, RolesGuard)
  async getUsers() {
    const data = await this.userService.getUsers();
    return {
      status: 200,
      message: 'Users fetched successfully',
      data,
    };
  }
  @Get(':userId')
  @UseGuards(JwtGuard)
  async getUser(@Param('userId') userId: string) {
    const data = await this.userService.getUser(Number(userId));
    return {
      status: 200,
      message: 'User fetched successfully',
      data,
    };
  }
  @Put(':userId')
  async updateUser(@Param('userId') userId: string, @Body() dto: UserDTO) {
    const data = await this.userService.updateUser(Number(userId), dto);
    return {
      status: 200,
      message: 'User updated successfully',
      data,
    };
  }
}
