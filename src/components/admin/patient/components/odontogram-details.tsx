import React, { useState, useEffect } from "react";
import CModal from "@/components/modal";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import ToothHistoryTable from "@/components/table/toothHistory";
import { dentalArch } from "data";
import { handleGetTreatments } from "@/axios/admin/treatments";
import { getOdontogramDetails } from "@/axios/admin/odontogram";
import { ToothsInterface } from "types/odontogram";
import { formatISO } from "date-fns";
import {
  Box,
  Typography,
  styled,
  Button,
  TextField,
  Menu,
  Autocomplete,
} from "@mui/material";

interface OdontogramPatientDetailsInterface {
  onSaveTreatments: (data: any, odontogramId: any) => Promise<any>;
  patientOdontogram: any;
}

const buttonStyle = {
  margin: "1px 2.8px",
  padding: "1.8px",
  maxWidth: "35px",
  maxHeight: "34px",
  width: "35px",
  height: "34px",
  fontWeight: 700,
  fontSize: "14px",
  outline: "none",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};

const toothRegions = [
  "Superior Total",
  "Sup. Dir.",
  "Sup. Esq.",
  "Inferior Total",
  "Inf. Dir.",
  "Inf. Esq.",
];
const buttonProps = { fullWidth: true, variant: "contained" };

const OdontogramPatientDetails = (props: OdontogramPatientDetailsInterface) => {
  const { onSaveTreatments, patientOdontogram } = props;
  const { lb, lt, rb, rt } = dentalArch;
  const [treatments, setTreatments] = useState<any[]>([]);
  const [toothDetails, setToothDetails] = useState<any>([]);
  const [addTreatmentVisible, setAddTreatmentVisible] = useState(false);
  const [treatmentToAdd, setTreatmentToAdd] = useState(null);

  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  // Tooth Menu #
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) =>
    setAnchorEl(event.currentTarget);
  const handleClose = () => {
    setSelectedRegion(null);
    setAnchorEl(null);
  };
  // END Tooth Menu #

  // useEffect(() => {
  //   if (previousTreatments?.length === 0 || previousTreatments === undefined)
  //     return;
  //   setSelectedTreatments([...previousTreatments]);
  //   let previousRegions: any[] = previousTreatments?.map((v) => v?.region);
  //   setSelectedRegions((prev) => [...prev, ...previousRegions]);
  // }, [previousTreatments]);

  const handleGetRegionDetails = async (region: string, e: any) => {
    handleClick(e);
    setSelectedRegion(region);
    return await getOdontogramDetails(patientOdontogram?.id).then(
      ({ data }) => {
        let actualTooth = data?.data?.attributes?.tooths[region];
        setToothDetails(actualTooth);
      },
      (err) => console.log(err)
    );
  };

  const openAddTreatmentModal = async () => {
    setAddTreatmentVisible(true);
    // handleClose();
  };

  //   const hasSelected = (t: string) => {
  //     const findRegion = selectedRegions.find((v) => v === t);
  //     if (!findRegion) return "primary";
  //     else return "warning";
  //   };

  const renderRegions = (tooths: string[]) => {
    return tooths.map((v, i) => (
      <Button
        key={i}
        variant="contained"
        onClick={(e) => handleGetRegionDetails(v, e)}
        sx={{ ...buttonStyle }}
      >
        {v}
      </Button>
    ));
  };

  const handleConfirmDelete = (i: number) => {};

  const handleDeleteRegion = async (i: number) => {
    let odontogram = { ...patientOdontogram };
    let { attributes } = odontogram;
    let { tooths } = attributes;

    let clone = tooths[selectedRegion!];
    let filter = clone.filter((v: any, index: number) => index !== i);
    tooths[selectedRegion!] = filter;

    return await onSaveTreatments(tooths, patientOdontogram?.id);
  };

  const handleSubmit = async () => {
    if (selectedRegion === null) return;

    let newDate = formatISO(new Date()).substring(0, 19);
    let { name, price }: any = treatmentToAdd;
    let toothData: ToothsInterface = {
      name,
      price,
      obs: "",
      finishedAt: null,
      finishedBy: null,
      hasAbsent: null,
      hasFinished: null,
      hasPayed: null,
      createdAt: newDate,
    };

    let data = { ...patientOdontogram };

    let { attributes } = data;
    let { tooths } = attributes;

    if (tooths[selectedRegion!].length > 0) {
      let olds = tooths[selectedRegion!];
      let newData = [...olds, toothData];
      tooths[selectedRegion!] = newData;
    } else {
      tooths[selectedRegion!] = [toothData];
    }

    return await onSaveTreatments(tooths, patientOdontogram?.id);
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

  useEffect(() => {
    getTreatments();
  }, []);

  return (
    <Container>
      <CModal
        visible={addTreatmentVisible}
        closeModal={() => setAddTreatmentVisible(false)}
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

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        elevation={12}
      >
        <Box display="flex" alignItems="center" flexDirection="column" p={2}>
          <Typography variant="subtitle1">
            Histórico do Dente {selectedRegion}
          </Typography>

          <ToothHistoryTable
            data={toothDetails}
            onDelete={(i: number) => handleDeleteRegion(i)}
            messageNothing="Sem Histórico do Dente"
          />
        </Box>

        <Box sx={{ p: 2 }}>
          <Button onClick={openAddTreatmentModal} variant="contained" fullWidth>
            Adicionar Tratamento
          </Button>
        </Box>
      </Menu>

      <TitleOdontogram variant="h5">Odontograma do Paciente</TitleOdontogram>

      <OtherRegions>
        {toothRegions.map((v, i) => (
          <Button
            key={i}
            fullWidth
            variant="contained"
            onClick={(e) => handleGetRegionDetails(v, e)}
          >
            {v}
          </Button>
        ))}
      </OtherRegions>

      <GridColumns>
        <div className="div1">{renderRegions(lt)}</div>
        <div className="div2">{renderRegions(rt)}</div>
        <div className="div3">{renderRegions(lb)}</div>
        <div className="div4">{renderRegions(rb)}</div>
      </GridColumns>
    </Container>
  );
};

