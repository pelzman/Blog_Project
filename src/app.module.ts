import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/users/user.module';
import { AuthController } from './modules/auth/auth.controller';
import { AuthService } from './modules/auth/auth.service';
import { PrismaModule } from './prisma/prisma.module';
import { PostModule } from './modules/posts/post.module';
import { CommentModule } from './modules/comments/comment.module';
import { TagModule } from './modules/tags/tag.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { CategoryModule } from './modules/categories/category.module';
@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UserModule,
    PostModule,
    CommentModule,
    TagModule,
    CloudinaryModule,
    CategoryModule
  ],
})
export class AppModule {}
