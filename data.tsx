import { subDays, subHours } from "date-fns";
import { AnamneseQuestions } from "types/patient";

const now = new Date();

export const professionalTabs = [
  "Anamnese",
  "Problemas",
  "Exames",
  "Agendamentos",
];
export const adminTabs = [
  "Informações",
  "Anamnese",
  "Financeiro",
  "Tratamentos",
  "Exames",
  "Agendamentos",
  "Problemas",
  "Anexos",
];

export const defaultLectures = { "11:00": [], "17:00": [] };
export const headerData = [
  { path: "/", title: "Inicio" },
  { path: "/#about", title: "Sobre" },
  { path: "/help", title: "Ajudar" },
  { path: "/contact", title: "Contatos" },
  { path: "/auth/login", title: "Entrar" },
];

export const dentalArch = {
  lt: ["18", "17", "16", "15", "14", "13", "12", "11"],
  rt: ["21", "22", "23", "24", "25", "26", "27", "28"],
  rb: ["31", "32", "33", "34", "35", "36", "37", "38"],
  lb: ["48", "47", "46", "45", "44", "43", "42", "41"],
};

export const specialties = [
  { label: "Implante", option: "implant" },
  { label: "Ortodontia", option: "ortho" },
  { label: "Próteses", option: "prosthesis" },
  { label: "Clínico Geral", option: "general" },
];

export const parcelado = [
  "",
  "1x",
  "2x",
  "3x",
  "4x",
  "5x",
  "6x",
  "7x",
  "8x",
  "9x",
  "10x",
  "11x",
  "12x",
];

