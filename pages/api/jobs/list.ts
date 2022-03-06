import { JobsListResponseParams as ResponseParams } from "@api-contracts/jobs/list";
import JobEntity from "@business-logic/Job";
import HttpError from "@business-logic/errors/HttpError";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return;

  const session = await getSession({ req });
  if (!session) return res.status(401).json("Not authenticated");

  const entity = new JobEntity();

  try {
    const response: ResponseParams = await entity.list(session.user.id);
    return res.status(201).json(response);
  } catch (error) {
    if (error instanceof HttpError) return res.status(error.code).json(error.message);
    throw error;
  }
}
