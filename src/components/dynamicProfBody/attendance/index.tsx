//@ts-nocheck
import React, { useState, useEffect } from "react";
import { Box, styled, Typography, Button, IconButton } from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ScheduleIcon from "@mui/icons-material/PermContactCalendar";
import AddIcon from "@mui/icons-material/Add";
import UserData from "@/atoms/userData";
import Modal from "@/components/modal";
import Calendar from "react-calendar";
import { hoursToSelect } from "data";
import { useRecoilValue } from "recoil";
import { parseDateBr } from "@/services/services";
import { useOnSnapshotQuery } from "@/hooks/useOnSnapshotQuery";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { StyledButton } from "@/components/dynamicAdminBody/receipts";
import { db } from "@/services/firebase";
import "react-calendar/dist/Calendar.css";
import ListToSchedule from "./listSchedule";
import Loading from "@/components/loading";

interface AttendanceProfessionalProps {}

const today = new Date();
const patientsRef = collection(db, "clients_treatments");
const scheduleRef = collection(db, "schedules");

const ellipsisText = {
  textOverflow: "ellipsis",
  overflow: "hidden",
  whiteSpace: "nowrap",
  width: "100%",
  zIndex: 1000,
};

const AttendanceProfessional = (props: AttendanceProfessionalProps) => {
  const userData = useRecoilValue(UserData);
  const [dateSelected, setDateSelected] = useState<Date>(today);
  const [dayWeek, setDayWeek] = useState(dateSelected.getDay());
  const [currentDay, setCurrentDay] = useState(dateSelected.getDate());
  const [currentMonth, setCurrentMonth] = useState(dateSelected.getMonth());
  const [currentYear, setCurrentYear] = useState(dateSelected.getFullYear());
  const [modalCalendar, setModalCalendar] = useState(false);
  const [scheduleModal, setScheduleModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [client, setClient] = useState<string | null>(null);
  const [clientTreatment, setClientTreatment] = useState<string | null>(null);
  const q = query(patientsRef, where("actualProfessional", "==", userData!.id));
  const snapPatients = useOnSnapshotQuery("clients_treatments", q);

  const qSch = query(
    scheduleRef,
    where("date", "==", dateSelected.toISOString().substring(0, 10))
  );
  const snapSchedules = useOnSnapshotQuery("schedules", qSch, [dateSelected]);

  const handleCloseCalendar = () => {
    setModalCalendar(false);
  };
  const handleSelectDate = (d: any) => {
    setDateSelected(d);
    setModalCalendar(false);
    return;
  };

  const getSchedule = (h: string) => {
    if (snapSchedules.length === 0) return "";
    const find = snapSchedules.filter((v) => v?.hour === h);
    return find[0]?.client_name;
  };

  useEffect(() => {
    if (client === null && clientTreatment === null) return;
  }, [client, clientTreatment]);

  if (isLoading)
    return (
      <Box position="fixed" top={0} left={0}>
        <Loading message="Estamos trabalhando nisso..." />
      </Box>
    );

  return (
    <Box display="flex" flexDirection="column" width="100%" mt={2} px={1}>
      <Modal visible={modalCalendar} closeModal={handleCloseCalendar}>
        <Box display="flex" alignItems="center" justifyContent="center">
          <Calendar value={dateSelected} onChange={handleSelectDate} />
        </Box>
      </Modal>
      <Modal visible={scheduleModal} closeModal={() => setScheduleModal(false)}>
        <ListToSchedule
          snapPatients={snapPatients}
          setIsLoading={setIsLoading}
        />
      </Modal>

      <DoubleButtons>
        <Button
          variant="contained"
          color={"info"}
          sx={{ margin: "8px auto 16px auto", width: "fit-content" }}
          endIcon={<CalendarMonthIcon />}
          onClick={() => setModalCalendar(true)}
        >
          Escolher Data
        </Button>
        <Button
          variant="contained"
          color={"info"}
          sx={{ margin: "8px auto 16px auto", width: "fit-content" }}
          endIcon={<ScheduleIcon />}
          onClick={() => setScheduleModal(true)}
        >
          Agendar Paciente
        </Button>
      </DoubleButtons>

      <Box
        display="flex"
        alignItems="center"
        columnGap="8px"
        overflow={"auto"}
        width="100%"
      >
        <DateText variant="bold">
          {parseDateBr(dateSelected.toLocaleDateString())}
        </DateText>
      </Box>

      <Box
        display="flex"
        flexDirection="column"
        justifyContent="flex-start"
        alignItems="center"
        width="100%"
      >
        {hoursToSelect.map((v, i) => (
          <HourSingle key={i}>
            <Typography variant="semibold" width="45px">
              {v}
            </Typography>
            <HourScheduleSpace onClick={() => console.log("teste")}>
              <Typography variant="body1" sx={ellipsisText}>
                {getSchedule(v)}
              </Typography>
            </HourScheduleSpace>
          </HourSingle>
        ))}
      </Box>
    </Box>
  );
};

const DoubleButtons = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  @media screen and (max-width: 500px) {
    flex-direction: column;
  }
`;

const HourScheduleSpace = styled(Box)`
  background-color: white;
  border-radius: 4px;
  cursor: pointer;
  width: 85%;
  height: 35px;
  display: flex;
  padding: 0 8px;
  align-items: center;
  justify-content: flex-start;
`;

const HourSingle = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 40px;
  row-gap: 8px;
  column-gap: 16px;
  padding: 0 8px;
`;

const DateText = styled(Typography)`
  align-self: center;
  text-align: center;
  width: 100%;
  font-size: 18px;
  margin: 8px 0 16px 0;
  @media screen and (max-width: 760px) {
    font-size: 14px;
  }
`;

export default AttendanceProfessional;
