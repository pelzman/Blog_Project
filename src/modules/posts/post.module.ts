import { Module } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { PostService } from "./post.service";
import { PostController } from "./post.controller";
import { UserService } from "../users/user.service";
import { CloudinaryService } from "src/cloudinary/cloudinary.service";
import { cloudinaryProvider } from "src/cloudinary/cloudinary.provider";

@Module({
    controllers:[PostController],
    providers:[ PostService,  PrismaService, UserService, cloudinaryProvider, CloudinaryService],
    exports:[PostService]
})
export class PostModule{}