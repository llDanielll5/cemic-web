/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { styled } from "@mui/material/styles";
import { SideNav } from "./side-nav";
import { TopNav } from "./top-nav";
import { useRecoilState } from "recoil";
import UserData from "@/atoms/userData";
import { getCookie, setCookie } from "cookies-next";
import { useRouter } from "next/router";
import { handlePersistLogin } from "@/axios/auth";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { Box, Button, Fab, Modal, Typography } from "@mui/material";

const fixes = [
  "Foram realizadas correções em alguns problemas como, a questão de que não era possível atualizar o paciente com F5 ou CTRL+R pois isso bugava e ficava tudo em branco",
  "Também agora foi adicionado a possibilidade de o funcionário abrir o caixa diário (O funcionário com essa função)",
  "Pacientes podem ser adicionados sem CEP. Mas é obrigatório os dados básicos ainda.",
  "Estou trabalhando para implementar para Segunda-Feira dia 29/04/24 a questão de impressão dos contratos já prontos com nome dos pacientes.",
  "Também junto estará para a mesma data a questão dos dentistas adicionarem os tratamentos, até lá os tratamentos serão lançados por nós.",
];

const SIDE_NAV_WIDTH = 280;

const LayoutRoot = styled("div")(({ theme }) => ({
  display: "flex",
  flex: "1 1 auto",
  maxWidth: "100%",
  [theme.breakpoints.up("lg")]: {
    paddingLeft: SIDE_NAV_WIDTH,
  },
}));

const LayoutContainer = styled("div")({
  display: "flex",
  flex: "1 1 auto",
  flexDirection: "column",
  width: "100%",
});

export const DashboardLayout = (props: any) => {
  const { children } = props;
  const pathname = usePathname();
  const [openNav, setOpenNav] = useState(false);
  const [userData, setUserData] = useRecoilState(UserData);
  const infosCookie = getCookie("infos1");
  const [informations, setInformations] = useState(false);
  const router = useRouter();

  const handleAddPatient = () => {
    if (router.pathname !== "/admin/patients")
      return router.push("/admin/patients");
  };

  const handlePathnameChange = useCallback(() => {
    if (openNav) setOpenNav(false);
  }, [openNav]);

  const handleLogout = async () => {
    setCookie("jwt", undefined);
    setCookie("user", undefined);
    return await router.push("/auth/login");
  };

  const PersistLogin = async () => {
    let persistance = await handlePersistLogin();
    if (persistance === null) return await handleLogout();
    return setUserData(persistance);
  };

  useEffect(() => {
    setCookie("oldDate", undefined);
    setCookie("cashierType", null);
  }, []);

  useEffect(() => {
    handlePathnameChange();
  }, [pathname]);

  useEffect(() => {
    PersistLogin();
  }, []);

  useEffect(() => {
    if (infosCookie === undefined) {
      setCookie("infos1", true);
      setInformations(true);
    }
  }, [infosCookie]);

  return (
    <>
      <Modal
        open={informations}
        onClose={() => {
          setCookie("infos1", false);
          setInformations(false);
        }}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100vw",
        }}
      >
        <Box width={"90%"} bgcolor={"white"} mx="auto" p={3}>
          <Typography variant="h5" color="green" textAlign={"center"} mb={2}>
            Atualizações de Sistema!
          </Typography>

          {fixes.map((v, i) => (
            <Typography variant="h6" textAlign={"left"} key={i} p={1}>
              {v}
            </Typography>
          ))}

          <Button
            sx={{ mt: 2 }}
            variant="contained"
            fullWidth
            onClick={() => {
              setCookie("infos1", false);
              setInformations(false);
            }}
          >
            Li e entendi!
          </Button>
        </Box>
      </Modal>
      <TopNav onNavOpen={() => setOpenNav(true)} logout={handleLogout} />
      <SideNav onClose={() => setOpenNav(false)} open={openNav} />
      <Fab
        color="primary"
        aria-label="add"
        title="Adicionar Paciente"
        onClick={handleAddPatient}
        sx={{ position: "fixed", bottom: "1rem", right: "1rem" }}
      >
        <PersonAddIcon />
      </Fab>
      <LayoutRoot>
        <LayoutContainer>{children}</LayoutContainer>
      </LayoutRoot>
    </>
  );
};
