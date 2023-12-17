//@ts-nocheck
import React, { useState, useEffect, useCallback } from "react";
import { Box, styled, Typography, Button, TextField } from "@mui/material";
import ScheduleIcon from "@mui/icons-material/PermContactCalendar";
import UserData from "@/atoms/userData";
import Modal from "@/components/modal";
import { useRecoilValue } from "recoil";
import { db } from "@/services/firebase";
import { parseDateBr, phoneMask } from "@/services/services";
import { useOnSnapshotQuery } from "@/hooks/useOnSnapshotQuery";
import PostAddIcon from "@mui/icons-material/PostAdd";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import Loading from "@/components/loading";
import "react-calendar/dist/Calendar.css";
import { StyledButton } from "@/components/dynamicAdminBody/receipts";
import {
  collection,
  getDocs,
  getDoc,
  query,
  where,
  doc,
  Timestamp,
} from "firebase/firestore";

interface AttendanceProfessionalProps {}

const today = new Date();
const patientsRef = collection(db, "clients");
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
  const [patient, setPatient] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [scheduleModal, setScheduleModal] = useState(false);
  const [reportModal, setReportModal] = useState(false);
  const [client, setClient] = useState<string | null>(null);
  const [dateSelected, setDateSelected] = useState<Date>(today);
  const dateIso = dateSelected.toISOString().substring(0, 10);
  const qSch = query(scheduleRef, where("date", "==", dateIso));
  const q = query(patientsRef, where("actualProfessional", "==", userData!.id));
  const [clientTreatment, setClientTreatment] = useState<any | null>(null);
  const [forwardedsTreatments, setForwardedsTreatments] = useState([]);
  const [selectedTreatmentsFinish, setSelectedTreatmentsFinish] = useState([]);
  const [confirmTreatmentModal, setConfirmTreatmentModal] = useState(false);
  const snapSchedules = useOnSnapshotQuery("schedules", qSch, [dateSelected]);
  const snapClients = useOnSnapshotQuery("clients", q);

  const getClientInfos = useCallback(async () => {
    if (client === null) return;
    const ref = doc(db, "clients", client);
    const ref2 = collection(db, "clients_treatments");
    const q = query(ref2, where("client", "==", client));
    const snapDocument = await getDoc(ref);
    const snapDocument2 = await getDocs(q);
    if (snapDocument.exists()) setPatient(snapDocument.data());
    if (snapDocument2.docs.length > 0) {
      setClientTreatment(snapDocument2.docs[0].data());
      setForwardedsTreatments(clientTreatment?.treatments?.forwardeds);
    }
  }, [client]);

  const handleAddForwardTreatments = (item: any) => {
    const hasItem = selectedTreatmentsFinish.filter((v) => v === item);
    if (selectedTreatmentsFinish.length === 0)
      return setSelectedTreatmentsFinish([item]);
    if (hasItem.length === 0) {
      setSelectedTreatmentsFinish((prev) => [...prev, item]);
    } else return;
  };

  const closeReportModal = () => {
    setReportModal(false);
    setSelectedTreatmentsFinish([]);
  };

  const handleClosePatient = () => {
    setClientTreatment(null);
    setClient(null);
    setPatient(null);
  };

  const handleSubmitTreatment = async () => {
    let isoTimeNow = new Date().toISOString().substring(0, 10);
    let values = {
      professional: userData?.id,
      client: client?.id,
      date: Timestamp.now(),
      dateStr: isoTimeNow,
      medias: [],
      hasPayed: false,
      updatedAt: isoTimeNow,
      content: {},
    };
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
      <Modal visible={scheduleModal} closeModal={() => setScheduleModal(false)}>
        {snapClients?.length > 0 &&
          snapClients.map((v, i) => <Box key={i}>{v?.name}</Box>)}
      </Modal>

      {patient !== null && clientTreatment !== null && client !== null ? (
        <Modal
          visible={patient !== null && clientTreatment !== null}
          closeModal={handleClosePatient}
        >
          <h3>{patient?.name}</h3>
          <h3>{phoneMask(patient?.phone)}</h3>

          <Typography variant="body1">
            Tratamentos a serem realizados
          </Typography>
          {clientTreatment?.treatments?.forwardeds.map((v, i) => (
            <p key={i}>· {v.treatments.name}</p>
          ))}

          <StyledButton
            endIcon={<PostAddIcon />}
            onClick={() => setReportModal(true)}
          >
            Gerar Relatório
          </StyledButton>
          <StyledButton endIcon={<ContentPasteIcon />}>
            Gerar Atestado Comparecimento
          </StyledButton>
          <StyledButton endIcon={<AssignmentIndIcon />}>
            Gerar Atestado Médico
          </StyledButton>
        </Modal>
      ) : null}

      <Modal visible={reportModal} closeModal={closeReportModal}>
        <Typography variant="subtitle1" mt={1}>
          Quais tratamentos foram feitos?
        </Typography>
        <Box display="flex" columnGap={"4px"}>
          {clientTreatment?.treatments?.forwardeds.map((v: any, i: number) => (
            <StyledButton key={i} onClick={() => handleAddForwardTreatments(v)}>
              {v?.region} - {v?.treatments.name}
            </StyledButton>
          ))}
        </Box>

        <Typography variant="subtitle1" my={1}>
          Tratamentos escolhidos:
        </Typography>
        <Box display="flex" columnGap={"4px"}>
          {selectedTreatmentsFinish?.length > 0 &&
            selectedTreatmentsFinish.map((v: any, i: number) => (
              <StyledButton key={i}>
                {v?.region} - {v?.treatments?.name}
              </StyledButton>
            ))}
        </Box>

        <StyledButton onClick={() => setConfirmTreatmentModal(true)}>
          Finalizar Consulta
        </StyledButton>
      </Modal>

      <Modal
        visible={confirmTreatmentModal}
        closeModal={() => setConfirmTreatmentModal(false)}
      >
        <Box
          display="flex"
          alignItems={"center"}
          justifyContent={"center"}
          flexDirection={"column"}
        >
          <Typography variant="subtitle1">Confirma os tratamentos?</Typography>
          <Box display="flex" columnGap={1}>
            <StyledButton onClick={handleSubmitTreatment}>Sim</StyledButton>
            <StyledButton onClick={() => setConfirmTreatmentModal(false)}>
              Não
            </StyledButton>
          </Box>
        </Box>
      </Modal>

      <DoubleButtons>
        <TextField
          sx={{ width: "fit-content", backgroundColor: "white" }}
          value={dateSelected.toISOString().substring(0, 10)}
          onChange={(e) => setDateSelected(new Date(e.target.value))}
          InputLabelProps={{ shrink: true }}
          label="Selecionar Data"
          type={"date"}
        />
        <Button
          variant="contained"
          color={"info"}
          sx={{ width: "fit-content", height: "55px" }}
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
        my={2}
      >
        <DateText variant="subtitle1">
          {parseDateBr(dateSelected.toLocaleDateString())}
        </DateText>
      </Box>

      <Box
        display="flex"
        flexDirection="column"
        justifyContent="flex-start"
        alignItems="center"
        width="100%"
      ></Box>
    </Box>
  );
};

const DoubleButtons = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  column-gap: 2rem;
  width: 100%;
  @media screen and (max-width: 500px) {
    flex-direction: column;
  }
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
