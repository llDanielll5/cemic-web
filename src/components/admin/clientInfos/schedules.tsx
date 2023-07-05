//@ts-nocheck
import React, { useState } from "react";
import { db } from "@/services/firebase";
import { useRecoilValue } from "recoil";
import { parseDateIso } from "@/services/services";
import { ForwardingHistoryInterface } from "types";
import { Box, Typography, Autocomplete } from "@mui/material";
import { useOnSnapshotQuery } from "@/hooks/useOnSnapshotQuery";
import { StyledButton } from "@/components/dynamicAdminBody/receipts";
import { TextInput } from "@/components/dynamicAdminBody/screening/screeningDetails";
import TransferWithinAStationIcon from "@mui/icons-material/TransferWithinAStation";
import Modal from "@/components/modal";
import UserData from "@/atoms/userData";
import {
  Timestamp,
  arrayUnion,
  collection,
  doc,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";

interface SchedulesPatientProps {
  client: any;
}

const ref = collection(db, "schedules");
const ref2 = collection(db, "clients_treatments");

const SchedulesPatient = (props: SchedulesPatientProps) => {
  const q = query(ref, where("client", "==", props.client?.id ?? ""));
  const snapSchedules = useOnSnapshotQuery("schedules", q);
  const qtreat = query(ref2, where("client", "==", props.client?.id ?? ""));
  const snapTreatments = useOnSnapshotQuery("clients_treatments", qtreat);
  const snapProfessionals = useOnSnapshotQuery("professionals");
  const [isLoading, setIsLoading] = useState(false);
  const [forwardModalVisible, setForwardModalVisible] = useState(false);
  const [forwardTreatments, setForwardTreatments] = useState<any[]>([]);
  const [selectedProfessional, setSelectedProfessional] = useState<any | null>(
    null
  );
  const userData = useRecoilValue(UserData);

  const handleCloseForwardModal = () => {
    setForwardModalVisible(false);
    setSelectedProfessional(null);
    setForwardTreatments([]);
    return;
  };

  const handleAddForwardTreatments = (item: any) => {
    const hasItem = forwardTreatments.filter((v) => v == item);
    if (forwardTreatments.length === 0) return setForwardTreatments([item]);
    if (hasItem.length === 0) {
      return setForwardTreatments((prev) => [...prev, item]);
    } else return;
  };

  const handleSendPatient = async () => {
    setIsLoading(true);
    const document = doc(db, "clients_treatments", snapTreatments[0]!.id);
    return await updateDoc(document, {
      "treatments.forwardeds": arrayUnion(...forwardTreatments),
    })
      .then(async () => {
        const timeNow = Timestamp.now().seconds;
        const idF = `${props.client.id}-${timeNow}`;
        const forwardInformations: ForwardingHistoryInterface = {
          timestamp: Timestamp.now(),
          reporter: userData?.id,
          client: props.client.id,
          reporter_name: userData?.name,
          professional: selectedProfessional?.id,
          professional_name: selectedProfessional?.name,
          treatments: forwardTreatments,
          realizeds: [],
          medias: [],
          problems: [],
          id: idF,
        };
        const ref = doc(db, "forwards_history", idF);
        const data = forwardInformations;
        return await setDoc(ref, data)
          .then(async () => {
            const ref = doc(db, "clients_treatments", snapTreatments[0]!.id);
            return await updateDoc(ref, {
              actualProfessional: selectedProfessional!.id,
            })
              .then(() => {
                handleCloseForwardModal();
                setIsLoading(false);
              })
              .catch(() => {
                setIsLoading(false);
              });
          })
          .catch((err) => {
            setIsLoading(false);
            return alert(
              "Não foi possível encaminhar o paciente" + err.message
            );
          });
      })
      .catch((err) => {
        setIsLoading(false);
        return alert("Não foi possível encaminhar o paciente" + err.message);
      });
  };

  return (
    <Box mt={2}>
      <Modal visible={forwardModalVisible} closeModal={handleCloseForwardModal}>
        <Typography variant="bold">Escolha o dentista:</Typography>
        <Autocomplete
          options={snapProfessionals}
          sx={{ width: "85%" }}
          limitTags={2}
          getOptionLabel={(option) => option.name}
          isOptionEqualToValue={(option, value) => option.name === value.name}
          onChange={(e, v) => setSelectedProfessional(v)}
          renderInput={(params) => (
            <TextInput
              {...params}
              placeholder="Selecione o dentista."
              variant="standard"
            />
          )}
        />
        <Typography variant="bold" mt={1}>
          Escolha os tratamentos:
        </Typography>
        <Box display="flex" columnGap={"4px"}>
          {snapTreatments[0]?.treatments?.treatment_plan?.map(
            (v: any, i: number) => (
              <StyledButton
                key={i}
                onClick={() => handleAddForwardTreatments(v)}
              >
                {v?.region} - {v?.treatments.name}
              </StyledButton>
            )
          )}
        </Box>

        <Typography variant="semibold" my={1}>
          Tratamentos escolhidos:
        </Typography>
        <Box display="flex" columnGap={"4px"}>
          {forwardTreatments?.length > 0 &&
            forwardTreatments.map((v, i) => (
              <StyledButton key={i}>
                {v?.region} - {v?.treatments?.name}
              </StyledButton>
            ))}
        </Box>

        {selectedProfessional !== null && forwardTreatments.length > 0 ? (
          <StyledButton onClick={handleSendPatient}>Encaminhar</StyledButton>
        ) : null}
      </Modal>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        columnGap={4}
        mb={1}
      >
        <Typography variant="bold">Data Marcada</Typography>
        <Typography variant="bold">Hora Marcada</Typography>
        <Typography variant="bold">Dentista</Typography>
      </Box>
      {snapSchedules.length > 0 &&
        snapSchedules.map((v, i) => (
          <Box
            key={i}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            columnGap={4}
          >
            <Typography variant="semibold">{parseDateIso(v?.date)}</Typography>
            <Typography variant="semibold">{v?.hour}</Typography>
            <Typography variant="semibold">{v?.professional}</Typography>
          </Box>
        ))}

      {userData?.role === "admin" && props.client?.role === "patient" ? (
        <Box display="flex" flexDirection="column" alignItems="center" mt={1}>
          <StyledButton
            onClick={() => setForwardModalVisible(true)}
            endIcon={<TransferWithinAStationIcon />}
          >
            Encaminhar Paciente
          </StyledButton>
        </Box>
      ) : null}
    </Box>
  );
};

export default SchedulesPatient;
