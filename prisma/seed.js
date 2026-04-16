const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const email = process.env.APP_OWNER_EMAIL || "host@example.com";

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      name: "Scaler Host",
      defaultTimezone: "Asia/Kolkata"
    },
    create: {
      email,
      name: "Scaler Host",
      defaultTimezone: "Asia/Kolkata"
    }
  });

  const schedule = await prisma.availabilitySchedule.findFirst({
    where: {
      userId: user.id,
      isDefault: true
    }
  });

  const defaultSchedule =
    schedule ||
    (await prisma.availabilitySchedule.create({
      data: {
        userId: user.id,
        name: "Default Weekly Hours",
        timezone: user.defaultTimezone,
        isDefault: true,
        isActive: true
      }
    }));

  await prisma.availabilitySlot.deleteMany({
    where: { scheduleId: defaultSchedule.id }
  });

  await prisma.availabilitySlot.createMany({
    data: [
      { scheduleId: defaultSchedule.id, dayOfWeek: 1, startMinute: 540, endMinute: 720 },
      { scheduleId: defaultSchedule.id, dayOfWeek: 1, startMinute: 840, endMinute: 1080 },
      { scheduleId: defaultSchedule.id, dayOfWeek: 2, startMinute: 540, endMinute: 1020 },
      { scheduleId: defaultSchedule.id, dayOfWeek: 3, startMinute: 540, endMinute: 1020 },
      { scheduleId: defaultSchedule.id, dayOfWeek: 4, startMinute: 600, endMinute: 1020 },
      { scheduleId: defaultSchedule.id, dayOfWeek: 5, startMinute: 540, endMinute: 900 }
    ]
  });

  const eventType = await prisma.eventType.upsert({
    where: { slug: "intro-call" },
    update: {
      userId: user.id,
      name: "Intro Call",
      description: "A friendly 30 minute intro meeting.",
      durationMinutes: 30,
      bufferBeforeMins: 15,
      bufferAfterMins: 15,
      bookingNoticeMins: 60,
      locationType: "google-meet",
      locationValue: "Meeting link sent after booking."
    },
    create: {
      userId: user.id,
      name: "Intro Call",
      description: "A friendly 30 minute intro meeting.",
      slug: "intro-call",
      durationMinutes: 30,
      bufferBeforeMins: 15,
      bufferAfterMins: 15,
      bookingNoticeMins: 60,
      locationType: "google-meet",
      locationValue: "Meeting link sent after booking."
    }
  });

  await prisma.customQuestion.deleteMany({
    where: { eventTypeId: eventType.id }
  });

  await prisma.customQuestion.createMany({
    data: [
      {
        eventTypeId: eventType.id,
        label: "What would you like to discuss?",
        type: "LONG_TEXT",
        isRequired: true,
        sortOrder: 0,
        options: []
      },
      {
        eventTypeId: eventType.id,
        label: "Company name",
        type: "SHORT_TEXT",
        isRequired: false,
        sortOrder: 1,
        options: []
      }
    ]
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });

