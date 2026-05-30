const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  try {
    const keyword = 't';
    const currentUserId = 1;

    const users = await prisma.user.findMany({
      where: {
        AND: [
          { id: { not: currentUserId } },
          {
            OR: [
              { username: { contains: keyword, mode: 'insensitive' } },
              { email: { contains: keyword, mode: 'insensitive' } },
              { fullName: { contains: keyword, mode: 'insensitive' } }
            ]
          }
        ]
      },
      select: { id: true, username: true, email: true, fullName: true },
      take: 10
    });

    console.log("SUCCESS:", users);
  } catch (err) {
    console.error("ERROR:", err);
  } finally {
    await prisma.$disconnect();
  }
}

test();
