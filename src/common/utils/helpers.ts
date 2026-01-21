import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';
import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';
import { env } from '../../configs';



    

 export const generateSlug = async (title: string): Promise<string> => {
  const prisma = new PrismaClient();
  const baseSlug = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existingSlug = await prisma.post.findUnique({ where: { slug } });
    if (!existingSlug) break;

    slug = `${baseSlug}-${counter++}`;
  }

  return slug;
};

function hashToken(token: string) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

function createJti() {
  return crypto.randomBytes(16).toString('hex');
}

function signAccesstoken(user): string {
  const payload = { id: user.id, role: user.role };
  return jwt.sign(payload, env.JWT_SECRET_ACCESS, {
    expiresIn: Number(env.ACCESS_TTL),
  });
}

function signRefreshToken(user, jti) {
  const payload = { id: user.id, jti };
  const token = jwt.sign(payload, env.JWT_SECRET_REFRESH, {
    expiresIn: Number(env.REFRESH_TTL_SEC),
  });
  return token;
}

type refreshType = {
  userId: number;
  refreshToken: string;
  jti: string;
  ip: string;
  userAgent: string;
};

async function persistRefreshToken(refreshData: refreshType, prisma) {
  const tokenHash = hashToken(refreshData.refreshToken);
  const expireAt = new Date(Date.now() + Number(env.REFRESH_TTL_SEC) * 1000);

  await this.prisma.refreshToken.create({
    data: {
      jit: refreshData.jti,
      expireAt,
      tokenHash,
      ip: refreshData.ip,
      userAgent: refreshData.userAgent,
      connect: {
        user: { id: refreshData.userId },
      },
    },
  });
}

function setRefreshCookies(res, refreshToken) {
  const isProd = env.NODE_ENV === 'production';

  res.cookies('refresh_token', refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'strict',
    path: '/api/auth/refresh',
    maxAge: env.REFRESH_TTL_SEC,
  });
}

async function rotateRefreshToken(currentRefreshToken, user, req, res, prisma) {
  currentRefreshToken.revokeAt = new Date();
  const newjti = createJti();
  const newAccessToken = signAccesstoken(user);
  const newRefreshToken = signRefreshToken(user, newjti);
  const refreshData = {
    userId: user.id,
    refreshToken: newRefreshToken,
    jti: newjti,
    ip: req.ip,
    userAgent: req.headers['user-agent'] || '',
  };

  await persistRefreshToken(
    refreshData,
    prisma,
  );
   setRefreshCookies(res, newRefreshToken)
  return {accessToken: newAccessToken}
}

 
