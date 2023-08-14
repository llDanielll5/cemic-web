//@ts-nocheck
import React, { useState, useEffect, useCallback } from "react";
import { Box, styled, Typography, Button } from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ScheduleIcon from "@mui/icons-material/PermContactCalendar";
import UserData from "@/atoms/userData";
import Modal from "@/components/modal";
import Calendar from "react-calendar";
import { hoursToSelect } from "data";
import { useRecoilValue } from "recoil";
import { db } from "@/services/firebase";
import { parseDateBr } from "@/services/services";
import { useOnSnapshotQuery } from "@/hooks/useOnSnapshotQuery";
import ListToSchedule from "./listSchedule";
import Loading from "@/components/loading";
import "react-calendar/dist/Calendar.css";
import {
  collection,
  getDocs,
  getDoc,
  query,
  where,
  doc,
} from "firebase/firestore";

interface AttendanceProfessionalProps {}

const today = new Date();
const patientsRef = collection(db, "clients_treatments");
const scheduleRef = collection(db, "schedules");

const ellipsisText: React.CSSProperties = {
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  overflow: "hidden",
  width: "100%",
  zIndex: 1000,
};

const AttendanceProfessional = (props: AttendanceProfessionalProps) => {
  const userData = useRecoilValue(UserData);
  const [patient, setPatient] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [modalCalendar, setModalCalendar] = useState(false);
  const [scheduleModal, setScheduleModal] = useState(false);
  const [client, setClient] = useState<string | null>(null);
  const dateIso = dateSelected.toISOString().substring(0, 10);
  const [dateSelected, setDateSelected] = useState<Date>(today);
  const qSch = query(scheduleRef, where("date", "==", dateIso));
  const snapPatients = useOnSnapshotQuery("clients_treatments", q);
  const [clientTreatment, setClientTreatment] = useState<string | null>(null);
  const q = query(patientsRef, where("actualProfessional", "==", userData!.id));
  const snapSchedules = useOnSnapshotQuery("schedules", qSch, [dateSelected]);

  const handleCloseCalendar = () => setModalCalendar(false);
  const handleSelectDate = (d: any) => {
    setDateSelected(d);
    setModalCalendar(false);
    return;
  };

  const getClientInfos = useCallback(async () => {
    if (client === null) return;
    const ref = doc(db, "clients", client);
    const ref2 = collection(db, "clients_treatments");
    const q = query(ref2, where("client", "==", client));
    const snapDocument = await getDoc(ref);
    const snapDocument2 = await getDocs(q);
    if (snapDocument.exists()) setPatient(snapDocument.data());
    if (snapDocument2.docs.length > 0)
      setClientTreatment(snapDocument2.docs[0].data());
  }, [client]);

  const getSchedule = (h: string) => {
    if (snapSchedules.length === 0) return "";
    const find = snapSchedules.filter((v) => v?.hour === h);
    return find[0]?.client_name;
  };

  const getPatient = (h: string) => {
    if (snapSchedules.length === 0) return "";
    const find = snapSchedules.filter((v) => v?.hour === h);
    return setClient(find[0].client);
  };

  const handleClosePatient = () => {
    setClientTreatment(null);
    setClient(null);
    setPatient(null);
  };

  useEffect(() => {
    if (client === null && clientTreatment === null) return;
    else getClientInfos();
  }, [client, clientTreatment, getClientInfos]);

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

      {patient !== null && clientTreatment !== null && client !== null ? (
        <Modal
          visible={patient !== null && clientTreatment !== null}
          closeModal={handleClosePatient}
        >
          <h2>{patient?.name}</h2>
          <p>{clientTreatment?.actualProfessional}</p>
        </Modal>
      ) : null}

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
            <HourScheduleSpace onClick={() => getPatient(v)}>
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
