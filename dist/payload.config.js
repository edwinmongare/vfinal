"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var bundler_webpack_1 = require("@payloadcms/bundler-webpack");
var db_mongodb_1 = require("@payloadcms/db-mongodb");
var richtext_slate_1 = require("@payloadcms/richtext-slate");
var dotenv_1 = __importDefault(require("dotenv"));
var path_1 = __importDefault(require("path"));
var config_1 = require("payload/config");
var Users_1 = require("./collections/Users");
var Orders_1 = require("./collections/Orders/Orders");
var Certificate_1 = require("./collections/Certificate");
var IssuingOfficer_1 = require("./collections/IssuingOfficer");
var Stamp_1 = require("./collections/Stamp");
dotenv_1.default.config({
    path: path_1.default.resolve(__dirname, "../.env"),
});
var redirectToAnalytics = function () {
    window.location.href = "http://localhost:3000/analytics";
};
exports.default = (0, config_1.buildConfig)({
    serverURL: process.env.NEXT_PUBLIC_SERVER_URL || "",
    collections: [Users_1.Users, Orders_1.Orders, Certificate_1.Certificate, IssuingOfficer_1.issuingOfficer, Stamp_1.Stamp],
    routes: {
        admin: "/admin",
    },
    admin: {
        user: "users",
        bundler: (0, bundler_webpack_1.webpackBundler)(),
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
    rateLimit: {
        max: 2000,
    },
    editor: (0, richtext_slate_1.slateEditor)({}),
    //editor: lexicalEditor({}),
    db: (0, db_mongodb_1.mongooseAdapter)({
        url: process.env.MONGODB_URL,
    }),
    typescript: {
        outputFile: path_1.default.resolve(__dirname, "payload-types.ts"),
    },
});
