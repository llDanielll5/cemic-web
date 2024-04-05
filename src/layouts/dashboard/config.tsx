import ChartBarIcon from "@heroicons/react/24/solid/ChartBarIcon";
import CogIcon from "@heroicons/react/24/solid/CogIcon";
import ShoppingBagIcon from "@heroicons/react/24/solid/ShoppingBagIcon";
import UserIcon from "@heroicons/react/24/solid/UserIcon";
import UsersIcon from "@heroicons/react/24/solid/UsersIcon";
import RecordVoiceOverIcon from "@mui/icons-material/RecordVoiceOver";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import RecentActorsIcon from "@mui/icons-material/RecentActors";
import ContactsIcon from "@mui/icons-material/Contacts";
import HealingIcon from "@mui/icons-material/Healing";
import { SvgIcon } from "@mui/material";

export const SideNavLinks = (data: { userType: any; permissions: any }) => {
  const itens: any[] = [];

  if (data?.userType === "ADMIN" || data?.userType === "SUPERADMIN") {
    itens.push({
      title: "Inicio",
      path: "/admin",
      icon: (
        <SvgIcon fontSize="small">
          <ChartBarIcon />
        </SvgIcon>
      ),
    });
  }
  if (data?.permissions?.patients?.allowed) {
    itens.push({
      title: "Pacientes",
      path: "/admin/patients",
      icon: (
        <SvgIcon fontSize="small">
          <UsersIcon />
        </SvgIcon>
      ),
    });
  }
  if (data?.permissions?.dentists?.allowed) {
    itens.push({
      title: "Dentistas",
      path: "/admin/dentists",
      icon: (
        <SvgIcon fontSize="small">
          <RecentActorsIcon />
        </SvgIcon>
      ),
    });
  }
  if (data?.permissions?.partners?.allowed) {
    itens.push({
      title: "Parceiros",
      path: "/admin/partners",
      icon: (
        <SvgIcon fontSize="small">
          <ShoppingBagIcon />
        </SvgIcon>
      ),
    });
  }
  if (data?.permissions?.screenings?.allowed) {
    itens.push({
      title: "Triagens",
      path: "/admin/screenings",
      icon: (
        <SvgIcon fontSize="small">
          <ContactsIcon />
        </SvgIcon>
      ),
    });
  }
  if (data?.permissions?.treatments?.allowed) {
    itens.push({
      title: "Tratamentos",
      path: "/admin/treatments",
      icon: (
        <SvgIcon fontSize="small">
          <HealingIcon />
        </SvgIcon>
      ),
    });
  }
  if (data?.permissions?.lectures?.allowed) {
    itens.push({
      title: "Palestras",
      path: "/admin/lectures",
      icon: (
        <SvgIcon fontSize="small">
          <RecordVoiceOverIcon />
        </SvgIcon>
      ),
    });
  }
  if (data?.permissions?.cashier?.allowed) {
    itens.push({
      title: "Caixa",
      path: "/admin/cashier",
      icon: (
        <SvgIcon fontSize="small">
          <PointOfSaleIcon />
        </SvgIcon>
      ),
    });
  }
  if (data?.permissions?.warehouse?.allowed) {
    //push
  }

  itens.push(
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
    }
  );

  return itens;
};
