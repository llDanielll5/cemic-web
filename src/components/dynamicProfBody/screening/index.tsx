//@ts-nocheck
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import styles from "../../../styles/Admin.module.css";
import "react-calendar/dist/Calendar.css";
import Button from "@/components/button";
import { IconButton } from "@mui/material";
import {
  BsFillArrowLeftSquareFill as ArrowLeft,
  BsFillArrowRightSquareFill as ArrowRight,
  BsFillCalendar2EventFill,
} from "react-icons/bs";
import { parseDateBr, phoneMask } from "@/services/services";
import { ScreeningInformations } from "types";
import { useRecoilValue } from "recoil";
import { db } from "@/services/firebase";
import { Box } from "@mui/material";
import Modal from "@/components/modal";
import Calendar from "react-calendar";
import UserData from "@/atoms/userData";
import ClientInfos from "@/components/admin/clientInfos";
import EditNoteIcon from "@mui/icons-material/EditNote";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import { useOnSnapshotQuery } from "@/hooks/useOnSnapshotQuery";
import ScreeningDetailsProfessional from "./details";
import {
  collection,
  doc,
  getDoc,
  orderBy,
  query,
  where,
} from "firebase/firestore";

interface ScreeningProps {
  setDate: (e: string) => void;
  setIsCreateTreatment: (e: boolean) => void;
}

const momentIso = new Date().toISOString().substring(0, 10);
const screeningRef = collection(db, "screenings");
const arrowStyle = { borderRadius: "4px", color: "#1b083e", cursor: "pointer" };

