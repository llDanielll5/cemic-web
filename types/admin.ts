import { AdminType } from "types";

export interface AdminInfosInterface {
  created: any;
  updated?: any;
  createTimestamp?: Date;
  updateTimestamp?: Date;
  history?: AdminHistoryOfDay;
}

interface AdminDateHistory {
  date: string;
  admin: Pick<AdminType, "name" | "id" | "role">;
  updates: PatientTreatmentInterface[];
}

export type AdminHistoryOfDay = Record<string, AdminDateHistory>;

interface Permissions {
  read: boolean;
  create: boolean;
  update: boolean;
  all: boolean;
}

interface AllowPermissions {
  allowed: boolean;
  permissions: Permissions;
}

type ModulesForPermissions =
  | "patients"
  | "dentists"
  | "partners"
  | "screenings"
  | "treatments"
  | "lectures"
  | "cashier"
  | "warehouse"
  | "whatsapp";

export type UserPermissionsJsonInterface = Record<
  ModulesForPermissions,
  AllowPermissions
>;
