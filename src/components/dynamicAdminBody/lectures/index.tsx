import React, { useState, useEffect, useCallback } from "react";
import styles from "../../../styles/Admin.module.css";
import { db } from "@/services/firebase";
import { StyledButton } from "../receipts";
import { parseDateBr } from "@/services/services";
import { useOnSnapshotQuery } from "@/hooks/useOnSnapshotQuery";
import { scheduleLecture } from "@/services/requests/firestore";
import { Box, Typography, IconButton } from "@mui/material";
import { collection, doc, getDoc, query, where } from "firebase/firestore";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import InfoIcon from "@mui/icons-material/Info";
import LectureDetails from "./lectureDetails";
import Modal from "@/components/modal";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import AddPatientLecture from "./addPatient";
import Loading from "@/components/loading";

const lecturesRef = collection(db, "lectures");
interface LectureHours {
  "11:00": any[];
  "17:00": any[];
}
interface PatientInfos {
  name: string;
  phone: string;
  date: string;
  cpf: string;
  hour: string;
}

const defaultLectures = { "11:00": [], "17:00": [] };
const defaultPatientValues = {
  name: "",
  phone: "",
  date: "",
  hour: "",
  cpf: "",
};

const LecturesAdmin = (props: any) => {
  const [clientId, setClientId] = useState<string>("");
  const [dateSelected, setDateSelected] = useState(new Date());
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [addPatientVisible, setAddPatientVisible] = useState(false);
  const [lectureDetailsVisible, setLectureDetailsVisible] = useState(false);
  const [patientValues, setPatientValues] =
    useState<PatientInfos>(defaultPatientValues);
  const [clientInfos, setClientInfos] = useState<any | null>(null);
  const [lectureInfos, setLectureInfos] = useState<any | null>(null);
  const [isScheduling, setIsScheduling] = useState<boolean>(false);
  const hasWeekend = dateSelected.getDay() === 0 || dateSelected.getDay() === 6;
  const [lectureData, setLectureData] = useState<LectureHours>(defaultLectures);
  const isoDateSelected = dateSelected.toISOString().substring(0, 10);
  const q = query(lecturesRef, where("day", "==", isoDateSelected));
  const lectureSnap = useOnSnapshotQuery("lectures", q, [dateSelected]);
  const notScheduleForThisDay =
    lectureData["11:00"]?.length === 0 &&
    lectureData["17:00"]?.length === 0 &&
    !hasWeekend;

  const handleChangeDate = (e: any) => {
    setDateSelected(e);
    setCalendarVisible(false);
    return;
  };

  const handleCloseLectureDetails = () => {
    setLectureDetailsVisible(false);
    setLectureInfos(null);
    return;
  };

  const handleGetDetails = (item: any) => {
    setLectureInfos(item);
    setLectureDetailsVisible(true);
    return;
  };

  const closeAddPatient = () => {
    setAddPatientVisible(false);
    setPatientValues(defaultPatientValues);
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
      <p>{item.name}</p>
      <p>{parsePhone(item?.phone)}</p>
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

  const handleSchedule = async () => {
    if (patientValues.name === "")
      return alert("Preencha o nome do paciente completo");
    if (patientValues.phone.length < 15)
      return alert("Preencha um telefone válido");
    if (patientValues.cpf.length < 14) return alert("Preencha um CPF válido");
    if (patientValues.date === "") return alert("Adicione uma data");
    if (patientValues.hour !== "11:00" && patientValues.hour !== "17:00")
      return alert("Adicione um horário");

    setIsScheduling(true);
    await scheduleLecture(patientValues).then(async (res) => {
      if (res === "Sucesso") {
        closeAddPatient();
        setIsScheduling(false);
        return alert("Sucesso ao agendar sua palestra");
      } else {
        setIsScheduling(false);
        return;
      }
    });
  };

  useEffect(() => {
    const filter11 = lectureSnap.filter((item) => item.hour === "11:00");
    const filter17 = lectureSnap.filter((item) => item.hour === "17:00");
    setLectureData({ "11:00": filter11, "17:00": filter17 });
  }, [lectureSnap]);

  return (
    <div className={styles.lectures}>
      {/* MODALS */}
      {isScheduling && (
        <Box position="fixed" zIndex={9999} left={0} top={0}>
          <Loading message="Agendando o paciente..." />
        </Box>
      )}

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

      <Modal
        visible={lectureDetailsVisible}
        closeModal={handleCloseLectureDetails}
      >
        {lectureInfos !== null && (
          <LectureDetails
            clientInfos={clientInfos}
            lectureInfos={lectureInfos}
            closeModal={handleCloseLectureDetails}
          />
        )}
      </Modal>

      <Modal visible={addPatientVisible} closeModal={closeAddPatient}>
        <AddPatientLecture
          patientValues={patientValues}
          setPatientValues={setPatientValues}
          handleSchedule={handleSchedule}
        />
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
        justifyContent="space-around"
        my={2}
      >
        <StyledButton
          endIcon={<PersonAddAlt1Icon />}
          sx={{ borderRadius: "4px" }}
          onClick={() => setAddPatientVisible(true)}
        >
          Agendar Paciente
        </StyledButton>

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
