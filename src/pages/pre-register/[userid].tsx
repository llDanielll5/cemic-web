//@ts-nocheck
/* eslint-disable react/jsx-key */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useRecoilState } from "recoil";
import { auth, db } from "@/services/firebase";
import { getCookie, setCookie } from "cookies-next";
import { Box, Typography, SpeedDial } from "@mui/material";
import { handlePersistLogin } from "@/services/requests/auth";
import { scheduleLecture } from "@/services/requests/firestore";
import { StyledButton } from "@/components/dynamicAdminBody/receipts";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import ScheduleModalPreRegister from "@/components/pre-register/scheduleModal";
import ScheduleInformations from "@/components/pre-register/scheduleInformations";
import PreRegisterProfile from "@/components/pre-register/profile";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import styles from "../../styles/PreRegister.module.css";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import LogoutIcon from "@mui/icons-material/Logout";
import CustomTab from "@/components/customTab";
import Loading from "@/components/loading";
import Button from "@/components/button";
import UserData from "@/atoms/userData";
import Modal from "@/components/modal";
import "react-calendar/dist/Calendar.css";
import LocationPreRegister from "@/components/pre-register/location";

const defaultHours = [
  { hour: "11:00", selected: false },
  { hour: "17:00", selected: false },
];
const tabs = ["Agendamentos", "Cadastro", "Localização"];

