import { CollectionConfig } from "payload/types";

export const Certificate: CollectionConfig = {
  slug: "certificateTemplate",
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
  // access: {
  //   read: ({ req }) => req.user.role === "admin" || req.user.role === "user",
  //   create: ({ req }) => req.user.role === "admin",
  //   update: ({ req }) => req.user.role === "admin",
  // },
  admin: {
    hidden: false,
    useAsTitle: "certificateTemplate",
  },
  upload: {
    staticURL: "/certificate",
    staticDir: "certificate",
    mimeTypes: ["application/pdf"],
  },
  fields: [],
};
