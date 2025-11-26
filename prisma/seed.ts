/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { env } from 'src/configs/env.config';
const prisma = new PrismaClient();

async function main() {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  const hashedPassword: string = await bcrypt.hash(env.LOGIN_PASSWORD, 10);

  const roles = {
    ADMIN: await prisma.role.create({
      data: { name: 'ADMIN' },
    }),
    USER: await prisma.role.create({
      data: { name: 'USER' },
    }),
  };
  const users = [
    {
      name: 'Admin super',
      email: 'adminUser@example.com',
      password: hashedPassword,
      role: {
        connect: { id: roles.ADMIN.id },
      },
    },
    {
      name: 'Joe Doe',
      email: 'jd@example.com',
      password: hashedPassword,
      role: {
        connect: { id: roles.USER.id },
      },
    },

    {
      name: 'Cynthia Morgan',
      email: 'cm@example.com',
      password: hashedPassword,
      role: {
        connect: { id: roles.USER.id },
      },
    },
  ];
  for (const user of users) {
    await prisma.user.create({
      data: { ...user, password: hashedPassword },
    });
  }

  console.log('Seeding created sucessfully');
}
main()
  .catch((e) => {
    console.log('An error occur', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
