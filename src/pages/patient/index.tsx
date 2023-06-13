//@ts-nocheck
/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect, useCallback, useRef } from "react";
import styles from "../../styles/Dashboard.module.css";
import useWindowSize from "@/hooks/useWindowSize";
import UserData from "@/atoms/userData";
import { auth } from "@/services/firebase";
import { setCookie } from "cookies-next";
import { signOut } from "firebase/auth";
import { useRouter } from "next/router";
import { dashboardUser } from "data";
import { useRecoilState, useResetRecoilState } from "recoil";
import { handlePersistLogin } from "@/services/requests/auth";
import DynamicUserBody from "@/components/dynamicUserBody";
import RenderDashboard from "@/components/admin/renderDashboard";
import TopBarMenu from "@/components/admin/topBarMenu";
import Loading from "@/components/loading";

const PatientScreen = () => {
  const router = useRouter();
  const size = useWindowSize();
  const mainRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLDivElement>(null);
  const navigationRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const resetUser = useResetRecoilState(UserData);
  const [userData, setUserData] = useRecoilState(UserData);
  let navigation = navigationRef?.current?.style;
  let main = mainRef?.current?.style;

  const renderPanelTitle = {
    1: "Perfil",
    2: "Meus Atendimentos",
    3: "Meus Pagamentos",
    4: "Meus Exames",
    5: "Minha Triagem",
  };

  const setMobileNav = useCallback(() => {
    navigation?.setProperty("width", "60px");
    main?.setProperty("width", "calc(100% - 60px)");
    main?.setProperty("left", "60px");
  }, [main, navigation]);
  const setDesktopNav = useCallback(() => {
    navigation?.setProperty("width", "300px");
    main?.setProperty("width", "calc(100% - 300px)");
    main?.setProperty("left", "300px");
  }, [main, navigation]);

  const toggleMenu = () => {
    if (size?.width! > 760) {
      if (navigation?.width === "60px") setDesktopNav();
      else setMobileNav();
    } else alert("Não é possível no celular");
  };

  const signout = async () => {
    return signOut(auth).then(async () => {
      const final = await router.push("/login");
      if (final) {
        resetUser();
        setCookie("useruid", undefined);
      }
    });
  };

  useEffect(() => {
    if (size?.width! > 760) setDesktopNav();
    else setMobileNav();
  }, [setDesktopNav, setMobileNav, size?.width]);

  useEffect(() => {
    const Unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user)
        handlePersistLogin(user).then((User) => {
          if (User!.role !== "patient") signout();
          else setUserData(User!);
        });
      else signout();
    });
    return () => Unsubscribe();
  }, []);

  return (
    <div className={styles.container}>
      {isLoading && <Loading message="Atualizando informações de usuário!" />}
      <div className={styles.navigation} ref={navigationRef}>
        <ul>
          {dashboardUser.map((item, index) => (
            <RenderDashboard
              key={index}
              item={item}
              index={index}
              page={page}
              setPage={setPage}
              signout={signout}
              userData={userData}
              dataNav={dashboardUser}
            />
          ))}
        </ul>
      </div>
      <div className={styles.main} ref={mainRef}>
        <TopBarMenu
          onClick={toggleMenu}
          page={page}
          toggleRef={toggleRef}
          panelTitle={renderPanelTitle}
        />
        <DynamicUserBody
          page={page}
          userData={userData}
          setIsLoading={setIsLoading}
        />
      </div>
    </div>
  );
};

export default PatientScreen;
