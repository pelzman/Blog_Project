import { Module } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { PostService } from "./post.service";
import { PostController } from "./post.controller";
import { UserService } from "../users/user.service";

@Module({
    controllers:[PostController],
    providers:[ PostService,  PrismaService, UserService],
    exports:[PostService]
})
export class PostModule{}