const ScreeningProfessional = (props: ScreeningProps) => {
  const { setDate, setIsCreateTreatment } = props;
  const [dateSelected, setDateSelected] = useState(new Date());
  const [currentDay, setCurrentDay] = useState<number>(new Date().getDate());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [calendarVisible, setCalendarVisible] = useState<boolean>(false);
  const [clientDetailsVisible, setClientDetailsVisible] = useState(false);
  const [clientInfos, setClientInfos] = useState<any | null>(null);
  const [clientUpdateModal, setClientUpdateModal] = useState(false);
  const [clientUpdateInfos, setClientUpdateInfos] = useState(null);
  const [clientID, setClientID] = useState(null);

  const lastDayOfMonth = new Date(currentYear, currentMonth, 0).getDate();
  const date = new Date(currentYear, currentMonth, currentDay);
  const datePickerValue = date.toISOString().substring(0, 10);
  const yesterday = datePickerValue < momentIso;
  const dateBr = date.toLocaleDateString();
  const [screeningList, setScreeningList] = useState<
    ScreeningInformations[] | null
  >(null);

  const userData = useRecoilValue(UserData);
  const hasId = userData.id ?? "";

  // SNAPSHOT QUERY FOR SCREENINGS COLLECTION
  const q = query(
    screeningRef,
    where("date", "==", datePickerValue),
    where("professionalId", "==", hasId),
    orderBy("hour", "asc")
  );
  const snapScreening = useOnSnapshotQuery("screenings", q, [
    currentYear,
    currentMonth,
    currentDay,
  ]);

  useEffect(() => {
    const getClientInfo = async () => {
      const document = doc(db, "clients", clientID);
      await getDoc(document)
        .then((res) => {
          return setClientInfos(res.data());
        })
        .catch(() => {
          return alert("Não foi possível recuperar informações do paciente");
        });
    };
    if (clientID !== null) getClientInfo();
  }, [clientID]);

  useEffect(() => {
    setScreeningList(snapScreening);
  }, [snapScreening]);

  useEffect(() => {
    setDate(datePickerValue);
  }, [currentDay, currentYear, currentMonth, datePickerValue]);

  useEffect(() => {
    setDate(momentIso);
  }, []);

  const previousMonth = () => {
    if (currentMonth === 0) {
      setCurrentDay(0);
      setCurrentMonth(11);
      setCurrentYear((prev) => prev - 1);
      return;
    }
    setCurrentMonth((prev) => prev - 1);
    setCurrentDay(lastDayOfMonth + 1);
    return;
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((prev) => prev + 1);
      return;
    }
    setCurrentMonth((prev) => prev + 1);
    setCurrentDay(0);
    return;
  };

  const onChangeDate = (e: Date) => {
    setDateSelected(e);
    setCurrentYear(e.getFullYear());
    setCurrentMonth(e.getMonth());
    setCurrentDay(e.getDate());
    setCalendarVisible(false);
    return;
  };

  const handleNextDay = () => {
    if (currentDay === lastDayOfMonth - 1) nextMonth();
    setCurrentDay((prev) => prev + 1);
  };

  const handlePreviousDay = () => {
    if (currentDay === 1) previousMonth();
    setCurrentDay((prev) => prev - 1);
  };

  const closeClientDetailsModal = () => {
    setClientDetailsVisible(false);
    setClientInfos(null);
    setClientID(null);
    return;
  };

  const handleCloseClientUpdateModal = () => {
    setClientUpdateInfos(null);
    setClientUpdateModal(false);
    return;
  };

  const renderTableItem = ({ item, index }: any) => {
    const handleGetDetails = () => {
      setClientID(item?.patientId);
      setClientDetailsVisible(true);
      return;
    };
    const handleUpdate = () => {
      setClientUpdateInfos(item);
      setClientUpdateModal(true);
      return;
    };
    return (
      <div className={styles["table-item"]} key={index}>
        <p>{item?.hour}</p>
        <p>
          Nome: <span>{item?.name}</span>
        </p>
        <p>
          Telefone: <span>{phoneMask(item?.phone)}</span>
        </p>

        <Button onClick={handleUpdate}>
          <EditNoteIcon />
        </Button>
        <IconButton onClick={handleGetDetails}>
          <PersonSearchIcon />
        </IconButton>
      </div>
    );
  };

  const renderNotHaveSchedules = () => (
    <div className={styles["not-schedules"]}>
      <h3>Não há agendamento de triagem para este dia!</h3>
    </div>
  );
  const renderPassedDayNotSchedule = () => (
    <div className={styles["not-schedules"]}>
      <h3>Não houve triagem nesse dia que passou!</h3>
    </div>
  );
  const renderHaveSchedule = () => {
    return (
      <div>
        <h2>Pacientes</h2>

        <div className={styles.table}>
          {screeningList !== null &&
            screeningList?.map((item, index) =>
              renderTableItem({ item, index })
            )}
        </div>
      </div>
    );
  };

  const renderScreening = () => {
    const notScreenings = screeningList?.length === 0;
    const momentLess = notScreenings && datePickerValue < momentIso;
    const momentMore = notScreenings && datePickerValue >= momentIso;

    if (momentLess) return renderPassedDayNotSchedule();
    if (momentMore) return renderNotHaveSchedules();
    if (screeningList !== null) return renderHaveSchedule();
  };

  return (
    <div className={styles.screening}>
      <Modal
        visible={clientDetailsVisible}
        closeModal={closeClientDetailsModal}
      >
        <ClientInfos client={clientInfos} />
      </Modal>
      <Modal
        visible={calendarVisible}
        closeModal={() => setCalendarVisible(false)}
      >
        <div className={styles["date-select-container"]}>
          <h4>Selecione uma data</h4>
          <Calendar onChange={onChangeDate} value={dateSelected} />
        </div>
      </Modal>

      <Modal
        closeModal={handleCloseClientUpdateModal}
        visible={clientUpdateModal}
      >
        <ScreeningDetailsProfessional
          infos={clientUpdateInfos}
          setIsCreateTreatment={setIsCreateTreatment}
          onClose={handleCloseClientUpdateModal}
        />
      </Modal>

      <Box
        my={2}
        px={1}
        mx={"auto"}
        display="flex"
        columnGap={"4px"}
        borderRadius={"4px"}
        alignItems={"center"}
        justifyContent="center"
        sx={{ backgroundColor: "white", width: "fit-content" }}
      >
        <ArrowLeft style={arrowStyle} onClick={handlePreviousDay} />
        <div className={styles.calendar}>
          <span>{parseDateBr(dateBr)}</span>
        </div>
        <ArrowRight style={arrowStyle} onClick={handleNextDay} />
      </Box>

      <div className={styles["have-schedule-container"]}>
        <div className={styles["have-schedule-item"]}>
          <h5>{parseDateBr(date.toLocaleDateString())}</h5>
        </div>

        <div className={styles["have-schedule-item"]}>
          <BsFillCalendar2EventFill
            className={styles.icon}
            onClick={() => setCalendarVisible(true)}
          />
        </div>
      </div>

      <div className={styles["screening-container"]}>{renderScreening()}</div>
    </div>
  );
};

export default ScreeningProfessional;
