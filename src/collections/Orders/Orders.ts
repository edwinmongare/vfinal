import { CollectionConfig, Access } from "payload/types";
import {
  AfterChangeHook,
  BeforeChangeHook,
} from "payload/dist/collections/config/types";
import { User, Order, IssuingOfficer } from "../../payload-types";
import payload from "payload";
import { PrimaryActionEmailHtml } from "../../components/emails/PrimaryActionEmail";

const addUser: BeforeChangeHook<Order> = async ({ req, data, originalDoc }) => {
  const user = req.user;

  // If it's an update operation, do not modify the user field
  if (originalDoc) {
    return data;
  }

  return { ...data, user: user.id };
};

// Define the BeforeChangeHook to add the issuing officer to the order
const issuingOfficer: BeforeChangeHook<Order> = async ({
  req,
  data,
  originalDoc,
}) => {
  const issuingOfficerData = originalDoc?.issuingOfficer || data.issuingOfficer;
  console.log(issuingOfficerData, "issuingOfficerData");
  return { ...data, issuingOfficer: issuingOfficerData };
};

const sendVerificationEmailAfterApproval: AfterChangeHook<Order> = async ({
  req,
  doc,
}) => {
  const { approvedForSale, user } = doc;

  if (approvedForSale === "approved") {
    let userEmail: string | null = null;

    // Directly access the email from the user array
    if (Array.isArray(user) && user.length > 0) {
      const firstUser = user[0]; // Assuming you want the email from the first user in the array
      if (firstUser && typeof firstUser === "object" && "email" in firstUser) {
        userEmail = firstUser.email || null; // Get the email if it exists
      }
    }

    // Check if userEmail is valid
    if (!userEmail) {
      req.payload.logger.error(
        "No valid email address found for order confirmation."
      );
      return; // Early exit
    }

    // Generate the email HTML content
    const emailHtml = await PrimaryActionEmailHtml({
      actionLabel: "Pacesetter Account",
      buttonText: "Download certificate",
      href: `${process.env.NEXT_PUBLIC_SERVER_URL}`,
    });

    // Attempt to send the email
    try {
      await payload.sendEmail({
        from: "no_reply@stateoforigin.oyostate.gov.ng",
        to: userEmail,
        subject: "Order Confirmed",
        html: emailHtml,
      });

      req.payload.logger.info(`Email successfully sent to ${userEmail}`);
    } catch (error) {
      // Log errors clearly
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      req.payload.logger.error(
        `Failed to send email to ${userEmail}: ${errorMessage}`
      );
    }
  }
};

const yourOwnAndPurchased: Access = async ({ req }) => {
  const user = req.user as User | null;

  // Ensure the condition checks the role correctly
  if (user?.role === "admin" || user?.role === "superadmin") return true;
  if (!user) return false;

  // Get products related to the user
  const { docs: products } = await req.payload.find({
    collection: "orders",
    depth: 1,
    where: {
      user: {
        equals: user.id,
      },
    },
  });

  // Collect IDs of own products
  const ownProductFileIds = products.map((prod) => prod.id).flat();

  // Get orders related to the user
  const { docs: orders } = await req.payload.find({
    collection: "orders",
    depth: 2,
    where: {
      user: {
        equals: user.id,
      },
    },
  });

  // Collect IDs of purchased products
  const purchasedProductFileIds = orders
    .map((order) => {
      return orders.map((product) => {
        if (typeof product === "string")
          return req.payload.logger.error(
            "Search depth not sufficient to find purchased file ID's"
          );

        return typeof product.id === "string" ? product.id : product.id;
      });
    })
    .filter(Boolean)
    .flat();

  return {
    id: {
      in: [...ownProductFileIds, ...purchasedProductFileIds],
    },
  };
};

export const Orders: CollectionConfig = {
  slug: "orders",
  admin: {
    useAsTitle: "orders",
    defaultColumns: ["email", "surname", "localGovernment", "firstName"],
    hideAPIURL: false,
    description: "Approve or reject incoming orders",
  },
  hooks: {
    beforeChange: [addUser, issuingOfficer],
    afterChange: [sendVerificationEmailAfterApproval],
  },
  access: {
    read: yourOwnAndPurchased,
    update: ({ req: { user } }) =>
      user.role === "user" ||
      user.role === "admin" ||
      user.role === "administrator",
    delete: ({ req: { user } }) =>
      user.role === "admin" || user.role === "administrator",
    create: ({ req: { user } }) => user.role === "user",
  },
  upload: {
    staticURL: "/media",
    staticDir: "media",
    mimeTypes: ["image/*", "application/pdf"],
  },
  fields: [
    {
      name: "user",
      label: "user",
      admin: {
        condition: () => true,
      },
      type: "relationship",
      relationTo: "users",
      hasMany: true,
    },

    {
      name: "surname",
      label: "Surname",
      type: "text",
      required: true,
    },
    {
      name: "firstName",
      label: "First Name",
      type: "text",
      required: true,
    },
    {
      name: "otherName",
      label: "Other Name",
      type: "text",
      required: false,
    },
    {
      name: "localGovernment",
      label: "Local Government",
      type: "text",
      required: true,
    },
    {
      name: "homeTown",
      label: "Home Town",
      type: "text",
      required: true,
    },
    {
      name: "compoundOrVillage",
      label: "Compound / village",
      type: "text",
      required: true,
    },
    {
      name: "price",
      label: "Price in Naira",
      type: "text",
      required: true,
      defaultValue: "8000",
    },
    {
      name: "approvedForSale",
      label: "Order Status",
      type: "select",
      defaultValue: "pending",
      options: [
        {
          label: "Pending verification",
          value: "pending",
        },
        {
          label: "Approved",
          value: "approved",
        },
        {
          label: "Denied",
          value: "denied",
        },
      ],
    },
    {
      name: "_flutterwaveID",
      label: "FlutterWave Payment ID",
      access: {
        read: ({ req }) =>
          req.user.role === "admin" || req.user.role === "user",
        create: ({ req }) =>
          req.user.role === "admin" || req.user.role === "user",
        update: ({ req }) =>
          req.user.role === "admin" || req.user.role === "user",
      },
      type: "text",
      required: true,
      defaultValue: "no payment id",
    },
    {
      name: "issuingOfficer",
      label: "issuing officer",
      type: "relationship",
      relationTo: "issuingOfficer",
      hasMany: true,
    },
    {
      name: "stampTemplate",
      label: "Stamp",
      type: "relationship",
      relationTo: "stampTemplate",
      hasMany: true,
    },
    {
      name: "_isPaid",
      type: "checkbox",
      access: {
        read: ({ req }) =>
          req.user.role === "admin" || req.user.role === "user",
        create: ({ req }) => req.user.role === "admin",
        update: ({ req }) =>
          req.user.role === "admin" || req.user.role === "user",
      },
      admin: {
        hidden: true,
      },
      required: true,
    },
  ],
};
