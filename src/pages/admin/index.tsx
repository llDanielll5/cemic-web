//@ts-nocheck
/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useEffect, useCallback } from "react";
import styles from "../../styles/Dashboard.module.css";
import useWindowSize from "@/hooks/useWindowSize";
import { useRecoilState } from "recoil";
import { dashboardNav } from "data";
import { useRouter } from "next/router";
import { TiThMenuOutline } from "react-icons/ti";
import UserData from "@/atoms/userData";
import { handlePersistLogin } from "@/services/requests/auth";
import { auth } from "@/services/firebase";
import { signOut } from "firebase/auth";
import { setCookie } from "cookies-next";

const Dashboard = () => {
  const router = useRouter();
  const size = useWindowSize();
  const [userData, setUserData] = useRecoilState(UserData);
  const toggleRef = useRef<HTMLDivElement>(null);
  const navigationRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(1);
  const linearBack = "linear-gradient(300deg,#003147,#09aae8)";
  let navigation = navigationRef?.current?.style;
  let main = mainRef?.current?.style;

  const renderPanelTitle = {
    1: "Dashboard",
    2: "Pacientes",
    3: "Dentistas",
    4: "Perfil",
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
    if (size?.width > 760) {
      if (navigation?.width === "60px") setDesktopNav();
      else setMobileNav();
    } else alert("Não é possível no celular");
  };

  const signout = async () => {
    try {
      return signOut(auth).then(() => {
        //delete all cookies and recoil values
        setUserData({});
        setCookie("useruid", undefined);
      });
    } finally {
      router.push("/login");
    }
  };

  useEffect(() => {
    if (size?.width > 760) setDesktopNav();
    else setMobileNav();
  }, [setDesktopNav, setMobileNav, size?.width]);

  useEffect(() => {
    const Unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user)
        handlePersistLogin(user).then((User) => {
          if (User.role !== "admin") signout();
          else setUserData(User);
        });
      else signout();
    });
    return () => Unsubscribe();
  }, []);

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
      if (index !== dashboardNav.length - 1) setPage(index);
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
  return (
    <div className={styles.container}>
      <div className={styles.navigation} ref={navigationRef}>
        <ul>
          {dashboardNav.map((item, index) => {
            if (index === 0)
              return cemicLogo({ href: item.path, title: item.title });
            else
              return navigationRender(
                {
                  href: item.path,
                  title: item.title,
                  icon: item?.icon,
                },
                index
              );
          })}
        </ul>
      </div>
      <div className={styles.main} ref={mainRef}>
        <div className={styles.topbar}>
          <div className={styles.toggle} onClick={toggleMenu} ref={toggleRef}>
            <TiThMenuOutline className={styles.icon} />
          </div>
          <div className={styles.search}>
            <h2 className={styles.title}>{renderPanelTitle[page]}</h2>
          </div>
          <div className={styles.user}></div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
