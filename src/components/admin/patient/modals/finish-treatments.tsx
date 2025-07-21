/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  Autocomplete,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import { handleGetTreatmentsOfPatientToFinish } from "@/axios/admin/patient-treatments";
import { parseToothRegion } from "@/services/services";
import { useRecoilValue } from "recoil";
import CModal from "@/components/modal";
import PatientData from "@/atoms/patient";
import CheckIcon from "@mui/icons-material/Check";
import { useBoolean } from "@/hooks/use-boolean";
import AlertModal from "@/components/modal/alert-modal";

interface FinishPatientTreatmentsModal {
  visible: boolean;
  closeModal: any;
  dentists: any[];
  onSubmitEffect: (values: any) => void;
}

const FinishPatientTreatmentsModal = (props: FinishPatientTreatmentsModal) => {
  const { closeModal, visible, dentists, onSubmitEffect } = props;
  const patientData = useRecoilValue(PatientData);
  const [treatments, setTreatments] = useState([]);
  //   const confirmModal = useBoolean();

  const [treatmentsClone, setTreatmentsClone] = useState<any[]>([]);
  const [treatmentsToFinish, setTreatmentsToFinish] = useState<any[]>([]);
  const [selectedProfessional, setSelectedProfessional] = useState<any | null>(
    null
  );

  const handleCloseModal = () => {
    setTreatmentsClone([]);
    setTreatmentsToFinish([]);
    setSelectedProfessional(null);
    closeModal();
  };

  const handleAddFinishTreatments = (item: any) => {
    const filter = treatmentsClone.filter((treat) => treat !== item);
    setTreatmentsClone(filter);
    return setTreatmentsToFinish((prev) => [...(prev ?? []), item]);
  };
  const handleDeleteFinishTreatments = (item: any) => {
    const filter = treatmentsToFinish.filter((treat) => treat !== item);
    setTreatmentsToFinish(filter);
    return setTreatmentsClone((prev) => [...(prev ?? []), item]);
  };

  const handleSubmitFinishTreatments = async () => {
    onSubmitEffect({
      treatments: treatmentsToFinish.map((treat) => treat.id),
      dentist: selectedProfessional.id!,
    });
    handleCloseModal();
  };

  const handleGetTreatmentsToFinish = async () => {
    return await handleGetTreatmentsOfPatientToFinish(
      String(patientData?.id!)
    ).then(
      (res) => {
        const allTreatments = res.data.data.flatMap(
          (treat: any) => treat.attributes.treatments.data
        );
        const filter = allTreatments?.filter(
          (treat: any) => treat.attributes.finishedHistory.data === null
        );

        setTreatments(filter);
        setTreatmentsClone(filter);
      },
      (err) => console.log(err.response)
    );
  };

  useEffect(() => {
    handleGetTreatmentsToFinish();
  }, []);

  useEffect(() => {
    if (visible) handleGetTreatmentsToFinish();
  }, [visible]);

  return (
    <CModal
      visible={visible}
      closeModal={handleCloseModal}
      styles={{ width: "90vw", height: "90vh", overflow: "auto" }}
    >
      {/* <AlertModal
        onClose={confirmModal.onFalse()}
        open={confirmModal.value}
        title="Teste"
        onAccept={() => console.log("accept")}
        onRefuse={() => console.log("refuse")}
      /> */}

      <Typography variant="h6" my={2}>
        Escolha o dentista:
      </Typography>
      <Autocomplete
        options={dentists}
        sx={{ width: "85%" }}
        fullWidth
        limitTags={2}
        getOptionLabel={(option) => option.name}
        isOptionEqualToValue={(option, value) => option.name === value.name}
        onChange={(e, v) => setSelectedProfessional(v)}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="Selecione o dentista."
            variant="outlined"
          />
        )}
      />

      <Typography variant="h6" my={1}>
        Escolha os tratamentos Finalizados!
      </Typography>

      <Stack alignItems={"center"} justifyContent="center" mt={2}>
        {treatmentsClone?.length === 0 && (
          <Typography variant="h6" textAlign="center" sx={{ width: "100%" }}>
            Não há mais tratamentos para finalizar!
          </Typography>
        )}
      </Stack>
      {treatmentsClone?.length > 0 && (
        <GridContainer elevation={9}>
          {treatmentsClone?.map((v: any, i: number) => (
            <Button
              key={i}
              onClick={() => handleAddFinishTreatments(v)}
              variant="contained"
              fullWidth
              color={"success"}
            >
              {parseToothRegion(v?.attributes?.region)} - {v?.attributes?.name}
            </Button>
          ))}
        </GridContainer>
      )}

      <Typography variant="h6" my={2}>
        Tratamentos escolhidos:
      </Typography>

      <Stack alignItems={"center"} justifyContent="center" mt={2}>
        {treatmentsToFinish?.length === 0 && (
          <Typography
            variant="subtitle2"
            textAlign="center"
            sx={{ width: "100%" }}
          >
            Você não escolheu nenhum tratamento para encaminhar!
          </Typography>
        )}
      </Stack>
      {treatmentsToFinish?.length > 0 && (
        <GridContainer elevation={9}>
          {treatmentsToFinish.map((v: any, i: number) => (
            <Button
              key={i}
              onClick={() => handleDeleteFinishTreatments(v)}
              variant="contained"
              fullWidth
              color="warning"
            >
              {parseToothRegion(v?.attributes?.region)} - {v?.attributes?.name}
            </Button>
          ))}
        </GridContainer>
      )}

      {selectedProfessional !== null && treatmentsToFinish?.length > 0 ? (
        <Stack mt={4} alignItems="center" justifyContent="center">
          <Button
            variant="contained"
            onClick={handleSubmitFinishTreatments}
            endIcon={<CheckIcon />}
            fullWidth
          >
            Finalizar Tratamentos
          </Button>
        </Stack>
      ) : null}
    </CModal>
  );
};

const GridContainer = styled(Paper)`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-column-gap: 1rem;
  grid-row-gap: 1rem;
  padding: 1rem;
  @media screen and (max-width: 760px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media screen and (max-width: 500px) {
    grid-template-columns: repeat(1, 1fr);
    grid-row-gap: 0.5rem;
  }
`;

export default FinishPatientTreatmentsModal;
