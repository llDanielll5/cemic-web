import React, { useEffect, useState } from "react";
import CModal from "@/components/modal";
import SaveIcon from "@mui/icons-material/Save";
import { handleGetTreatments } from "@/axios/admin/treatments";
import {
  Autocomplete,
  Box,
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  Stack,
  Switch,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import { TextInput } from "@/components/dynamicAdminBody/screening/screeningDetails";
import {
  OdontogramRegions,
  ToothsInterface,
  TreatmentsPatientInterface,
} from "types/odontogram";
import { useRecoilValue } from "recoil";
import PatientData from "@/atoms/patient";
import CustomTextField from "@/components/customTextField";
import { Formik } from "formik";
import { parseToBrl } from "./receipt-preview";

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
  const [treatmentToAdd, setTreatmentToAdd] = useState<any | null>(null);
  const [selectMode, setSelectMode] = useState(true);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectMode(event.target.checked);
  };

  const handleSubmit = async (
    mode: "formik" | "submit",
    values?: { name: string; price: string }
  ) => {
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

    let submitValues = { name: "", price: 0 };

    if (mode === "submit") {
      submitValues = {
        name: treatmentToAdd.name,
        price: treatmentToAdd.price,
      };
    } else {
      submitValues = {
        name: values!.name,
        price: parseFloat(
          values!.price
            .replaceAll("R$ ", "")
            .replaceAll(".", "")
            .replaceAll(",", ".")
        ),
      };
    }
    let newTreatment: TreatmentsPatientInterface = {
      name: submitValues.name,
      price: submitValues.price,
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
    let attr = data?.attributes ?? data;
    let treatments = attr?.treatments.data;
    const oldHistories: PatientTreatmentInterface = treatments?.map(
      (v: any) => {
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
      }
    );
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
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
          width={"100%"}
        >
          <Typography variant="subtitle1">Escolha o Tratamento</Typography>
          <FormControl component="fieldset" variant="standard">
            <FormControlLabel
              control={
                <Switch
                  checked={selectMode}
                  onChange={handleChange}
                  name="Mudar Seleção de Tratamento"
                />
              }
              label={
                selectMode
                  ? "Desejo Selecionar o Tratamento"
                  : "Desejo Adicionar um Tratamento"
              }
            />
          </FormControl>
        </Stack>
        {!!selectMode && (
          <Autocomplete
            options={treatments}
            sx={{ width: "100%" }}
            limitTags={2}
            value={treatmentToAdd}
            getOptionLabel={(option) =>
              `${option.name} => ${parseToBrl(option.price)}`
            }
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
        )}

        {!selectMode && (
          <Formik
            initialValues={{ name: "", price: "" }}
            onSubmit={(values) => {}}
          >
            {({ setFieldValue, values }) => (
              <Stack
                direction={"column"}
                width={"100%"}
                gap={2}
                component={"form"}
              >
                <Stack>
                  <Typography variant="subtitle1">
                    Qual Tratamento a ser adicionado?
                  </Typography>

                  <CustomTextField
                    name="name"
                    label="Tratamento"
                    value={values.name}
                    onChange={(e) => setFieldValue("name", e.target.value)}
                    fullWidth
                  />
                </Stack>
                <Stack>
                  <Typography variant="subtitle1">
                    Qual o Valor do Tratamento?
                  </Typography>

                  <CustomTextField
                    mask="currency"
                    label="Valor R$"
                    value={values.price.toString()}
                    onChange={({ target }) =>
                      setFieldValue("price", target.value)
                    }
                    name="price"
                  />
                </Stack>

                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ mt: 1 }}
                  endIcon={<SaveIcon />}
                  onClick={(e) => handleSubmit("formik", values)}
                  disabled={
                    values.name.length === 0 || values.price.length === 0
                  }
                >
                  Salvar
                </Button>
              </Stack>
            )}
          </Formik>
        )}

        {treatmentToAdd !== null && (
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 1 }}
            endIcon={<SaveIcon />}
            onClick={() => handleSubmit("submit")}
          >
            Salvar
          </Button>
        )}
      </Box>
    </CModal>
  );
};

export default AddPatientTreatmentModal;
