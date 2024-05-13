import React, { useCallback, useEffect, useState } from "react";
import "react-calendar/dist/Calendar.css";
import Modal from "@/components/modal";
import Loading from "@/components/loading";
import InfoIcon from "@mui/icons-material/Info";
import styles from "../../../styles/Admin.module.css";
import CalendarModal from "@/components/modal/calendar";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AddPatientLecture from "@/components/dynamicAdminBody/lectures/addPatient";
import LectureDetails from "@/components/dynamicAdminBody/lectures/lectureDetails";
import { defaultLectures } from "data";
import { add, formatISO } from "date-fns";
import { LectureHours } from "types/lectures";
import { parseDateBr, phoneMask } from "@/services/services";
import { DashboardLayout } from "src/layouts/dashboard/layout";
import { getActualLectureDetails } from "@/axios/admin/lectures";
import { Box, Typography, IconButton, Button, styled } from "@mui/material";
import { Scheduler } from "@aldabil/react-scheduler";

interface PatientInfos {
  participant: string;
  date: string;
  hour: string;
  cpf: string;
}

const tomorrowFns = add(new Date(), { days: 1 });
const defaultPatientValues = {
  participant: "",
  date: tomorrowFns.toISOString().substring(0, 10),
  hour: "11:00",
  cpf: "",
};

const LecturesAdmin = () => {
  const [dateSelected, setDateSelected] = useState(new Date());
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [addPatientVisible, setAddPatientVisible] = useState(false);
  const [lectureDetailsVisible, setLectureDetailsVisible] = useState(false);
  const [lectureID, setLectureID] = useState<string | null>(null);
  const [isScheduling, setIsScheduling] = useState<boolean>(false);
  const hasWeekend = dateSelected.getDay() === 0 || dateSelected.getDay() === 6;
  const [lectureData, setLectureData] = useState<LectureHours>(defaultLectures);
  const [patientValues, setPatientValues] =
    useState<PatientInfos>(defaultPatientValues);

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
    setLectureID(null);
    return;
  };

  const handleGetDetails = (item: any) => {
    setLectureID(item?.id);
    setLectureDetailsVisible(true);
    return;
  };

  const closeAddPatient = () => {
    setAddPatientVisible(false);
    setPatientValues(defaultPatientValues);
  };

  const onScheduled = () => {
    closeAddPatient();
    setIsScheduling(false);
    return alert("Sucesso ao agendar sua palestra");
  };

  const handleSchedule = () => {
    if (dateSelected.getDay() === 0 || dateSelected.getDay() === 6)
      return alert("Não é possível agendar final de semana!");
    return setAddPatientVisible(true);
  };

  const notHaveSchedule = () => (
    <Box display="flex" alignItems="center" justifyContent="center" mt={2}>
      <Typography variant="subtitle2">
        Não há agendamentos para este horário!
      </Typography>
    </Box>
  );

  const scheduleRender = ({ item, index }: any) => (
    <div key={index} className={styles["name-container"]}>
      <p>{item?.patient?.name}</p>
      <p>{phoneMask(item?.patient?.phone)}</p>
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

  const handleGetAllLecturesOfDay = useCallback(async () => {
    if (!dateSelected) return;
    let date = formatISO(dateSelected).substring(0, 10);
    return await getActualLectureDetails(date).then(
      (res) =>
        setLectureData({
          "11:00": res.data["11:00"],
          "17:00": res.data["17:00"],
        }),
      (err) => console.log(err.response)
    );
  }, [dateSelected]);

  useEffect(() => {
    handleGetAllLecturesOfDay();
  }, [handleGetAllLecturesOfDay]);

  const EVENTS = [
    {
      event_id: 1,
      title: "Event 1",
      start: new Date(new Date(new Date().setHours(9)).setMinutes(0)),
      end: new Date(new Date(new Date().setHours(10)).setMinutes(0)),
      disabled: true,
      admin_id: [1, 2, 3, 4],
    },
  ];

  return (
    <Container>
      {/* MODALS */}
      {isScheduling && (
        <Box position="fixed" zIndex={9999} left={0} top={0}>
          <Loading message="Agendando o paciente..." />
        </Box>
      )}

      <CalendarModal
        closeModal={() => setCalendarVisible(false)}
        dateSelected={dateSelected}
        handleChangeDate={handleChangeDate}
        visible={calendarVisible}
      />

      <Modal
        visible={lectureDetailsVisible}
        closeModal={handleCloseLectureDetails}
      >
        {lectureID !== null && (
          <LectureDetails
            lectureID={lectureID}
            closeModal={handleCloseLectureDetails}
          />
        )}
      </Modal>

      <Modal visible={addPatientVisible} closeModal={closeAddPatient}>
        <AddPatientLecture
          patientValues={patientValues}
          setPatientValues={setPatientValues}
          onScheduled={onScheduled}
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
        <Typography variant="h5" fontSize="18px">
          {parseDateBr(dateSelected.toLocaleDateString())}
        </Typography>
      </Box>

      <Scheduler events={EVENTS} />
    </Container>
  );
};

LecturesAdmin.getLayout = (page: any) => (
  <DashboardLayout>{page}</DashboardLayout>
);

const Container = styled(Box)`
  background-color: white;
`;

export default LecturesAdmin;
