import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dtos/siguUp.dto';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { LoginDto } from './dtos/login.dto';
import { PayloadDto } from './dtos/payload.dto';
import { AuthResponse } from './dtos/response.dto';
import { plainToInstance } from 'class-transformer';
import { env } from 'src/configs/env.config';
import { RefereshDto } from './dtos/refreshToken.dto';
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signUp(dto: SignUpDto) {
    // check if user already exist
    const userExist = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (userExist) throw new UnauthorizedException('Email alredy exist');

    // create role
    const role = await this.prisma.role.upsert({
      where: {
        name: dto.role,
      },
      update: {},
      create: {
        name: dto.role,
      },
    });

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: hashedPassword,
        role: { connect: { id: role.id } },
      },
    });

    const payload: PayloadDto = {
      id: user?.id,
      role: role.name,
      email: user?.email,
      userName: user.name,
    };

    // generate token
    const token = this.generateToken(payload);
    return plainToInstance(AuthResponse, {
      id: user.id,
      name: user.name,
      email: user.email,
      role: role.name,
      token,
    });
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: { role: true },
    });

    if (!user) throw new UnauthorizedException('Invalid Credentials');

    // compare the password
    const isMatchedPassword = await bcrypt.compare(dto.password, user.password);

    if (!isMatchedPassword)
      throw new UnauthorizedException('Incorrect Password');
    // generate token
    const payload: PayloadDto = {
      id: user?.id,
      role: user?.role?.name,
      email: user?.email,
      userName: user.name,
    };
    const tokens = this.getTokens(user.id, user.email, user.role.name);
    await this.updateRefreshToken(user.id, (await tokens).refreshToken);

    return plainToInstance(AuthResponse, {
      id: user.id,
      name: user.name,
      role: user.role.name,
      token: (await tokens).accessToken,
      refreshToke: (await tokens).refreshToken,
    });
  }

  private generateToken(user: PayloadDto) {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      userName: user?.userName,
    };

    return this.jwtService.sign(payload, {
      expiresIn: Number(env.JWT_EXPIRES),
    });
  }
  async getTokens(userId: number, email: string, role: string) {
    const payload = {
      id: userId,
      email,
      role,
    };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
    return { accessToken, refreshToken };
  }
  async updateRefreshToken(userId: number, refreshToken: string) {
    const hashTk = await bcrypt.hash(refreshToken, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { hashedRefreshToken: hashTk },
    });
  }
  async refresh(dto: RefereshDto) {
    try {
      this.jwtService.verify(dto.refreshToken);
    } catch (error) {
      throw new UnauthorizedException('Refresh token expired');
    }
    const user = await this.prisma.user.findUnique({
      where: { id: dto.userId },
      include: { role: true },
    });
    console.log(user);
    if (!user || !user.hashedRefreshToken)
      throw new UnauthorizedException('Access Denied');
    const refreshMatch = await bcrypt.compare(
      dto.refreshToken,
      user.hashedRefreshToken,
    );
    if (!refreshMatch) throw new UnauthorizedException('Invalid refresh token');
    const tokens = await this.getTokens(user.id, user.email, user.role.name);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }
}
