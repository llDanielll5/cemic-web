import React, { useEffect, useState } from "react";
import CModal from "@/components/modal";
import SaveIcon from "@mui/icons-material/Save";
import { handleGetTreatments } from "@/axios/admin/treatments";
import { Autocomplete, Box, Button, Typography, styled } from "@mui/material";
import { TextInput } from "@/components/dynamicAdminBody/screening/screeningDetails";
import {
  OdontogramRegions,
  ToothsInterface,
  TreatmentsPatientInterface,
} from "types/odontogram";
import { useRecoilValue } from "recoil";
import PatientData from "@/atoms/patient";

interface AddPatientTreatmentModalInterface {
  visible: boolean;
  closeModal: any;
  selectedRegion: any;
  patientOdontogram: any;
  onSaveTreatments: (data: any, odontogramId: any) => Promise<any>;
}

const AddPatientTreatmentModal = (props: AddPatientTreatmentModalInterface) => {
  const {
    closeModal,
    visible,
    selectedRegion,
    patientOdontogram,
    onSaveTreatments,
  } = props;

  const patientData = useRecoilValue(PatientData);
  const [treatments, setTreatments] = useState<any[]>([]);
  const [treatmentToAdd, setTreatmentToAdd] = useState(null);

  const handleSubmit = async () => {
    if (selectedRegion === null) return;

    let rg = "";
    if (
      selectedRegion === "Superior Total" ||
      selectedRegion === "Sup. Dir." ||
      selectedRegion === "Sup. Esq." ||
      selectedRegion === "Inferior Total" ||
      selectedRegion === "Inf. Dir." ||
      selectedRegion === "Inf. Esq." ||
      selectedRegion === "Total"
    ) {
      rg = selectedRegion
        .replaceAll(".", "")
        .replaceAll(" ", "_")
        .toLowerCase();
    } else {
      rg = `t${selectedRegion}`;
    }

    let { name, price }: any = treatmentToAdd;
    let newTreatment: TreatmentsPatientInterface = {
      name,
      price,
      obs: "",
      finishedAt: null,
      finishedBy: null,
      hasAbsent: false,
      hasFinished: false,
      hasPayed: false,
      region: rg as OdontogramRegions,
      odontogram: patientOdontogram?.id,
      patient: patientData?.id,
      paymentsProfessional: null,
      payment: null,
    };
    let data = { ...patientOdontogram };
    let { attributes } = data;
    let treatments = attributes?.treatments.data;
    const oldHistories = treatments.map((v: any) => {
      const attr = v.attributes;
      return {
        name: attr.name,
        obs: attr.obs,
        hasAbsent: attr.hasAbsent,
        hasFinished: attr.hasFinished,
        hasPayed: attr.hasPayed,
        price: attr.price,
        region: attr.region,
        finishedAt: attr.finishedAt,
        finishedBy: attr.finishedBy,
      };
    });
    let dataUpdate = { treatments: oldHistories, region: rg, newTreatment };
    return await onSaveTreatments(dataUpdate, patientOdontogram?.id).then((r) =>
      setTreatmentToAdd(null)
    );
  };

  const getTreatments = async () => {
    return await handleGetTreatments(undefined, "999").then(
      (res) => {
        let data = res.data.data;
        let mapped = data?.map((v: any) => ({
          name: v.attributes.name,
          price: v.attributes.price,
        }));
        setTreatments(mapped);
      },
      (err) => console.log(err.response)
    );
  };

  const handleClose = () => {
    closeModal();
    setTreatmentToAdd(null);
  };

  useEffect(() => {
    getTreatments();
  }, []);

  return (
    <CModal
      visible={visible}
      closeModal={handleClose}
      styles={{ width: "90vw" }}
    >
      <Box
        p={2}
        display="flex"
        width={"100%"}
        alignItems={"center"}
        flexDirection={"column"}
        rowGap={2}
      >
        <Typography variant="subtitle1">Escolha o Tratamento</Typography>
        <Autocomplete
          options={treatments}
          sx={{ width: "100%" }}
          limitTags={2}
          value={treatmentToAdd}
          getOptionLabel={(option) => option.name}
          isOptionEqualToValue={(option, value) =>
            option.name === value?.name && option.price === value.price
          }
          onChange={(e, v) => setTreatmentToAdd(v)}
          renderInput={(params) => (
            <TextInput
              {...params}
              placeholder="Selecione o tratamento."
              variant="standard"
            />
          )}
        />

        {treatmentToAdd !== null && (
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 1 }}
            endIcon={<SaveIcon />}
            onClick={handleSubmit}
          >
            Salvar
          </Button>
        )}
      </Box>
    </CModal>
  );
};

export default AddPatientTreatmentModal;
