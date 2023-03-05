import { AiFillDollarCircle } from "react-icons/ai";
import { RxDashboard } from "react-icons/rx";
import { BsPeopleFill } from "react-icons/bs";
import { TbHeartHandshake } from "react-icons/tb";
import { CgProfile } from "react-icons/cg";
import { GiExitDoor } from "react-icons/gi";
import { FaTooth } from "react-icons/fa";
import stylesDash from "./src/styles/Dashboard.module.css";

export const headerData = [
  { path: "/", title: "Home" },
  { path: "#about", title: "Sobre" },
  { path: "#help", title: "Ajude-nos" },
  { path: "#contact", title: "Contato" },
  { path: "/login", title: "Entrar" },
];

export const dashboardNav = [
  { path: "", title: "CEMIC" },
  {
    path: "",
    title: "Dashboard",
    icon: <RxDashboard className={stylesDash["react-icon"]} />,
  },
  {
    path: "",
    title: "Pacientes",
    icon: <BsPeopleFill className={stylesDash["react-icon"]} />,
  },
  {
    path: "",
    title: "Dentistas",
    icon: <FaTooth className={stylesDash["react-icon"]} />,
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
