/* tslint:disable */
/* eslint-disable */
/**
 * This file was automatically generated by Payload.
 * DO NOT MODIFY IT BY HAND. Instead, modify your source Payload config,
 * and re-run `payload generate:types` to regenerate this file.
 */

export interface Config {
  collections: {
    users: User;
    orders: Order;
    certificateTemplate: CertificateTemplate;
    issuingOfficer: IssuingOfficer;
    stampTemplate: StampTemplate;
    'payload-preferences': PayloadPreference;
    'payload-migrations': PayloadMigration;
  };
  globals: {};
}
export interface User {
  id: string;
  orders?: (string | Order)[] | null;
  role?: ('admin' | 'user' | 'superadmin') | null;
  updatedAt: string;
  createdAt: string;
  email: string;
  resetPasswordToken?: string | null;
  resetPasswordExpiration?: string | null;
  salt?: string | null;
  hash?: string | null;
  _verified?: boolean | null;
  _verificationToken?: string | null;
  loginAttempts?: number | null;
  lockUntil?: string | null;
  password: string | null;
}
export interface Order {
  id: string;
  user?: (string | User)[] | null;
  surname: string;
  firstName: string;
  otherName?: string | null;
  localGovernment: string;
  homeTown: string;
  compoundOrVillage: string;
  price: string;
  approvedForSale?: ('pending' | 'approved' | 'denied') | null;
  _flutterwaveID: string;
  issuingOfficer?: (string | IssuingOfficer)[] | null;
  stampTemplate?: (string | StampTemplate)[] | null;
  _isPaid: boolean;
  updatedAt: string;
  createdAt: string;
  url?: string | null;
  filename?: string | null;
  mimeType?: string | null;
  filesize?: number | null;
  width?: number | null;
  height?: number | null;
}
export interface IssuingOfficer {
  id: string;
  issuingOfficer: string;
  updatedAt: string;
  createdAt: string;
}
export interface StampTemplate {
  id: string;
  updatedAt: string;
  createdAt: string;
  url?: string | null;
  filename?: string | null;
  mimeType?: string | null;
  filesize?: number | null;
  width?: number | null;
  height?: number | null;
}
export interface CertificateTemplate {
  id: string;
  updatedAt: string;
  createdAt: string;
  url?: string | null;
  filename?: string | null;
  mimeType?: string | null;
  filesize?: number | null;
  width?: number | null;
  height?: number | null;
}
export interface PayloadPreference {
  id: string;
  user: {
    relationTo: 'users';
    value: string | User;
  };
  key?: string | null;
  value?:
    | {
        [k: string]: unknown;
      }
    | unknown[]
    | string
    | number
    | boolean
    | null;
  updatedAt: string;
  createdAt: string;
}
export interface PayloadMigration {
  id: string;
  name?: string | null;
  batch?: number | null;
  updatedAt: string;
  createdAt: string;
}


//declare module 'payload' {
  //export interface GeneratedTypes extends Config {}
//}