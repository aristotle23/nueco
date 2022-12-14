import faker from "@faker-js/faker";

import prisma from "@helpers/prisma";

export async function createJob(companyId: number) {
  return await prisma.job.create({
    data: {
      uid: faker.datatype.uuid(),
      title: faker.random.words(),
      description: faker.lorem.paragraphs(),
      companyId,
      Field: {
        create: {
          label: "Qualification",
          companyId,
          type: "SHORT_TEXT",
        },
      },
    },
  });
}
