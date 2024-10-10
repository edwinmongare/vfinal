import { z } from "zod";

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const testUploadValidator = z.object({
  filename: z.any(),
});

export type TtestUploadValidator = z.infer<typeof testUploadValidator>;
