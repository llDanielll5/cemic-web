import ChartBarIcon from "@heroicons/react/24/solid/ChartBarIcon";
import CogIcon from "@heroicons/react/24/solid/CogIcon";
import ShoppingBagIcon from "@heroicons/react/24/solid/ShoppingBagIcon";
import UserIcon from "@heroicons/react/24/solid/UserIcon";
import UsersIcon from "@heroicons/react/24/solid/UsersIcon";
import RecordVoiceOverIcon from "@mui/icons-material/RecordVoiceOver";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import HealingIcon from "@mui/icons-material/Healing";
import { SvgIcon } from "@mui/material";

export const items = [
  {
    title: "Inicio",
    path: "/admin",
    icon: (
      <SvgIcon fontSize="small">
        <ChartBarIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Pacientes",
    path: "/admin/patients",
    icon: (
      <SvgIcon fontSize="small">
        <UsersIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Parceiros",
    path: "/admin/partners",
    icon: (
      <SvgIcon fontSize="small">
        <ShoppingBagIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Tratamentos",
    path: "/admin/treatments",
    icon: (
      <SvgIcon fontSize="small">
        <HealingIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Palestras",
    path: "/admin/lectures",
    icon: (
      <SvgIcon fontSize="small">
        <RecordVoiceOverIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Caixa",
    path: "/admin/cash",
    icon: (
      <SvgIcon fontSize="small">
        <PointOfSaleIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Conta",
    path: "/admin/account",
    icon: (
      <SvgIcon fontSize="small">
        <UserIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Opções",
    path: "/admin/settings",
    icon: (
      <SvgIcon fontSize="small">
        <CogIcon />
      </SvgIcon>
    ),
  },
];
