"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Icon = exports.Logo = void 0;
/* eslint-disable @next/next/no-img-element */
var react_1 = __importDefault(require("react"));
var Logo = function () { return (react_1.default.createElement("div", { className: "h-10" },
    react_1.default.createElement("img", { style: { maxHeight: "200px", margin: "auto" }, src: "/logo.png", alt: "Logo" }))); };
exports.Logo = Logo;
var Icon = function () { return (react_1.default.createElement("div", { className: "h-10" },
    react_1.default.createElement("img", { style: { maxHeight: "50px", margin: "auto" }, src: "/logo.png", alt: "Logo" }))); };
exports.Icon = Icon;
