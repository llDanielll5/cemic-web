import React, { useState } from "react";
import AlertModal from "@/components/modal/alert-modal";
import ToothHistoryTable from "@/components/table/toothHistory";
import AddPatientTreatmentModal from "../modals/add-treatments";
import { formatISO } from "date-fns";
import { dentalArch } from "data";
import {
  getRegionDetails,
  handleDeletePatientTreatmentById,
  handleGetHistoryPatientTreatmentById,
  updatePatientTreatments,
} from "@/axios/admin/patient-treatments";
import {
  Box,
  Typography,
  styled,
  Button,
  TextField,
  Menu,
  Autocomplete,
} from "@mui/material";
import PatientData from "@/atoms/patient";
import UserData from "@/atoms/userData";
import { toast } from "react-toastify";
import { useRecoilValue } from "recoil";
import { updateOdontogramDetails } from "@/axios/admin/odontogram";
import { AdminHistoryOfDay, AdminInfosInterface } from "types/admin";

interface OdontogramPatientDetailsInterface {
  patientOdontogram: any;
  onUpdatePatient: any;
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
  "Total",
];

const OdontogramPatientDetails = (props: OdontogramPatientDetailsInterface) => {
  const { patientOdontogram, onUpdatePatient } = props;
  const { lb, lt, rb, rt } = dentalArch;
  const adminData: any = useRecoilValue(UserData);
  const patientData = useRecoilValue(PatientData);
  const [toothDetails, setToothDetails] = useState<any>([]);
  const [addTreatmentVisible, setAddTreatmentVisible] = useState(false);
  const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);
  const [deleteTreatmentId, setDeleteTreatmentId] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [toothSingleTreatment, setToothSingleTreatment] = useState<any | null>(
    null
  );

  // Tooth Menu #
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) =>
    setAnchorEl(event.currentTarget);
  const handleClose = () => {
    setSelectedRegion(null);
    setAnchorEl(null);
  };
  /* End Tooth Menu */

  const handleGetRegionDetails = async (region: string, e: any) => {
    handleClick(e);
    let rg = "";
    if (
      region === "Superior Total" ||
      region === "Sup. Dir." ||
      region === "Sup. Esq." ||
      region === "Inferior Total" ||
      region === "Inf. Dir." ||
      region === "Inf. Esq." ||
      region === "Total"
    ) {
      rg = region.replaceAll(".", "").replaceAll(" ", "_").toLowerCase();
    } else {
      rg = `t${region}`;
    }
    setSelectedRegion(region);
    return await getRegionDetails(patientData?.id!, rg).then(
      ({ data }: any) => {
        if (data?.data.length === 0) {
          setToothDetails([]);
        } else {
          let tRegion = data?.data;
          let filterRegion = tRegion.filter(
            (v: any) => v.attributes.region === rg
          );
          setToothDetails(filterRegion);
        }
      },
      (err) => console.log(err)
    );
  };

  const openAddTreatmentModal = async () => setAddTreatmentVisible(true);
  const handleCloseAddTreatment = () => setAddTreatmentVisible(false);

  const getToothSingleDetailsTreatment = (id: any) => {
    let filter = toothDetails.find((v: any) => v.id === id);
    setToothSingleTreatment(filter);
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

  const handleConfirmDelete = async () => {
    let treatmentDetails = await handleGetHistoryPatientTreatmentById(
      deleteTreatmentId
    );

    if (treatmentDetails?.data?.data?.attributes?.payment?.data !== null) {
      return toast.error("Não é possível excluir trabalho pago!");
    }

    return await handleDeletePatientTreatmentById(deleteTreatmentId).then(
      (res) => {
        setDeleteTreatmentId("");
        setConfirmDeleteModal(false);
        handleClose();
        onUpdatePatient();
        toast.success("Tratamento deletado com sucesso!");
      },
      (err) => console.log(err.response)
    );
  };

  const handleDeleteTreatment = (id: string) => {
    setConfirmDeleteModal(true);
    setDeleteTreatmentId(id);
  };

  const handleSubmitTreatment = async (
    data: {
      newTreatment: PatientTreatmentInterface;
      treatments: PatientTreatmentInterface[];
      region: string;
    },
    odontogramId: any
  ) => {
    const { treatments, newTreatment } = data;

    let newDate = formatISO(new Date()).substring(0, 10);
    let history: AdminHistoryOfDay = {};
    let oldHistories: AdminHistoryOfDay =
      patientOdontogram?.attributes?.adminInfos?.history;

    history = {
      ...(oldHistories ?? {}),
      [newDate]: {
        date: formatISO(new Date()).substring(0, 19),
        admin: {
          name: adminData?.name,
          id: adminData?.id,
          role: adminData?.userType,
        },
        updates: [...(treatments ?? []), newTreatment],
      },
    };

    const dataUpdate = { data: newTreatment };
    let adminInfos: Partial<AdminInfosInterface> = {
      updated: adminData?.id,
      updateTimestamp: new Date(),
      history,
    };

    try {
      Promise.all([
        await updatePatientTreatments(dataUpdate),
        await updateOdontogramDetails(odontogramId, adminInfos),
      ]);

      onUpdatePatient();
      handleCloseAddTreatment();
      handleClose();
      return toast.success("Tratamento atualizado!");
    } catch (error: any) {
      console.log({ error: error.response ?? error });
      return toast.error("Erro ao criar tratamento do paciente!");
    }
  };

  return (
    <Container>
      <AlertModal
        open={confirmDeleteModal}
        onClose={() => setConfirmDeleteModal(false)}
        title={`Deseja realmente excluir o tratamento do paciente de ID: ${deleteTreatmentId}`}
        onAccept={handleConfirmDelete}
        onRefuse={() => setConfirmDeleteModal(false)}
        content={<></>}
      />

      <AddPatientTreatmentModal
        closeModal={handleCloseAddTreatment}
        onSaveTreatments={handleSubmitTreatment}
        patientOdontogram={patientOdontogram}
        selectedRegion={selectedRegion}
        visible={addTreatmentVisible}
      />

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
            onDelete={(id: string) => handleDeleteTreatment(id)}
            messageNothing="Sem Histórico do Dente"
            onGetDetails={getToothSingleDetailsTreatment}
          />
        </Box>

        <Box sx={{ p: 2 }}>
          <Button onClick={openAddTreatmentModal} variant="contained" fullWidth>
            Adicionar Tratamento
          </Button>
        </Box>
      </Menu>

      <TitleOdontogram variant="h5">Odontograma do Paciente</TitleOdontogram>

      <GridColumns>
        <div className="div1">{renderRegions(lt)}</div>
        <div className="div2">{renderRegions(rt)}</div>
        <div className="div3">{renderRegions(lb)}</div>
        <div className="div4">{renderRegions(rb)}</div>
      </GridColumns>

      <Autocomplete
        options={toothRegions}
        fullWidth
        onChange={(e, v) => {
          if (v !== null) handleGetRegionDetails(v, e);
        }}
        renderInput={(props) => (
          <TextField
            {...props}
            label="Regiões Extras"
            title="Selecione uma das regiões extras, caso não seja uma das acima"
          />
        )}
      />
    </Container>
  );
};

const Container = styled(Box)`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 0 auto;
  position: relative;
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
