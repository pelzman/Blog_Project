import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtStrategy } from 'src/common/strategies/jwt.strategy';

import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RolesGuard } from 'src/common/auth/guards/role.guard';
import { env } from 'src/configs/env.config';
import { APP_GUARD } from '@nestjs/core';
import { JwtGuard } from 'src/common/auth/guards/jwt.guard';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  exports: [AuthService],
})
export class AuthModule {}
