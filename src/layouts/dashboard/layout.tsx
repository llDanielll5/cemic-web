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
import { Fab } from "@mui/material";

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
  const router = useRouter();

  const handleAddPatient = () => {
    if (router.pathname !== "/admin/patients")
      return router.push("/admin/patients");
  };

  const handlePathnameChange = useCallback(() => {
    if (openNav) setOpenNav(false);
  }, [openNav]);

  const handleLogout = async () => {
    // setLoading((prev) => ({
    //   isLoading: true,
    //   loadingMessage: "Estamos deslogando sua conta!",
    // }));

    setCookie("jwt", undefined);
    setCookie("user", undefined);

    return await router.push("/auth/login");
    // then((res) => {
    //   if (res) setLoading((prev) => ({ isLoading: false, loadingMessage: "" }));
    // });
  };

  const PersistLogin = async () => {
    let persistance = handlePersistLogin();
    if (persistance === null) return await handleLogout();
    return setUserData(persistance);
  };

  // const handleGetCemicIp = useCallback(async () => {
  //   await getIP().then((ip) => {
  //     if (ip !== process.env.CEMIC_PUBLIC_IP) router.push("/");
  //   });
  // }, []);

  // useEffect(() => {
  //   handleGetCemicIp();
  // }, [handleGetCemicIp]);

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

  // if (loading.isLoading === true)
  //   return <Loading message={loading.loadingMessage!} />;

  return (
    <>
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
