import { Access, CollectionConfig } from "payload/types";

const adminsAndUser: Access = ({ req: { user } }) => {
  if (user.role === "superadmin") return true;

  return {
    id: {
      equals: user.id,
    },
  };
};
export const Users: CollectionConfig = {
  slug: "users",
  auth: {
    verify: {
      generateEmailHTML: ({ token }) => {
        return `<a href='${process.env.NEXT_PUBLIC_SERVER_URL}/verify-email?token=${token}'></a>`;
      },
    },
  },
  access: {
    read: adminsAndUser,
    create: () => true,
    update: ({ req }) => req.user.role === "superadmin",
    delete: ({ req }) => req.user.role === "superadmin",
  },
  admin: {
    hidden: ({ user }) => user.role !== "superadmin",
    defaultColumns: ["id"],
  },
  fields: [
    {
      name: "orders",
      label: "orders",
      admin: {
        condition: () => false,
      },
      type: "relationship",
      relationTo: "orders",
      hasMany: true,
    },

    {
      name: "role",
      defaultValue: "user",
      required: true,
      admin: {
        condition: () => true,
      },
      type: "select",
      options: [
        { label: "Admin", value: "admin" },
        { label: "User", value: "user" },
        { label: "Super Admin", value: "superadmin" },
      ],
    },
  ],
};
