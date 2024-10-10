import { CollectionConfig, Access } from "payload/types";

export const issuingOfficer: CollectionConfig = {
  slug: "issuingOfficer",
  admin: {
    useAsTitle: "issuingOfficer",
    // defaultColumns: ["email", "surname", "localGovernment", "firstName"],
    hideAPIURL: false,
    description: "Add the issuing officer",
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
  //   read: ({ req: { user } }) => user.role === "user" || user.role === "admin",
  //   update: ({ req: { user } }) =>
  //     user.role === "user" || user.role === "admin",
  //   delete: ({ req: { user } }) => user.role === "admin",
  //   create: ({ req: { user } }) =>
  //     user.role === "user" || user.role === "admin",
  // },

  fields: [
    {
      name: "issuingOfficer",
      label: "issuing officer",
      type: "text",
      required: true,
    },
  ],
};
