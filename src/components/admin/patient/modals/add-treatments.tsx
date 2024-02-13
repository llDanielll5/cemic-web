import React, { useEffect, useState } from "react";
import CModal from "@/components/modal";
import SaveIcon from "@mui/icons-material/Save";
import { handleGetTreatments } from "@/axios/admin/treatments";
import { Autocomplete, Box, Button, Typography, styled } from "@mui/material";
import { TextInput } from "@/components/dynamicAdminBody/screening/screeningDetails";
import { ToothsInterface } from "types/odontogram";

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
  const [treatments, setTreatments] = useState<any[]>([]);
  const [treatmentToAdd, setTreatmentToAdd] = useState(null);

  const handleSubmit = async () => {
    if (selectedRegion === null) return;

    let newDate = new Date();
    let { name, price }: any = treatmentToAdd;
    let toothData: ToothsInterface = {
      name,
      price,
      obs: "",
      finishedAt: null,
      finishedBy: null,
      hasAbsent: false,
      hasFinished: false,
      hasPayed: false,
      createdIn: newDate,
    };
    let data = { ...patientOdontogram };
    let { attributes } = data;
    let tooths = attributes?.tooths;

    let rg = "";
    if (
      selectedRegion === "Superior Total" ||
      selectedRegion === "Sup. Dir." ||
      selectedRegion === "Sup. Esq." ||
      selectedRegion === "Inferior Total" ||
      selectedRegion === "Inf. Dir." ||
      selectedRegion === "Inf. Esq."
    ) {
      rg = selectedRegion
        .replaceAll(".", "")
        .replaceAll(" ", "_")
        .toLowerCase();
    } else {
      rg = `t${selectedRegion}`;
    }

    let dataUpdate = { tooths, region: rg, toothData };

    return await onSaveTreatments(dataUpdate, patientOdontogram?.id).then((r) =>
      setTreatmentToAdd(null)
    );
  };

  const getTreatments = async () => {
    return await handleGetTreatments().then(
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
      styles={{ width: "50vw" }}
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
