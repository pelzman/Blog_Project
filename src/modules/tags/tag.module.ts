import { Module } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { TagService } from "./tag.service";
import { TagController } from "./tag.controller.";

@Module({
   controllers:[TagController],
   providers:[PrismaService, TagService],
   exports:[TagService]
})
export  class TagModule{}