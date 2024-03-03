export interface DentistInterface {
  blocked: boolean;
  confirmationToken: string | null;
  confirmed: boolean;
  cpf: string;
  createdAt: string;
  cro: null;
  dateBorn: null;
  email: string;
  finishedTreatments: [];
  forwardedTreatments: [];
  firstLetter: string;
  id: string;
  name: string;
  password: string;
  patient: null;
  percent: null;
  phone: string;
  profileImage: string | null;
  provider: string;
  resetPasswordToken: string | null;
  rg: string;
  screening: null;
  specialty: null;
  updatedAt: string;
  userType: string;
  username: string;
}
