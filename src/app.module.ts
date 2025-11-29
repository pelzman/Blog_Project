import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/users/user.module';
import { AuthController } from './modules/auth/auth.controller';
import { AuthService } from './modules/auth/auth.service';
import { PrismaModule } from './prisma/prisma.module';
@Module({
  imports: [ PrismaModule,AuthModule, UserModule],

})
export class AppModule {}
