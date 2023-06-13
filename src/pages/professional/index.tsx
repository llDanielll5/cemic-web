// @ts-nocheck
/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect, useCallback, useRef } from "react";
import styles from "../../styles/Dashboard.module.css";
import useWindowSize from "@/hooks/useWindowSize";
import UserData from "@/atoms/userData";
import { auth } from "@/services/firebase";
import { setCookie } from "cookies-next";
import { signOut } from "firebase/auth";
import { useRouter } from "next/router";
import { handlePersistLogin } from "@/services/requests/auth";
import { useRecoilState, useResetRecoilState } from "recoil";
import { dashProfessional } from "data";
import Loading from "@/components/loading";
import DynamicProfBody from "@/components/dynamicProfBody";
import RenderDashboard from "@/components/admin/renderDashboard";
import TopBarMenu from "@/components/admin/topBarMenu";

const renderPanelTitle = {
  1: "Perfil",
  2: "Meus Atendimentos",
  3: "Triagens",
  4: "Meus Pagamentos",
  5: "Sair",
};

const ProfessionalScreen = () => {
  const router = useRouter();
  const size = useWindowSize();
  const mainRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLDivElement>(null);
  const navigationRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [date, setDate] = useState<string>("");
  const resetUser = useResetRecoilState(UserData);
  const [userData, setUserData] = useRecoilState(UserData);
  const [isCreateTreatment, setIsCreateTreatment] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);
  const [isLogout, setIsLogout] = useState(false);
  let navigation = navigationRef?.current?.style;
  let main = mainRef?.current?.style;

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

  useEffect(() => {
    if (size?.width! > 760) setDesktopNav();
    else setMobileNav();
  }, [setDesktopNav, setMobileNav, size?.width]);

  // const user = auth.currentUser;
  useEffect(() => {
    const Unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user)
        await handlePersistLogin(user).then((User) => {
          if (User!.role !== "professional") signout();
          else setUserData(User!);
        });
      else signout();
    });
    return () => Unsubscribe();
  }, []);

  const signout = async () => {
    setIsLogout(true);
    return await signOut(auth)
      .then(async () => {
        const getout = await router.push("/login");
        if (getout) {
          resetUser();
          setCookie("useruid", undefined);
          setIsLogout(false);
        }
      })
      .catch(() => setIsLogout(false));
  };

  return (
    <div className={styles.container}>
      <div className={styles.navigation} ref={navigationRef}>
        <ul>
          {dashProfessional.map((item, index) => (
            <RenderDashboard
              key={index}
              item={item}
              index={index}
              page={page}
              setPage={setPage}
              signout={signout}
              userData={userData}
              dataNav={dashProfessional}
            />
          ))}
        </ul>
      </div>

      {/* LOADINGS MODAL FOR COMPONENTS */}
      {isLoading && <Loading message="Atualizando informações de usuário!" />}
      {isScheduling && <Loading message="Estamos realizando o agendamento." />}
      {isCreateTreatment && <Loading message="Adicionando tratamento..." />}
      {isLogout && <Loading message="Estamos deslogando para você..." />}
      {/*  */}

      <div className={styles.main} ref={mainRef}>
        <TopBarMenu
          onClick={toggleMenu}
          page={page}
          toggleRef={toggleRef}
          panelTitle={renderPanelTitle}
        />
        <DynamicProfBody
          page={page}
          setIsCreateTreatment={setIsCreateTreatment}
          setDate={setDate}
          userData={userData}
        />
      </div>
    </div>
  );
};

export default ProfessionalScreen;
