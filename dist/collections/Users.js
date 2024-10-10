"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Users = void 0;
var adminsAndUser = function (_a) {
    var user = _a.req.user;
    if (user.role === "superadmin")
        return true;
    return {
        id: {
            equals: user.id,
        },
    };
};
exports.Users = {
    slug: "users",
    auth: {
        verify: {
            generateEmailHTML: function (_a) {
                var token = _a.token;
                return "<a href='".concat(process.env.NEXT_PUBLIC_SERVER_URL, "/verify-email?token=").concat(token, "'></a>");
            },
        },
    },
    access: {
        read: adminsAndUser,
        create: function () { return true; },
        update: function (_a) {
            var req = _a.req;
            return req.user.role === "superadmin";
        },
        delete: function (_a) {
            var req = _a.req;
            return req.user.role === "superadmin";
        },
    },
    admin: {
        hidden: function (_a) {
            var user = _a.user;
            return user.role !== "superadmin";
        },
        defaultColumns: ["id"],
    },
    fields: [
        {
            name: "orders",
            label: "orders",
            admin: {
                condition: function () { return false; },
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
                condition: function () { return true; },
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
