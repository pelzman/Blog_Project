import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { PrismaService } from '../../prisma/prisma.service';
import { UserController } from './user.controller';
import { APP_GUARD } from '@nestjs/core';
import { JwtGuard } from 'src/common/auth/guards/jwt.guard';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService],
  exports: [UserService],
})
export class UserModule {}
