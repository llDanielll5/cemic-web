type LOCATION_FILIAL = "" | "DF" | "MG";
type UserRole = "ADMIN" | "EMPLOYEE" | "DENTIST" | "PROSTHETIC" | "SUPERADMIN";

interface AdminType {
  uid: string;
  id: string;
  name: string;
  email: string;
  cpf: string;
  rg: string;
  phone: string;
  profileImage: string;
  firstLetter: string;
  role: UserRole;
  location: LOCATION_FILIAL;
  filial?: string;
  dateBorn: string;
  userType: UserRole;
  permissions: UserPermissionsJsonInterface;
  dentist?: DentistInterface;
}

interface AdminInfosInterface {
  created: any;
  updated?: any;
  createTimestamp?: Date;
  updateTimestamp?: Date;
  history?: AdminHistoryOfDay;
}
