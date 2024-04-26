import { Prisma } from '@prisma/client'
import { prisma } from '../src/utils/prisma'
import { faker } from '@faker-js/faker'
import dayjs from 'dayjs'

async function seed() {
  const eventId = '9e9bd979-9d10-4915-b339-3786b1634f33'

  //   await prisma.event.deleteMany({
  //     where: {
  //       id: eventId,
  //     },
  //   })

  await prisma.event.create({
    data: {
      id: eventId,
      title: 'Unite Summit',
      slug: 'unite-summit',
      details: faker.lorem.paragraph(),
      maximumAttendees: 120,
    },
  })

  const attendeeToInsert: Prisma.AttendeeUncheckedCreateInput[] = []

  for (let i = 0; i < 120; i++) {
    attendeeToInsert.push({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      eventId,
      createdAt: faker.date.recent({
        days: 30,
        refDate: dayjs().subtract(8, 'days').toDate(),
      }),
      checkIn: faker.helpers.arrayElement<
        Prisma.CheckInUncheckedCreateNestedOneWithoutAttendeeInput | undefined
      >([
        undefined,
        {
          create: {
            createdAt: faker.date.recent({
              days: 7,
            }),
          },
        },
      ]),
    })
  }

  await Promise.all(
    attendeeToInsert.map((attendee) =>
      prisma.attendee.create({
        data: attendee,
      }),
    ),
  )
}

seed().then(() => {
  console.log('Database seeded')
  prisma.$disconnect()
})
