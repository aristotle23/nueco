import JobEntity from "@business-logic/Job";
import { Job } from "@prisma/client";

import prisma from "@helpers/prisma";
import { createJob } from "@helpers/tests/createJob";
import { minimalSetup } from "@helpers/tests/setup";
import { teardown } from "@helpers/tests/teardown";

describe("Job", () => {
  beforeEach(async () => {
    await teardown();
  });

  describe("#create", () => {
    it("creates job", async () => {
      const { user } = await minimalSetup();

      const requestParams = {
        title: "Software Engineer",
        description: "You write code.",
      };

      const entity = new JobEntity();
      const result = await entity.create(requestParams, user.id);

      const job = (await prisma.job.findUnique({ where: { id: result.id } })) as Job;

      expect(job.title).toBe(requestParams.title);
      expect(job.description).toBe(requestParams.description);
    });

    it("throws error if user was not found", async () => {
      await minimalSetup();

      const requestParams = {
        title: "Software Engineer",
        description: "You write code.",
      };

      const nonExistingUserId = 99999;
      const entity = new JobEntity();

      await expect(async () => {
        await entity.create(requestParams, nonExistingUserId);
      }).rejects.toThrowError("Not found");
    });
  });

  describe("#list", () => {
    it("lists all jobs of user", async () => {
      const { user } = await minimalSetup();

      await Promise.all([createJob(user.companyId), createJob(user.companyId)]);

      const entity = new JobEntity();
      const result = await entity.list(user.id);

      expect(result.length).toBe(2);
    });

    it("throws error if user was not found", async () => {
      await minimalSetup();

      const nonExistingUserId = 99999;
      const entity = new JobEntity();

      await expect(async () => {
        await entity.list(nonExistingUserId);
      }).rejects.toThrowError("Not found");
    });
  });
  describe("#apply", () => {
    it("apply for a job", async () => {
      const { user } = await minimalSetup();
      const jobs = await createJob(user.companyId);
      const field = await prisma.field.create({
        data: {
          label: "",
          //companyId: 1,
          type: "SHORT_TEXT",
          jobId: jobs.id,
          companyId: user.companyId,
        },
      });
      const applyParam = {
        name: "Test One",
        email: "mail234@mail.com",
        addres: "address 21",
        jobid: jobs.id,
        fields: [{ text: "Bsc", fieldId: field.id }],
      };
      const entity = new JobEntity();
      const candidate = await entity.apply(applyParam);
      await expect(candidate).toHaveProperty("email", applyParam.email);
    });
    it("already apply", async () => {
      const { user } = await minimalSetup();
      const jobs = await createJob(user.companyId);
      const field = await prisma.field.create({
        data: {
          label: "",
          //companyId: 1,
          type: "SHORT_TEXT",
          jobId: jobs.id,
          companyId: user.companyId,
        },
      });
      const applyParam = {
        name: "Test One",
        email: "mail234@mail.com",
        addres: "address 21",
        jobid: jobs.id,
        fields: [{ text: "Bsc", fieldId: field.id }],
      };
      const entity = new JobEntity();
      await entity.apply(applyParam);
      const candidate = await entity.apply(applyParam);
      await expect(candidate).toBe(null);
    });
  });
});
