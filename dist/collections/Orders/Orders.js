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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Orders = void 0;
var payload_1 = __importDefault(require("payload"));
var PrimaryActionEmail_1 = require("../../components/emails/PrimaryActionEmail");
var addUser = function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var user;
    var req = _b.req, data = _b.data, originalDoc = _b.originalDoc;
    return __generator(this, function (_c) {
        user = req.user;
        // If it's an update operation, do not modify the user field
        if (originalDoc) {
            return [2 /*return*/, data];
        }
        return [2 /*return*/, __assign(__assign({}, data), { user: user.id })];
    });
}); };
// Define the BeforeChangeHook to add the issuing officer to the order
var issuingOfficer = function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var issuingOfficerData;
    var req = _b.req, data = _b.data, originalDoc = _b.originalDoc;
    return __generator(this, function (_c) {
        issuingOfficerData = (originalDoc === null || originalDoc === void 0 ? void 0 : originalDoc.issuingOfficer) || data.issuingOfficer;
        console.log(issuingOfficerData, "issuingOfficerData");
        return [2 /*return*/, __assign(__assign({}, data), { issuingOfficer: issuingOfficerData })];
    });
}); };
var sendVerificationEmailAfterApproval = function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var approvedForSale, user, userEmails, emailHtml, _i, userEmails_1, userEmail;
    var req = _b.req, doc = _b.doc;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                approvedForSale = doc.approvedForSale, user = doc.user;
                if (!(approvedForSale === "approved")) return [3 /*break*/, 5];
                userEmails = Array.isArray(user)
                    ? user
                        .map(function (userId) { return (typeof userId === "string" ? userId : userId.email || ""); })
                        .filter(Boolean)
                    : [typeof user === "string" ? user : "edwinmongare15@gmail.com"];
                return [4 /*yield*/, (0, PrimaryActionEmail_1.PrimaryActionEmailHtml)({
                        actionLabel: "Pacesetter Account",
                        buttonText: "Download certificate",
                        href: "".concat(process.env.NEXT_PUBLIC_SERVER_URL),
                    })];
            case 1:
                emailHtml = _c.sent();
                _i = 0, userEmails_1 = userEmails;
                _c.label = 2;
            case 2:
                if (!(_i < userEmails_1.length)) return [3 /*break*/, 5];
                userEmail = userEmails_1[_i];
                return [4 /*yield*/, payload_1.default.sendEmail({
                        from: "delivered@resend.dev",
                        to: userEmail,
                        subject: "Order Confirmed",
                        html: emailHtml, // Use the resolved HTML string
                    })];
            case 3:
                _c.sent();
                _c.label = 4;
            case 4:
                _i++;
                return [3 /*break*/, 2];
            case 5: return [2 /*return*/];
        }
    });
}); };
var yourOwnAndPurchased = function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var user, products, ownProductFileIds, orders, purchasedProductFileIds;
    var req = _b.req;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                user = req.user;
                // Ensure the condition checks the role correctly
                if ((user === null || user === void 0 ? void 0 : user.role) === "admin" || (user === null || user === void 0 ? void 0 : user.role) === "superadmin")
                    return [2 /*return*/, true];
                if (!user)
                    return [2 /*return*/, false];
                return [4 /*yield*/, req.payload.find({
                        collection: "orders",
                        depth: 1,
                        where: {
                            user: {
                                equals: user.id,
                            },
                        },
                    })];
            case 1:
                products = (_c.sent()).docs;
                ownProductFileIds = products.map(function (prod) { return prod.id; }).flat();
                return [4 /*yield*/, req.payload.find({
                        collection: "orders",
                        depth: 2,
                        where: {
                            user: {
                                equals: user.id,
                            },
                        },
                    })];
            case 2:
                orders = (_c.sent()).docs;
                purchasedProductFileIds = orders
                    .map(function (order) {
                    return orders.map(function (product) {
                        if (typeof product === "string")
                            return req.payload.logger.error("Search depth not sufficient to find purchased file ID's");
                        return typeof product.id === "string" ? product.id : product.id;
                    });
                })
                    .filter(Boolean)
                    .flat();
                return [2 /*return*/, {
                        id: {
                            in: __spreadArray(__spreadArray([], ownProductFileIds, true), purchasedProductFileIds, true),
                        },
                    }];
        }
    });
}); };
exports.Orders = {
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
        update: function (_a) {
            var user = _a.req.user;
            return user.role === "user" || user.role === "admin" || user.role === "administrator";
        },
        delete: function (_a) {
            var user = _a.req.user;
            return user.role === "admin" || user.role === "administrator";
        },
        create: function (_a) {
            var user = _a.req.user;
            return user.role === "user";
        },
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
                condition: function () { return true; },
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
            defaultValue: "1000",
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
                read: function (_a) {
                    var req = _a.req;
                    return req.user.role === "admin" || req.user.role === "user";
                },
                create: function (_a) {
                    var req = _a.req;
                    return req.user.role === "admin";
                },
                update: function (_a) {
                    var req = _a.req;
                    return req.user.role === "admin" || req.user.role === "user";
                },
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
                read: function (_a) {
                    var req = _a.req;
                    return req.user.role === "admin" || req.user.role === "user";
                },
                create: function (_a) {
                    var req = _a.req;
                    return req.user.role === "admin";
                },
                update: function (_a) {
                    var req = _a.req;
                    return req.user.role === "admin" || req.user.role === "user";
                },
            },
            admin: {
                hidden: true,
            },
            required: true,
        },
    ],
};
