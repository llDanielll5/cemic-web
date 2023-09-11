import { FaTooth } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { RxDashboard } from "react-icons/rx";
import { AiFillDollarCircle } from "react-icons/ai";
import { MdToday, MdRecordVoiceOver } from "react-icons/md";
import { GiExitDoor, GiAncientScrew } from "react-icons/gi";
import { HiClipboardDocumentList } from "react-icons/hi2";
import { BiMoney } from "react-icons/bi";
import { TfiWrite } from "react-icons/tfi";
import stylesDash from "./src/styles/Dashboard.module.css";
import HealingIcon from "@mui/icons-material/Healing";

import {
  BsPersonLinesFill,
  BsFillImageFill,
  BsPeopleFill,
} from "react-icons/bs";

export const headerData = [
  { path: "/", title: "Home" },
  { path: "#about", title: "Sobre" },
  { path: "#help", title: "Ajude-nos" },
  { path: "/login", title: "Entrar" },
];

export const dashboardNav = [
  { path: "", title: "CEMIC" },
  {
    path: "",
    title: "Início",
    icon: <RxDashboard className={stylesDash["react-icon"]} />,
  },
  {
    path: "",
    title: "Clientes",
    icon: <BsPeopleFill className={stylesDash["react-icon"]} />,
  },
  {
    path: "",
    title: "Recibos",
    icon: <HiClipboardDocumentList className={stylesDash["react-icon"]} />,
  },
  {
    path: "",
    title: "Dentistas",
    icon: <FaTooth className={stylesDash["react-icon"]} />,
  },
  {
    path: "",
    title: "Triagens",
    icon: <BsPersonLinesFill className={stylesDash["react-icon"]} />,
  },
  {
    path: "",
    title: "Palestras",
    icon: <MdRecordVoiceOver className={stylesDash["react-icon"]} />,
  },
  {
    path: "",
    title: "Tratamentos",
    icon: <HealingIcon className={stylesDash["react-icon"]} />,
  },
  {
    path: "",
    title: "Pagamentos",
    icon: <BiMoney className={stylesDash["react-icon"]} />,
  },
  {
    path: "",
    title: "Blog",
    icon: <TfiWrite className={stylesDash["react-icon"]} />,
  },
  {
    path: "",
    title: "Conta",
    icon: <CgProfile className={stylesDash["react-icon"]} />,
  },

  {
    path: "",
    title: "Sair",
    icon: <GiExitDoor className={stylesDash["react-icon"]} />,
  },
  // {
  //   path: "",
  //   title: "Fechamentos",
  //   icon: <AiFillDollarCircle className={stylesDash["react-icon"]} />,
  // },
  // {
  //   path: "",
  //   title: "Doações",
  //   icon: <TbHeartHandshake className={stylesDash["react-icon"]} />,
  // },
];

export const dashboardUser = [
  { path: "", title: "CEMIC" },
  {
    path: "",
    title: "Perfil",
    icon: <CgProfile className={stylesDash["react-icon"]} />,
  },
  {
    path: "",
    title: "Atendimentos",
    icon: <MdToday className={stylesDash["react-icon"]} />,
  },
  {
    path: "",
    title: "Pagamentos",
    icon: <AiFillDollarCircle className={stylesDash["react-icon"]} />,
  },
  {
    path: "",
    title: "Exames",
    icon: <BsFillImageFill className={stylesDash["react-icon"]} />,
  },
  {
    path: "",
    title: "Triagem",
    icon: <GiAncientScrew className={stylesDash["react-icon"]} />,
  },
  {
    path: "",
    title: "Sair",
    icon: <GiExitDoor className={stylesDash["react-icon"]} />,
  },

  // {
  //   path: "",
  //   title: "Doações",
  //   icon: <TbHeartHandshake className={stylesDash["react-icon"]} />,
  // },
];

export const dashProfessional = [
  { path: "", title: "CEMIC" },
  {
    path: "",
    title: "Perfil",
    icon: <CgProfile className={stylesDash["react-icon"]} />,
  },
  {
    path: "",
    title: "Atendimentos",
    icon: <MdToday className={stylesDash["react-icon"]} />,
  },
  {
    path: "",
    title: "Triagens",
    icon: <BsPersonLinesFill className={stylesDash["react-icon"]} />,
  },
  {
    path: "",
    title: "Pagamentos",
    icon: <AiFillDollarCircle className={stylesDash["react-icon"]} />,
  },
  {
    path: "",
    title: "Sair",
    icon: <GiExitDoor className={stylesDash["react-icon"]} />,
  },
];

export const hoursToSelect = [
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
  "20:30",
  "21:30",
  "22:00",
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
