// useDynamicTitle.ts
import { useRouter } from "next/router";
import { useMemo } from "react";

export const useDynamicTitle = () => {
  const { pathname } = useRouter();

  const title = useMemo(() => {
    switch (pathname) {
      case "/":
        return "CEMIC · Centro Médico de Implantes Comunitários | Faça Implantes em Brasilia | Faça Implantes em Minas Gerais | Implantes Dentários | Arrume seus Dentes.";
      case "/admin":
        return "CEMIC · Painel Administrativo";
      case "/admin/patients":
        return "CEMIC · Pacientes";
      case "/admin/dentists":
        return "CEMIC · Dentistas";
      case "/admin/treatments":
        return "CEMIC · Tratamentos Gerais";
      case "/admin/lectures":
        return "CEMIC · Palestras";
      case "/admin/cashier":
        return "CEMIC · Fluxo de Caixa";
      default:
        return "CEMIC - Centro Médico de Implantes Comunitários";
    }
  }, [pathname]);

  return title;
};
