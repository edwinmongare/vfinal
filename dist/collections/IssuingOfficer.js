"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.issuingOfficer = void 0;
exports.issuingOfficer = {
    slug: "issuingOfficer",
    admin: {
        useAsTitle: "issuingOfficer",
        // defaultColumns: ["email", "surname", "localGovernment", "firstName"],
        hideAPIURL: false,
        description: "Add the issuing officer",
    },
    access: {
        read: function (_a) {
            var req = _a.req;
            return req.user.role === "admin" ||
                req.user.role === "user" ||
                req.user.role === "superadmin";
        },
        create: function (_a) {
            var req = _a.req;
            return req.user.role === "superadmin";
        },
        update: function (_a) {
            var req = _a.req;
            return req.user.role === "superadmin";
        },
        delete: function (_a) {
            var req = _a.req;
            return req.user.role === "superadmin";
        },
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
