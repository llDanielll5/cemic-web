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
import { TiThMenuOutline } from "react-icons/ti";
import { handlePersistLogin } from "@/services/requests/auth";
import { useRecoilState, useResetRecoilState } from "recoil";
import { dashboardUser } from "data";
import DynamicUserBody from "@/components/dynamicUserBody";
import Loading from "@/components/loading";

const PatientScreen = () => {
  const router = useRouter();
  const size = useWindowSize();
  const userid = router.query.userid;
  const mainRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLDivElement>(null);
  const navigationRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const resetUser = useResetRecoilState(UserData);
  const [userData, setUserData] = useRecoilState(UserData);
  const linearBack = "linear-gradient(300deg,#003147,#09aae8)";
  let navigation = navigationRef?.current?.style;
  let main = mainRef?.current?.style;

  const renderPanelTitle = {
    1: "Perfil",
    2: "Meus Atendimentos",
    3: "Meus Pagamentos",
    4: "Meus Exames",
    5: "Meus Implantes",
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

  useEffect(() => {
    if (size?.width! > 760) setDesktopNav();
    else setMobileNav();
  }, [setDesktopNav, setMobileNav, size?.width]);

  useEffect(() => {
    const Unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user)
        handlePersistLogin(user).then((User) => {
          if (User!.role !== "client") signout();
          else setUserData(User!);
        });
      else signout();
    });
    return () => Unsubscribe();
  }, []);

  const signout = async () => {
    try {
      return signOut(auth).then(() => {
        resetUser();
        setCookie("useruid", undefined);
      });
    } finally {
      router.push("/login");
    }
  };

  const cemicLogo = (props: any) => (
    <li>
      <a href={props.href}>
        <img
          src="/images/logo.png"
          alt="logo"
          className={styles["cemic-logo"]}
        />
        <span className={styles.title}>
          {userData?.name ? `${userData?.name} ${userData?.surname}` : ""}
        </span>
      </a>
    </li>
  );
  const navigationRender = (props: any, index: number) => {
    const hasPage = index === page;
    const handleChangePage = () => {
      if (index !== dashboardUser.length - 1) setPage(index);
      else signout();
    };
    return (
      <li
        onClick={handleChangePage}
        style={hasPage ? { background: linearBack } : undefined}
      >
        <a style={hasPage ? { color: "white" } : undefined}>
          <span className={styles.icon}>{props.icon}</span>
          <span className={styles.title}>{props.title}</span>
        </a>
      </li>
    );
  };

  const renderTobBarMenu = (props: any) => {
    return (
      <div className={styles.topbar}>
        <div className={styles.toggle} onClick={props.onClick} ref={toggleRef}>
          {size?.width! > 760 && <TiThMenuOutline className={styles.icon} />}
        </div>
        <div className={styles.search}>
          <h2 className={styles.title}>{renderPanelTitle[page]}</h2>
        </div>
        <div className={styles.user}></div>
      </div>
    );
  };

  const renderDashboard = ({ item, index }: any) => {
    if (index === 0) return cemicLogo({ href: item.path, title: item.title });
    else
      return navigationRender(
        {
          href: item.path,
          title: item.title,
          icon: item?.icon,
        },
        index
      );
  };

  return (
    <div className={styles.container}>
      {isLoading && <Loading message="Atualizando informações de usuário!" />}
      <div className={styles.navigation} ref={navigationRef}>
        <ul>
          {dashboardUser.map((item, index) => renderDashboard({ item, index }))}
        </ul>
      </div>
      <div className={styles.main} ref={mainRef}>
        {renderTobBarMenu({ onClick: toggleMenu })}
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
