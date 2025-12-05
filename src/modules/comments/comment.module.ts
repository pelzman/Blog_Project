import { Module } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CommentService } from "./comment.service";
import { PostService } from "../posts/post.service";
import { UserService } from "../users/user.service";
import { CommentController } from "./comment.controller";
import { cloudinaryProvider } from "src/cloudinary/cloudinary.provider";
import { CloudinaryService } from "src/cloudinary/cloudinary.service";

@Module({
    controllers:[CommentController],
    providers:[CommentService, PrismaService, PostService, UserService, cloudinaryProvider, CloudinaryService],
    exports:[CommentService]
})
export class CommentModule{}