import { Job } from "@prisma/client";

export type JobsListResponseParams = {
  uid: string;
  title: string;
  id: number;
  _count: {
    Candidate: number;
  };
}[];