export const patientsData = [
  {
    id: "5e887ac47eed253091be10cb",
    address: {
      city: "Cleveland",
      country: "USA",
      state: "Ohio",
      street: "2849 Fulton Street",
    },
    avatar: "/assets/avatars/avatar-carson-darrin.png",
    createdAt: subDays(subHours(now, 7), 1).getTime(),
    email: "carson.darrin@devias.io",
    name: "Carson Darrin",
    phone: "304-428-3097",
    cpf: "12345678912",
    status: "patient",
  },
  {
    id: "5e887b209c28ac3dd97f6db5",
    address: {
      city: "Atlanta",
      country: "USA",
      state: "Georgia",
      street: "1865  Pleasant Hill Road",
    },
    avatar: "/assets/avatars/avatar-fran-perez.png",
    createdAt: subDays(subHours(now, 1), 2).getTime(),
    email: "fran.perez@devias.io",
    name: "Fran Perez",
    phone: "712-351-5711",
    cpf: "12345678912",
    status: "patient",
  },
  {
    id: "5e887b7602bdbc4dbb234b27",
    address: {
      city: "North Canton",
      country: "USA",
      state: "Ohio",
      street: "4894  Lakeland Park Drive",
    },
    avatar: "/assets/avatars/avatar-jie-yan-song.png",
    createdAt: subDays(subHours(now, 4), 2).getTime(),
    email: "jie.yan.song@devias.io",
    name: "Jie Yan Song",
    phone: "770-635-2682",
    cpf: "12345678912",
    status: "patient",
  },
  {
    id: "5e86809283e28b96d2d38537",
    address: {
      city: "Madrid",
      country: "Spain",
      name: "Anika Visser",
      street: "4158  Hedge Street",
    },
    avatar: "/assets/avatars/avatar-anika-visser.png",
    createdAt: subDays(subHours(now, 11), 2).getTime(),
    email: "anika.visser@devias.io",
    name: "Anika Visser",
    phone: "908-691-3242",
    cpf: "12345678912",
    status: "patient",
  },
  {
    id: "5e86805e2bafd54f66cc95c3",
    address: {
      city: "San Diego",
      country: "USA",
      state: "California",
      street: "75247",
    },
    avatar: "/assets/avatars/avatar-miron-vitold.png",
    createdAt: subDays(subHours(now, 7), 3).getTime(),
    email: "miron.vitold@devias.io",
    name: "Miron Vitold",
    phone: "972-333-4106",
    cpf: "12345678912",
    status: "patient",
  },
  {
    id: "5e887a1fbefd7938eea9c981",
    address: {
      city: "Berkeley",
      country: "USA",
      state: "California",
      street: "317 Angus Road",
    },
    avatar: "/assets/avatars/avatar-penjani-inyene.png",
    createdAt: subDays(subHours(now, 5), 4).getTime(),
    email: "penjani.inyene@devias.io",
    name: "Penjani Inyene",
    phone: "858-602-3409",
    cpf: "12345678912",
    status: "patient",
  },
  {
    id: "5e887d0b3d090c1b8f162003",
    address: {
      city: "Carson City",
      country: "USA",
      state: "Nevada",
      street: "2188  Armbrester Drive",
    },
    avatar: "/assets/avatars/avatar-omar-darboe.png",
    createdAt: subDays(subHours(now, 15), 4).getTime(),
    email: "omar.darobe@devias.io",
    name: "Omar Darobe",
    phone: "415-907-2647",
    cpf: "12345678912",
    status: "patient",
  },
  {
    id: "5e88792be2d4cfb4bf0971d9",
    address: {
      city: "Los Angeles",
      country: "USA",
      state: "California",
      street: "1798  Hickory Ridge Drive",
    },
    avatar: "/assets/avatars/avatar-siegbert-gottfried.png",
    createdAt: subDays(subHours(now, 2), 5).getTime(),
    email: "siegbert.gottfried@devias.io",
    name: "Siegbert Gottfried",
    phone: "702-661-1654",
    cpf: "12345678912",
    status: "patient",
  },
  {
    id: "5e8877da9a65442b11551975",
    address: {
      city: "Murray",
      country: "USA",
      state: "Utah",
      street: "3934  Wildrose Lane",
    },
    avatar: "/assets/avatars/avatar-iulia-albu.png",
    createdAt: subDays(subHours(now, 8), 6).getTime(),
    email: "iulia.albu@devias.io",
    name: "Iulia Albu",
    phone: "313-812-8947",
    cpf: "12345678912",
    status: "patient",
  },
  {
    id: "5e8680e60cba5019c5ca6fda",
    address: {
      city: "Salt Lake City",
      country: "USA",
      state: "Utah",
      street: "368 Lamberts Branch Road",
    },
    avatar: "/assets/avatars/avatar-nasimiyu-danai.png",
    createdAt: subDays(subHours(now, 1), 9).getTime(),
    email: "nasimiyu.danai@devias.io",
    name: "Nasimiyu Danai",
    phone: "801-301-7894",
    cpf: "12345678912",
    status: "patient",
  },
];

export const anamneseQuestions: AnamneseQuestions = {
  "Está tomando alguma medicação no momento?": "",
  "Sofre ou sofreu de algum problema no coração?": "",
  "É diabético?": "",
  "Possui dificuldade de cicatrização?": "",
  "Tem ou teve alguma doença nos rins ou fígado?": "",
  "Sofre de epilepsia?": "",
  "Já esteve hospitalizado por algum motivo?": "",
  "Tem anemia?": "",
  "É alérgico a algum medicamento?": "",
  "Já teve algum problema com anestésicos?": "",
  "Tem ansiedade?": "",
  "Faz uso de AAS?": "",
};

export const anamsVal = [
  "Está tomando alguma medicação no momento?",
  "Sofre ou sofreu de algum problema no coração?",
  "É diabético?",
  "Possui dificuldade de cicatrização?",
  "Tem ou teve alguma doença nos rins ou fígado?",
  "Sofre de epilepsia?",
  "Já esteve hospitalizado por algum motivo?",
  "Tem anemia?",
  "É alérgico a algum medicamento?",
  "Já teve algum problema com anestésicos?",
  "Tem ansiedade?",
  "Faz uso de AAS?",
];

export const defaultClientData = {
  name: "",
  email: "",
  dateBorn: "",
  phone: "",
  cpf: "",
  rg: "",
  role: "",
  address: "",
};
export const defaultAddress = {
  address: "",
  cep: "",
  city: "",
  complement: "",
  line1: "",
  neighbor: "",
  number: "",
  uf: "",
};
