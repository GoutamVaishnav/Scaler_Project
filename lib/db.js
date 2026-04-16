import { prisma } from "@/lib/prisma";

export async function getDashboardUser() {
  const email = process.env.APP_OWNER_EMAIL;

  if (email) {
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (user) {
      return user;
    }
  }

  return prisma.user.findFirst({
    orderBy: { createdAt: "asc" }
  });
}

export async function requireDashboardUser() {
  const user = await getDashboardUser();

  if (!user) {
    throw new Error("No dashboard user found. Run the Prisma seed script first.");
  }

  return user;
}