const FirstStep = () => {
  const router = useRouter();
  const userid = router.query.userid;
  const userRef = collection(db, "clients");
  const [dateSelected, setDateSelected] = useState(new Date());
  const [userRecoil, setUserRecoil] = useRecoilState(UserData);
  const [daysScheduleds, setDaysScheduleds] = useState<any[]>([]);
  const [hoursSelected, setHoursSelected] = useState(defaultHours);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [scheduleModal, setScheduleModal] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);
  const [hour, setHour] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLogout, setIsLogout] = useState(false);
  const getuid = getCookie("useruid");

  const handleWhatsapp = async () => {
    const msg = "Preciso de ajuda para agendar meu primeiro atendimento!";
    const zapHref = `https://api.whatsapp.com/send?phone=5561986573056&text=${encodeURIComponent(
      msg
    )}`;
    return window.open(zapHref, "_blank");
  };

  const actions = [
    { icon: <WhatsAppIcon />, name: "Suporte", onClick: handleWhatsapp },
  ];

  const handleLogout = async () => {
    setIsLogout(true);
    return await auth
      .signOut()
      .then(async () => {
        const logout = await router.push("/login");

        if (logout) {
          setUserRecoil({});
          setCookie("useruid", undefined);
          setIsLogout(false);
        }
      })
      .catch((err) => {
        setIsLogout(false);
        return alert("Erro ao deslogar");
      });
  };

  const handleOpenScheduleModal = () => {
    const today = new Date();
    if (hour === null) return alert("Você tem que selecionar um horário!");

    if (dateSelected < today)
      return alert("Não é possível agendar para dias anteriores");

    if (dateSelected.getDay() === 0 || dateSelected.getDay() === 6)
      return alert("Não é possivel agendar para Finais de Semana");

    return setScheduleModal(true);
  };

  const handleSelectHour = ({ item, index }: any) => {
    const clone = [...hoursSelected];
    for (let i = 0; i < clone.length; i++) {
      if (i !== index) {
        clone[i].selected = false;
      }
    }
    clone[index].selected = !clone[index].selected;
    setHoursSelected(clone);
    if (hoursSelected[index].selected === false) {
      setHour(null);
      return;
    } else {
      setHour(item.hour);
      return;
    }
  };

  const handleSchedule = async () => {
    if (daysScheduleds.length > 0) {
      return alert(
        "Você já possui dia agendado, ou faltou. Favor entrar em contato com nosso suporte no canto inferior direito do seu painel do cliente!"
      );
    }

    const dateSelect = dateSelected.toISOString().substring(0, 10);
    setIsScheduling(true);
    await scheduleLecture(dateSelect, userRecoil!, hour!).then(async (res) => {
      if (res === "Sucesso") {
        setIsScheduling(false);
        setScheduleModal(false);
        setCalendarVisible(false);
        setHoursSelected(defaultHours);
        setHour(null);
        return alert("Sucesso ao agendar sua palestra");
      } else {
        setIsScheduling(false);
      }
    });
  };

  const getUserSchedules = async () => {
    const lecturesRef = collection(db, "lectures");
    const q = query(lecturesRef, where("client", "==", userRecoil?.id ?? ""));
    onSnapshot(q, (querySnap) => {
      if (querySnap.docs.length > 0) {
        const schedules: any[] = [];
        querySnap.forEach((querySnapshot) => {
          schedules.push(querySnapshot.data());
        });
        setDaysScheduleds(schedules);
      }
    });
  };

  const handleCloseCalendar = () => {
    setCalendarVisible(false);
    setDateSelected(new Date());
    setHoursSelected(defaultHours);
    setHour(null);
    return;
  };

  const renders = [
    <ScheduleInformations
      setCalendarVisible={setCalendarVisible}
      daysScheduleds={daysScheduleds}
    />,
    <PreRegisterProfile userData={userRecoil} />,
    <LocationPreRegister />,
  ];

  useEffect(() => {
    if (!userid) return;
    const Unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const User: any = await handlePersistLogin(user);

        // const finalUser = { ...user, ...User };
        if (User!.role !== "pre-register") handleLogout();
        else setUserRecoil(User);
      } else handleLogout();
    });

    return () => Unsubscribe();
  }, [userid]);

  useEffect(() => {
    if (
      userRecoil === {} ||
      !userRecoil ||
      userRecoil === undefined ||
      userRecoil === null
    )
      return;
    getUserSchedules();
  }, [userRecoil]);

  if (getuid === "" || getuid === undefined) return null;
  if (!userRecoil) return null;

  return (
    <>
      {isLoading && <Loading message="Verificando usuário..." />}
      {isLogout && <Loading message="Estamos deslogando sua conta..." />}
      {isScheduling && <Loading message="Estamos agendando sua palestra..." />}

      <Modal closeModal={handleCloseCalendar} visible={calendarVisible}>
        <ScheduleModalPreRegister
          dateSelected={dateSelected}
          hoursSelected={hoursSelected}
          setDateSelected={setDateSelected}
          handleSelectHour={handleSelectHour}
          handleOpenScheduleModal={handleOpenScheduleModal}
        />
      </Modal>
      <Modal closeModal={() => setScheduleModal(false)} visible={scheduleModal}>
        <div className={styles["modal-container"]}>
          <h2>Tem certeza que deseja fazer o agendamento nesse dia?</h2>
          <Typography variant="semibold" my={1} textAlign="center">
            ATENÇÃO! APÓS AGENDADO, VOCÊ NÃO PODERÁ REALIZAR NOVO AGENDAMENTO!
            DESEJA CONTINUAR?
          </Typography>
          <div className={styles["buttons-container"]}>
            <Button onClick={handleSchedule}>Sim</Button>
            <Button onClick={() => setScheduleModal(false)}>Não</Button>
          </div>
        </div>
      </Modal>

      <div className={styles.header}>
        <img
          src="/images/cemicLogo.png"
          alt="logo-cemic"
          className={styles.logo}
        />
      </div>
      <div className={styles.container}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          columnGap={4}
        >
          <Box display="flex" columnGap={1}>
            <Typography variant="bold" fontSize="24px" alignSelf="center">
              Painel do Cliente
            </Typography>
            <StyledButton onClick={handleLogout} endIcon={<LogoutIcon />}>
              Sair
            </StyledButton>
          </Box>
        </Box>

        <Typography variant="bold" my={1} textAlign="center">
          Esse é o seu painel do cliente.
        </Typography>
        <Typography variant="semibold" px={2} py={2} lineHeight="25px">
          Aqui você pode agendar seu primeiro atendimento para conhecer mais
          sobre o projeto e também concorrer a uma vaga como paciente da CEMIC.
        </Typography>
        <Typography variant="semibold" px={2} pb={2} lineHeight="25px">
          Você também pode alterar suas informações de usuário na aba de
          Cadastro abaixo.
        </Typography>

        <CustomTab labels={tabs} values={tabs} renders={renders} />

        <SpeedDial
          ariaLabel="SpeedDial basic example"
          sx={{ position: "fixed", bottom: 32, right: 32, zIndex: "1000" }}
          icon={<SpeedDialIcon openIcon={<QuestionMarkIcon />} />}
        >
          {actions.map((action) => (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.name}
              onClick={action.onClick}
            />
          ))}
        </SpeedDial>
      </div>
    </>
  );
};

export default FirstStep;
