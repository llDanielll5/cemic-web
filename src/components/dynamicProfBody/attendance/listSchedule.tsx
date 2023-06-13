//@ts-nocheck
import React, { useState, useEffect, useCallback } from "react";
import ClientInfos from "@/components/admin/clientInfos";
import { addDoc, collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { TextInput } from "@/components/dynamicAdminBody/screening/screeningDetails";
import { StyledButton } from "@/components/dynamicAdminBody/receipts";
import { Box, Typography, Button, Autocomplete } from "@mui/material";
import { hoursToSelect } from "data";
import { useRecoilValue } from "recoil";
import { db } from "@/services/firebase";
import Modal from "@/components/modal";
import Calendar from "react-calendar";
import UserData from "@/atoms/userData";

interface ListToScheduleProps {
  snapPatients: any[];
  setIsLoading: (e: boolean) => void;
}

const today = new Date();
const clientRef = collection(db, "clients");

const ListToSchedule = (props: ListToScheduleProps) => {
  const { snapPatients, setIsLoading } = props;
  const [dateSelected, setDateSelected] = useState<Date>(today);
  const [hoursSelected, setHoursSelected] = useState<string>("");
  const [clientId, setClientId] = useState<string | null>(null);
  const [clientInfos, setClientInfos] = useState<any | null>(null);
  const [schedulingModal, setSchedulingModal] = useState(false);
  const [patientDetailsVisible, setPatientDetailsVisible] = useState(false);
  const userData = useRecoilValue(UserData);

  const handleClosePatientDetails = () => {
    setClientId(null);
    setClientInfos(null);
    setPatientDetailsVisible(false);
  };

  const handleGetDetails = (id: string) => {
    setClientId(id);
    setPatientDetailsVisible(true);
  };

  const handleToSchedule = (id: string) => {
    setClientId(id);
    setSchedulingModal(true);
  };

  const handleCloseSchedule = () => {
    setClientId(null);
    setSchedulingModal(false);
  };

  const handleSelectDate = (d: any) => {
    return setDateSelected(d);
  };

  async function handleSchedule() {
    setIsLoading(true);
    const ref = collection(db, "schedules");
    return await addDoc(ref, {
      client: clientId,
      client_name: clientInfos.name,
      date: dateSelected.toISOString().substring(0, 10),
      hour: hoursSelected,
      professional: userData?.id,
      hasMissed: null,
      observations: "",
      medias: [],
      realizeds: [],
    })
      .then(async (snapshot) => {
        const document = doc(db, "schedules", snapshot.id);
        return await updateDoc(document, { id: snapshot.id })
          .then(() => {
            alert("Paciente agendado com sucesso!");
            setIsLoading(false);
            return handleCloseSchedule();
          })
          .catch(() => {
            setIsLoading(false);
            return alert("Erro ao adicionar id do documento");
          });
      })
      .catch((err) => {
        setIsLoading(false);
        alert("Erro ao adicionar o documento");
      });
  }

  const getClientDetails = useCallback(async () => {
    const document = doc(db, "clients", clientId!);
    return await getDoc(document).then((snapshot) => {
      setClientInfos(snapshot.data());
    });
  }, [clientId]);

  useEffect(() => {
    if (clientId === null) return;
    getClientDetails();
  }, [clientId, getClientDetails]);

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
    >
      {/* MODALS */}
      <Modal
        visible={patientDetailsVisible}
        closeModal={handleClosePatientDetails}
      >
        {clientInfos !== null && <ClientInfos client={clientInfos} />}
      </Modal>
      <Modal visible={schedulingModal} closeModal={handleCloseSchedule}>
        <Box display="flex" flexDirection="column" alignItems="center" p={2}>
          <Typography variant="bold" mb={2}>
            Escolha a data e horário para agendamento
          </Typography>
          <Calendar value={dateSelected} onChange={handleSelectDate} />
          <Autocomplete
            options={hoursToSelect}
            sx={{ width: "40%", margin: "16px 0 16px 0" }}
            limitTags={2}
            onChange={(e, v) => setHoursSelected(v!)}
            renderInput={(params) => (
              <TextInput
                {...params}
                placeholder="Escolha o horário"
                variant="standard"
              />
            )}
          />

          <StyledButton onClick={handleSchedule}>Agendar Paciente</StyledButton>
        </Box>
      </Modal>
      {/* END MODALS */}

      <Typography variant="bold" mb={1}>
        Lista de pacientes
      </Typography>
      <Box
        border={"1.3px solid var(--dark-blue)"}
        p={2}
        width="100%"
        borderRadius={2}
      >
        <Box
          display="flex"
          alignItems="center"
          width="100%"
          justifyContent="space-between"
        >
          <Typography variant="bold">Paciente</Typography>
          <Typography variant="bold">ID Triagem</Typography>
          <Typography variant="bold">Agendar Pac.</Typography>
        </Box>
        {snapPatients.length > 0 &&
          snapPatients.map((v, i) => (
            <Box
              key={i}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Button
                variant="text"
                color="info"
                onClick={() => handleGetDetails(v?.client)}
              >
                {v?.client}
              </Button>
              <Button color="info" variant="text">
                {v?.screeningId}
              </Button>
              <StyledButton
                sx={{ textTransform: "capitalize" }}
                onClick={() => handleToSchedule(v?.client)}
              >
                Agendar
              </StyledButton>
            </Box>
          ))}
      </Box>
    </Box>
  );
};

export default ListToSchedule;
