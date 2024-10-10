import { z } from "zod";
const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const orderCredentialsValidator = z.object({
  // email: z.string().email(),
  user: z.string(),
  price: z.number(),
  approvedForSale: z.union([
    z.literal("pending"),
    z.literal("approved"),
    z.literal("denied"),
  ]),
  surname: z.string().min(1, { message: "Surname cannot be blank" }),
  firstName: z.string().min(1, { message: "First name cannot be blank" }),
  otherName: z.string(),
  localGovernment: z
    .string()
    .min(1, { message: "Local Government cannot be blank" }),
  homeTown: z.string().min(1, { message: "Home town cannot be blank" }),
  compoundOrVillage: z.string().min(1, { message: "Compound cannot be blank" }),
  // passportImage: z
  //   .any()
  //   .refine((file) => file?.size <= MAX_FILE_SIZE, `Max image size is 5MB.`)
  //   .refine(
  //     (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
  //     "Only .jpg, .jpeg, .png and .webp formats are supported."
  //   ),
});

export type TorderCredentialsValidator = z.infer<
  typeof orderCredentialsValidator
>;
