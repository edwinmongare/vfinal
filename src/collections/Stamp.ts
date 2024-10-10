import { CollectionConfig } from "payload/types";

export const Stamp: CollectionConfig = {
  slug: "stampTemplate",
  hooks: {
    beforeChange: [
      ({ req, data }) => {
        return { ...data, user: req.user.id };
      },
    ],
  },
  access: {
    read: ({ req }) =>
      req.user.role === "admin" ||
      req.user.role === "user" ||
      req.user.role === "superadmin",
    create: ({ req }) => req.user.role === "superadmin",
    update: ({ req }) => req.user.role === "superadmin",
    delete: ({ req }) => req.user.role === "superadmin",
  },
  admin: {
    hidden: false,
    useAsTitle: "stampTemplate",
  },
  upload: {
    staticURL: "/stamp",
    staticDir: "stamp",
    mimeTypes: ["image/*"],
  },
  fields: [],
};
