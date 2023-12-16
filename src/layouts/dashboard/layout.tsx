import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { styled } from "@mui/material/styles";
import { SideNav } from "./side-nav";
import { TopNav } from "./top-nav";
import { useRecoilState } from "recoil";
import UserData from "@/atoms/userData";
import { handlePersistLogin } from "@/services/requests/auth";
import { auth } from "@/services/firebase";
import { setCookie } from "cookies-next";
import { useRouter } from "next/router";
import Loading from "@/components/loading";
import LoadingServer from "@/atoms/components/loading";

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
  const [loading, setLoading] = useRecoilState(LoadingServer);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const setNotUserCookie = setCookie("useruid", undefined);
  const router = useRouter();

  const handlePathnameChange = useCallback(() => {
    if (openNav) {
      setOpenNav(false);
    }
  }, [openNav]);
  const handleLogout = async () => {
    setLoading((prev) => ({
      isLoading: true,
      loadingMessage: '"Estamos deslogando sua conta!"',
    }));
    await auth.signOut().then(
      () => {
        setLoading((prev) => ({ isLoading: false, loadingMessage: "" }));
        setNotUserCookie;
        setUserData({});
        router.push("/auth/login");
      },
      (err: any) => {
        setLoading((prev) => ({ isLoading: false, loadingMessage: "" }));
        return alert("Erro ao sair");
      }
    );
  };

  const PersistLogin = async (user: any) => {
    return await handlePersistLogin(user).then((finalUser) => {
      if (finalUser === undefined) return handleLogout();
      setUserData(finalUser);
    });
  };

  useEffect(() => {
    setCookie("oldDate", undefined);
    setCookie("cashierType", null);
  }, []);

  useEffect(
    () => {
      handlePathnameChange();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pathname]
  );

  useEffect(() => {
    const Unsubscribe = auth.onAuthStateChanged(async (User) => {
      if (!User) return handleLogout();
      await PersistLogin(User);
    });

    return () => Unsubscribe();
  }, []);

  if (loading.isLoading === true)
    return <Loading message={loading.loadingMessage!} />;

  return (
    <>
      <TopNav onNavOpen={() => setOpenNav(true)} logout={handleLogout} />
      <SideNav onClose={() => setOpenNav(false)} open={openNav} />

      <LayoutRoot>
        <LayoutContainer>{children}</LayoutContainer>
      </LayoutRoot>
    </>
  );
};
