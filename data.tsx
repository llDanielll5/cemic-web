import { AiFillHome, AiFillDollarCircle } from "react-icons/ai";
import { BsPeopleFill } from "react-icons/bs";
import { TbHeartHandshake } from "react-icons/tb";
import { FaTooth } from "react-icons/fa";
import stylesDash from "./src/styles/Dashboard.module.css";

export const headerData = [
  { path: "/", title: "Home" },
  { path: "#about", title: "Sobre" },
  { path: "#help", title: "Ajude-nos" },
  { path: "#contact", title: "Contato" },
  // { path: "", title: "Login" },
];

export const dashboardNav = [
  { path: "", title: "CEMIC" },
  {
    path: "",
    title: "Geral",
    icon: <AiFillHome className={stylesDash["react-icon"]} />,
  },
  {
    path: "",
    title: "Pacientes",
    icon: <BsPeopleFill className={stylesDash["react-icon"]} />,
  },
  {
    path: "",
    title: "Fechamentos",
    icon: <AiFillDollarCircle className={stylesDash["react-icon"]} />,
  },
  {
    path: "",
    title: "Doações",
    icon: <TbHeartHandshake className={stylesDash["react-icon"]} />,
  },
  {
    path: "",
    title: "Dentistas",
    icon: <FaTooth className={stylesDash["react-icon"]} />,
  },
];
