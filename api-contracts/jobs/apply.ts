export type JobsApplyRequestParam = {
  name: string;
  email: string;
  address: string;
  jobid: number;
  fields: { text: string; fieldId: number }[];
};
export type JobsApplyResponseParam = {
  id: number;
  email: string;
  jobId: number | null;
};