const Container = styled(Box)`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 0 auto;
  position: relative;
  overflow-x: auto;
`;

const OtherRegions = styled(Box)`
  width: 100%;
  display: grid;
  padding: 0.5rem 2rem;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, 1fr);
  grid-column-gap: 0.5rem;
  grid-row-gap: 0.5rem;
  margin: 0 auto;
  min-width: 700px;
  max-width: 700px;
`;

const GridColumns = styled(Box)`
  display: grid;
  width: 100%;
  min-height: 380px;
  max-width: 700px;
  min-width: 700px;
  background-image: url("/images/arcada.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  grid-row-gap: 8px;
  position: relative;
  margin: 8px auto;
  .div1 {
    display: flex;
    grid-area: 1 / 1 / 2 / 2;
    position: absolute;
    bottom: 0;
    right: 4px;
  }
  .div2 {
    display: flex;
    grid-area: 1 / 2 / 2 / 3;
    position: absolute;
    bottom: 0px;
    left: 6px;
  }
  .div3 {
    display: flex;
    grid-area: 2 / 1 / 2 /2;
    position: absolute;
    top: 0px;
    right: 4px;
  }
  .div4 {
    display: flex;
    grid-area: 2 / 2 / 3 / 3;
    position: absolute;
    top: 0px;
    left: 6px;
  }
`;

const TitleOdontogram = styled(Typography)`
  text-align: center;
  min-width: 700px;
  max-width: 700px;
  padding: 1rem 0;
  margin: 0 auto;
`;

const TextInput = styled(TextField)`
  border-radius: 4px;
  .MuiAutocomplete-input {
    border: none;
    outline: none;
  }
`;

export default OdontogramPatientDetails;
