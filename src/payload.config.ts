import { webpackBundler } from "@payloadcms/bundler-webpack";
import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { slateEditor } from "@payloadcms/richtext-slate";
import dotenv from "dotenv";
import path from "path";
import { buildConfig } from "payload/config";
import { Users } from "./collections/Users";
import { Orders } from "./collections/Orders/Orders";
import { Icon } from "../src/components/Icon"; // Update import here
import { Logo } from "../src/components/Icon";
import { Certificate } from "./collections/Certificate";
import { issuingOfficer } from "./collections/IssuingOfficer";
import { Stamp } from "./collections/Stamp";
//import { lexicalEditor } from "@payloadcms/richtext-lexical";

dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});


export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || "",

  collections: [Users, Orders, Certificate, issuingOfficer, Stamp],
  routes: {
    admin: "/admin",
  },
  admin: {
    user: "users",
    bundler: webpackBundler(),
    meta: {
      titleSuffix: "- The Pacesetter",
      favicon: "/favicon.ico",
      ogImage: "/thumbnail.jpg",
    },
    components: {
      // graphics: {
      //   Icon,
      //   Logo,
      // },
    },
  },
  upload: {
    limits: {
      fileSize: 5000000, // 5MB, written in bytes
    },
  },
  rateLimit: {
    max: 2000,
  },
  editor: slateEditor({}),
  //editor: lexicalEditor({}),
  db: mongooseAdapter({
    url: process.env.MONGODB_URL!,
  }),
  typescript: {
    outputFile: path.resolve(__dirname, "payload-types.ts"),
  },
});
