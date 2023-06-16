//@ts-nocheck
/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useEffect, useCallback } from "react";
import styles from "../../styles/Dashboard.module.css";
import { useRecoilState } from "recoil";
import { dashboardNav } from "data";
import { useRouter } from "next/router";
import { signOut } from "firebase/auth";
import { getCookie, setCookie } from "cookies-next";
import { auth, db } from "@/services/firebase";
import { handlePersistLogin } from "@/services/requests/auth";
import RenderDashboard from "@/components/admin/renderDashboard";
import ScreeningModal from "@/components/admin/screeningModal";
import DynamicAdminBody from "@/components/dynamicAdminBody";
import TopBarMenu from "@/components/admin/topBarMenu";
import useWindowSize from "@/hooks/useWindowSize";
import Loading from "@/components/loading";
import UserData from "@/atoms/userData";
import Modal from "@/components/modal";
import { doc, getDoc } from "firebase/firestore";
import { ClientType } from "types";
import ClientInfos from "@/components/admin/clientInfos";

const renderPanelTitle = {
  1: "Início",
  2: "Clientes",
  3: "Recibos",
  4: "Dentistas",
  5: "Triagens",
  6: "Palestras",
  7: "Tratamentos",
  8: "Blog",
  9: "Perfil",
};

const Dashboard = () => {
  const router = useRouter();
  const size = useWindowSize();
  const toggleRef = useRef<HTMLDivElement>(null);
  const navigationRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(1);
  const [date, setDate] = useState<string>("");
  const [userData, setUserData] = useRecoilState(UserData);
  const [isScheduling, setIsScheduling] = useState(false);
  const [screeningVisible, setScreeningVisible] = useState(false);
  const [isCreateTreatment, setIsCreateTreatment] = useState(false);
  const [clientDetailsVisible, setClientDetailsVisible] = useState(false);
  const [isGeneratePayment, setIsGeneratePayment] = useState(false);
  const [clientID, setClientID] = useState<string | null>(null);
  const [clientInfos, setClientInfos] = useState<ClientType | null>({});
  const getuid = getCookie("useruid");

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
    if (size?.width > 760) {
      if (navigation?.width === "60px") setDesktopNav();
      else setMobileNav();
    } else alert("Não é possível no celular");
  };

  const closeClientModal = () => {
    setClientDetailsVisible(false);
    setClientInfos(null);
    setClientID(null);
    return;
  };

  const signout = async () => {
    return await signOut(auth).then(async () => {
      return await router.push("/login").then(() => {
        setUserData({});
        setCookie("useruid", undefined);
        return;
      });
    });
  };

  useEffect(() => {
    if (size?.width > 760) setDesktopNav();
    else setMobileNav();
  }, [setDesktopNav, setMobileNav, size?.width]);

  useEffect(() => {
    const Unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        return await handlePersistLogin(user).then((User) => {
          if (User.role === "admin" || User.role === "employee")
            return setUserData(User);
          else return signout();
        });
      } else signout();
    });
    return () => Unsubscribe();
  }, []);

  useEffect(() => {
    const getClientInfo = async () => {
      const document = doc(db, "clients", clientID);
      await getDoc(document)
        .then((res) => {
          return setClientInfos(res.data());
        })
        .catch(() => {
          return alert("deu ruim");
        });
    };
    if (clientID !== null) getClientInfo();
  }, [clientID]);

  if (getuid === "" || getuid === undefined) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.navigation} ref={navigationRef}>
        <ul>
          {dashboardNav.map((item, index) => (
            <RenderDashboard
              key={index}
              item={item}
              index={index}
              page={page}
              setPage={setPage}
              signout={signout}
              userData={userData}
              dataNav={dashboardNav}
            />
          ))}
        </ul>
      </div>

      {/* MODALS FOR ADMIN BODY */}

      <Modal
        visible={screeningVisible}
        closeModal={() => setScreeningVisible(false)}
      >
        <ScreeningModal
          date={date}
          setVisible={setScreeningVisible}
          setIsScheduling={setIsScheduling}
          clientDetailsVisible={setClientDetailsVisible}
          setClientID={setClientID}
        />
      </Modal>

      <Modal visible={clientDetailsVisible} closeModal={closeClientModal}>
        <ClientInfos client={clientInfos} />
      </Modal>
      {/*  */}

      {/* LOADINGS MODAL FOR COMPONENTS */}
      {isScheduling && (
        <Loading message="Estamos realizando o agendamento... Aguarde." />
      )}
      {isCreateTreatment && <Loading message="Adicionando tratamento..." />}
      {isGeneratePayment && <Loading message="Criando pagamento..." />}
      {/*  */}

      <div className={styles.main} ref={mainRef}>
        <TopBarMenu
          onClick={toggleMenu}
          page={page}
          toggleRef={toggleRef}
          panelTitle={renderPanelTitle}
        />
        <DynamicAdminBody
          page={page}
          setClientDetailsVisible={setClientDetailsVisible}
          setIsCreateTreatment={setIsCreateTreatment}
          setScreeningVisible={setScreeningVisible}
          setIsGeneratePayment={setIsGeneratePayment}
          setClientID={setClientID}
          setDate={setDate}
        />
      </div>
    </div>
  );
};

export default Dashboard;
