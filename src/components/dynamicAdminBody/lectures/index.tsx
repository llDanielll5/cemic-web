import React, { useState, useEffect, useCallback } from "react";
import styles from "../../../styles/Admin.module.css";
import { db } from "@/services/firebase";
import { Box, Typography, Button, IconButton } from "@mui/material";
import { parseDateBr } from "@/services/services";
import { useOnSnapshotQuery } from "@/hooks/useOnSnapshotQuery";
import {
  collection,
  doc,
  getDoc,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { StyledButton } from "../receipts";
import Modal from "@/components/modal";
import Calendar from "react-calendar";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import InfoIcon from "@mui/icons-material/Info";
import "react-calendar/dist/Calendar.css";
import LectureDetails from "./lectureDetails";

const lecturesRef = collection(db, "lectures");
interface LectureHours {
  "11:00": any[];
  "17:00": any[];
}

const defaultLectures = { "11:00": [], "17:00": [] };

const LecturesAdmin = (props: any) => {
  const [dateSelected, setDateSelected] = useState(new Date());
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [lectureDetailsVisible, setLectureDetailsVisible] = useState(false);
  const [clientId, setClientId] = useState<string>("");
  const [clientInfos, setClientInfos] = useState<any | null>(null);
  const [lectureInfos, setLectureInfos] = useState<any | null>(null);
  const hasWeekend = dateSelected.getDay() === 0 || dateSelected.getDay() === 6;
  const [lectureData, setLectureData] = useState<LectureHours>(defaultLectures);
  const isoDateSelected = dateSelected.toISOString().substring(0, 10);
  const q = query(lecturesRef, where("day", "==", isoDateSelected));
  const lectureSnap = useOnSnapshotQuery("lectures", q, [dateSelected]);
  const notScheduleForThisDay =
    lectureData["11:00"]?.length === 0 &&
    lectureData["17:00"]?.length === 0 &&
    !hasWeekend;

  const getPatientInfo = useCallback(async () => {
    const docRef = doc(db, "clients", clientId);
    const querySnapshot = await getDoc(docRef);

    return setClientInfos(querySnapshot.data());
  }, [clientId]);

  const handleChangeDate = (e: any) => {
    setDateSelected(e);
    setCalendarVisible(false);
    return;
  };

  const handleCloseLectureDetails = () => {
    setLectureDetailsVisible(false);
    setLectureInfos(null);
    setClientInfos(null);
    setClientId("");
    return;
  };

  const handleGetDetails = (item: any) => {
    setClientId(item!.client);
    setLectureInfos(item);
    setLectureDetailsVisible(true);
    return;
  };

  const parsePhone = (phone: string) => {
    if (phone === "" || !phone) return "";
    const parsed = phone
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d{4})/, "$1-$2");

    return parsed;
  };

  const notHaveSchedule = () => (
    <Box display="flex" alignItems="center" justifyContent="center" mt={2}>
      <Typography variant="semibold">
        Não há agendamentos para este horário!
      </Typography>
    </Box>
  );

  const scheduleRender = ({ item, index }: any) => (
    <div key={index} className={styles["name-container"]}>
      <p>{item.client_name}</p>
      <p>{parsePhone(item?.client_phone)}</p>
      {item.missed ? (
        <h5>Paciente faltou</h5>
      ) : (
        <IconButton
          onClick={() => handleGetDetails(item)}
          sx={{ margin: 0, color: "var(--dark-blue)" }}
        >
          <InfoIcon />
        </IconButton>
      )}
    </div>
  );

  useEffect(() => {
    const filter11 = lectureSnap.filter((item) => item.hour === "11:00");
    const filter17 = lectureSnap.filter((item) => item.hour === "17:00");
    setLectureData({ "11:00": filter11, "17:00": filter17 });
  }, [lectureSnap]);

  useEffect(() => {
    if (clientId === "") return;
    getPatientInfo();
  }, [clientId, getPatientInfo]);

  return (
    <div className={styles.lectures}>
      {/* MODALS */}
      <Modal
        visible={calendarVisible}
        closeModal={() => setCalendarVisible(false)}
      >
        <Box display="flex" alignItems="center" flexDirection="column">
          <Typography variant="bold" mb={1} textAlign="center">
            Selecione a data desejada:
          </Typography>
          <Calendar onChange={handleChangeDate} value={dateSelected} />
        </Box>
      </Modal>
      {/* //              // */}
      <Modal
        visible={lectureDetailsVisible}
        closeModal={handleCloseLectureDetails}
      >
        {clientInfos !== null && (
          <LectureDetails
            clientInfos={clientInfos}
            lectureInfos={lectureInfos}
            closeModal={handleCloseLectureDetails}
          />
        )}
      </Modal>
      {/* END MODALS */}

      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        width="100%"
        mt={2}
        sx={{ backgroundColor: "white" }}
      >
        <Typography variant="bold" fontSize="18px">
          {parseDateBr(dateSelected.toLocaleDateString())}
        </Typography>
      </Box>

      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        width="100%"
        my={1}
      >
        <StyledButton
          endIcon={<CalendarMonthIcon />}
          sx={{ borderRadius: "4px" }}
          onClick={() => setCalendarVisible(true)}
        >
          Selecionar Data
        </StyledButton>
      </Box>

      {hasWeekend ? (
        <h3>Não há atendimentos no Final de Semana!</h3>
      ) : notScheduleForThisDay ? (
        <h3>Ninguém agendou para este dia!</h3>
      ) : (
        <div className={styles["hour-schedule"]}>
          <div className={styles["hour-item"]}>
            <h4>11:00</h4>
            {lectureData["11:00"]?.length > 0
              ? lectureData["11:00"]?.map((item, index) =>
                  scheduleRender({ item, index })
                )
              : notHaveSchedule()}
          </div>

          <div className={styles["hour-item"]}>
            <h4>17:00</h4>
            {lectureData["17:00"]?.length > 0
              ? lectureData["17:00"].map((item, index) =>
                  scheduleRender({ item, index })
                )
              : notHaveSchedule()}
          </div>
        </div>
      )}
    </div>
  );
};

export default LecturesAdmin;
