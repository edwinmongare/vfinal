"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Certificate = void 0;
exports.Certificate = {
    slug: "certificateTemplate",
    hooks: {
        beforeChange: [
            function (_a) {
                var req = _a.req, data = _a.data;
                return __assign(__assign({}, data), { user: req.user.id });
            },
        ],
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
