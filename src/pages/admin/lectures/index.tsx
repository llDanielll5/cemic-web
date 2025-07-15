import React, { useCallback, useEffect, useState } from "react";
import Modal from "@/components/modal";
import Loading from "@/components/loading";
import InfoIcon from "@mui/icons-material/Info";
import styles from "../../../styles/Admin.module.css";
import CalendarModal from "@/components/modal/calendar";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AddPatientLecture from "@/components/dynamicAdminBody/lectures/addPatient";
import LectureDetails from "@/components/dynamicAdminBody/lectures/lectureDetails";
import { defaultLectures } from "data";
import { add, formatISO } from "date-fns";
import { parseDateBr, phoneMask } from "@/services/services";
import { DashboardLayout } from "src/layouts/dashboard/layout";
import { getActualLectureDetails } from "@/axios/admin/lectures";
import {
  Box,
  Typography,
  IconButton,
  Button,
  Card,
  Stack,
  Container,
} from "@mui/material";
import { toast } from "react-toastify";
import "react-calendar/dist/Calendar.css";

import { Scheduler } from "@aldabil/react-scheduler";
import LecturesTable from "@/components/table/lectures-table";
// import React, {ReactNode, SyntheticEvent} from 'react';
import ApiCalendar from "react-google-calendar-api";
import { CustomersSearch } from "@/components/new-admin/patient/customers-search";

// const config = {
//   clientId: process.env.GOOGLE_CLIENT_ID!,
//   apiKey: process.env.GOOGLE_API_KEY!,
//   scope: "https://www.googleapis.com/auth/calendar",
//   discoveryDocs: [
//     "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
//   ],
// };

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
  const [lectureData, setLectureData] = useState<
    StrapiData<LecturesInterface>[]
  >([]);
  const [searchPatientValue, setSearchPatientValue] = useState("");
  const [patientValues, setPatientValues] =
    useState<PatientInfos>(defaultPatientValues);

  // const apiCalendar = new ApiCalendar(config);

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

    try {
      const { data } = await getActualLectureDetails(date);
      setLectureData(data.data as StrapiData<LecturesInterface>[]);
    } catch (error) {
      console.log({ error });
      toast.error("Erro ao recuperar os agendamentos de Hoje!");
    }
  }, [dateSelected]);

  useEffect(() => {
    handleGetAllLecturesOfDay();
  }, [handleGetAllLecturesOfDay]);

  // function handleItemClick(event: SyntheticEvent<any>, name: string): void {
  //   if (name === "sign-in") {
  //     apiCalendar.handleAuthClick();
  //   } else if (name === "sign-out") {
  //     apiCalendar.handleSignoutClick();
  //   }
  // }

  return (
    <Stack>
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

      <Container maxWidth="xl">
        <Stack direction="row" justifyContent="space-between" spacing={2}>
          <Stack spacing={3} my={4}>
            <Typography variant="h4">Pacientes</Typography>
          </Stack>
        </Stack>
        <Stack spacing={3}>
          <Card
            elevation={10}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mx: 2,
              p: 2,
            }}
          >
            <Typography variant="h5" fontSize="18px">
              {parseDateBr(dateSelected.toLocaleDateString())}
            </Typography>
            <Button
              endIcon={<CalendarMonthIcon />}
              onClick={() => setCalendarVisible(true)}
              variant="contained"
            >
              Selecionar Data
            </Button>
          </Card>
        </Stack>

        <Box p={4}>
          <LecturesTable
            tableData={lectureData}
            tableHeads={["Horário", "Paciente", "Compareceu?", "Cadastrou?"]}
          />
        </Box>
      </Container>
    </Stack>
  );
};

LecturesAdmin.getLayout = (page: any) => (
  <DashboardLayout>{page}</DashboardLayout>
);

export default LecturesAdmin;
