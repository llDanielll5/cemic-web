//@ts-nocheck
import React, { useCallback, useEffect, useState } from "react";
import { DashboardLayout } from "@/layouts/dashboard/layout";
import { parseDateBr } from "@/services/services";
import { ResultBox } from "@/components/dynamicAdminBody/lectures/addPatient";
import { getListOfDentists } from "@/axios/admin/dentists";
import { TextCPFCustom } from "@/pages/auth/register";
import { formatISO } from "date-fns";
import { useRecoilValue } from "recoil";
import { useFormik } from "formik";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import CalendarModal from "@/components/modal/calendar";
import "react-calendar/dist/Calendar.css";
import CModal from "@/components/modal";
import * as Yup from "yup";
import axios from "axios";
import IconButton from "@/components/iconButton";
import SearchIcon from "@mui/icons-material/Search";
import ScreeningTable from "@/components/table/screening";
import UserData from "@/atoms/userData";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { handleUpdatePatient } from "@/axios/admin/patients";
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  SvgIcon,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import {
  getDayScreening,
  handleUpdatePatientPresenceOfScreening,
  schedulePatientScreening,
  updateScreeningTreatment,
} from "@/axios/admin/screenings";
import axiosInstance from "@/axios";

const ScreeningsPage = () => {
  const [data, setData] = useState<any | null>(null);
  const [dentists, setDentists] = useState([]);
  const [dateSelected, setDateSelected] = useState(new Date());
  const [patientSearch, setPatientSearch] = useState<string>("");
  const [patientData, setPatientData] = useState<any | null>(null);
  const [calendarVisible, setCalendarVisible] = useState<boolean>(false);
  const [addPatientVisible, setAddPatientVisible] = useState<boolean>(false);
  const [selectedPatient, setSelectedPatient] = useState<any | null>(null);
  const [selectedDentist, setSelectedDentist] = useState<any | null>(null);
  const [treatmentsModal, setTreatmentsModal] = useState<any>({
    visible: false,
    data: [],
  });
  const [editModal, setEditModal] = useState<any>({
    visible: false,
    data: null,
  });
  const userData: any = useRecoilValue(UserData);
  const formik = useFormik({
    initialValues: {
      treatmentPlan: [],
      patient: null,
    },
    validationSchema: Yup.object({
      patient: Yup.number().required("Deve adicionar um paciente"),
    }),
    onSubmit: async (values, helpers) => {
      try {
        //submit() => {}
      } catch (err: any) {
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }
    },
  });

  const handleSchedule = () => {
    if (dateSelected.getDay() === 0 || dateSelected.getDay() === 6)
      return alert("Não é possível agendar final de semana!");
    return setAddPatientVisible(true);
  };
  const handleChangeDate = (e: any) => {
    setDateSelected(e);
    setCalendarVisible(false);
    return;
  };
  const resetPatient = () => {
    setSelectedPatient(null);
    setSelectedDentist(null);
    setAddPatientVisible(false);
    setPatientSearch("");
    setPatientData(null);
  };
  const closeAddPatient = () => {
    setAddPatientVisible(false);
    resetPatient();
    formik.resetForm();
  };

  const getDentists = async () => {
    return await getListOfDentists().then(
      (res) => setDentists(res.data),
      (error) => console.log(error.response)
    );
  };

  // async function handleGetPatient() {
  //   if (patientSearch === "") return;
  //   let cpf = patientSearch.replaceAll(".", "").replace("-", "");
  //   return await handleGetPatientByCPF(cpf).then(
  //     (res) => setPatientData(res.data.data[0]),
  //     (err) => console.log(err.response)
  //   );
  // }

  async function handleSelectPatient() {
    if (selectedPatient !== null) return setSelectedPatient(null);
    setSelectedPatient(patientData?.id);
  }

  async function handleFinishSchedule() {
    let hasRegisteredErr = "Paciente já possui Triagem cadastrada";
    let data = {
      patient: selectedPatient,
      dentist: selectedDentist?.id,
      dateString: formatISO(dateSelected).substring(0, 10),
    };
    return await schedulePatientScreening(data).then(
      async (res) => {
        alert("Paciente agendado");
        resetPatient();
        await getScheduleds();
        return;
      },
      (error) => {
        if (error.response.data.error.message === hasRegisteredErr)
          return alert(hasRegisteredErr);
        console.log(error.response);
      }
    );
  }

  const getScheduleds = useCallback(async () => {
    return await getDayScreening(dateSelected).then(
      (res) => setData(res.data.data),
      (error) => console.log(error.response)
    );
  }, [dateSelected]);

  async function handleDeleteScreening(id: string) {
    return await axiosInstance
      .delete(`${process.env.DEV_SERVER_URL}/screenings/${id}`)
      .then(
        (res) => getScheduleds(),
        (err) => console.log(err.response)
      );
  }
  async function handleEditScreening(id: any) {
    return await axiosInstance
      .get(
        `${process.env.DEV_SERVER_URL}/screenings/${id}?populate[patient]=*&populate[dentist]=*&populate[treatmentPlan]=*`
      )
      .then(
        (res) => setEditModal({ visible: true, data: res.data.data }),
        (err) => console.log(err.response)
      );
  }
  async function handleUpdatePatientPresence(isMissed: boolean) {
    return await handleUpdatePatientPresenceOfScreening(
      isMissed,
      editModal?.data?.id
    ).then(
      (res) => {
        handleCloseEditScreening();
        getScheduleds();
      },
      (err) => console.log(err.response)
    );
  }
  async function handleCloseEditScreening() {
    return setEditModal({ visible: false, data: null });
  }
  async function handleSeeTreatments(e: any) {
    if (treatmentsModal.visible)
      return setTreatmentsModal({ visible: false, data: [] });
    setTreatmentsModal({ visible: true, data: e });
  }

  async function handleSaveTreatments(data: any) {
    let patient = editModal?.data?.attributes?.patient?.data?.id;
    let screening = editModal?.data?.id;
    let treatments = data;

    let screeningData = { data: { treatmentPlan: treatments } };
    let treatmentsData = { data: { treatments: { all: treatments } } };
    await updateScreeningTreatment(screening, screeningData);
    return await handleUpdatePatient(patient, treatmentsData).then(
      (res) => {
        handleCloseEditScreening();
        getScheduleds();
      },
      (err) => console.log(err.response)
    );
  }

  useEffect(() => {
    getDentists();
  }, []);

  useEffect(() => {
    getScheduleds();
  }, [getScheduleds]);

  return (
    <Container>
      <CalendarModal
        closeModal={() => setCalendarVisible(false)}
        dateSelected={dateSelected}
        handleChangeDate={handleChangeDate}
        visible={calendarVisible}
      />

      <CModal
        visible={treatmentsModal.visible}
        closeModal={handleSeeTreatments}
      >
        <Box display="flex" flexDirection="column" rowGap={2}>
          <Typography variant="subtitle1">
            Tratamentos Decididos da Triagem
          </Typography>

          {treatmentsModal.data.length !== 0 &&
            treatmentsModal.data?.map((v: any, i: number) => (
              <Box display="flex" key={i}>
                <Typography variant="subtitle2">{`Região: ${v?.region} - ${v?.treatment?.name}`}</Typography>
              </Box>
            ))}
        </Box>
      </CModal>

      <CModal
        visible={editModal.visible}
        closeModal={handleCloseEditScreening}
        styles={{ height: "90vh", overflow: "auto" }}
      >
        {editModal.data !== null && (
          <Box display="flex" flexDirection="column" rowGap={2}>
            <Typography variant="subtitle1" textAlign="center">
              Editar Triagem de{" "}
              {editModal.data?.attributes?.patient?.data?.attributes?.name}
            </Typography>

            {userData?.userType === "ADMIN" ||
            userData?.userType === "DENTIST" ? (
              <Box display="flex" alignItems={"center"} justifyContent="center">
                <Typography variant="subtitle1" textAlign="center">
                  {editModal?.data?.attributes?.isMissed === null
                    ? "Paciente compareceu a triagem?"
                    : editModal?.data?.attributes?.isMissed
                    ? "Paciente Faltou"
                    : "Paciente Compareceu"}
                </Typography>

                {editModal?.data?.attributes?.isMissed === null && (
                  <IconButton
                    iconSize="medium"
                    tooltip="Paciente Compareceu"
                    onClick={() => handleUpdatePatientPresence(false)}
                  >
                    <CheckCircleIcon color="success" />
                  </IconButton>
                )}

                {editModal?.data?.attributes?.isMissed === null && (
                  <IconButton
                    iconSize="medium"
                    tooltip="Paciente Faltou"
                    onClick={() => handleUpdatePatientPresence(true)}
                  >
                    <CancelIcon color="error" />
                  </IconButton>
                )}
              </Box>
            ) : null}

            {/* <TreatmentPlanUpdate
              onSaveTreatments={handleSaveTreatments}
              previousTreatments={editModal.data?.attributes?.treatmentPlan}
              setVisible={handleCloseEditScreening}
            /> */}
          </Box>
        )}
      </CModal>

      <CModal visible={addPatientVisible} closeModal={closeAddPatient}>
        <form noValidate onSubmit={formik.handleSubmit}>
          <Box display="flex" alignItems="center" flexDirection="column">
            <Typography variant="h5" mb={1} textAlign="center">
              Preencha as informações do paciente
            </Typography>

            <Typography variant="h6" mb={1} textAlign="center">
              Data de Agendamento {dateSelected.toLocaleDateString("pt-br")}
            </Typography>

            <Box width="100%" display="flex" flexDirection="row">
              <TextField
                margin="dense"
                sx={{ width: "100%" }}
                label="CPF do Paciente*"
                InputProps={{ inputComponent: TextCPFCustom as any }}
                inputProps={{ maxLength: 14 }}
                value={patientSearch}
                fullWidth
                onChange={(e) => setPatientSearch(e.target.value)}
                onKeyDown={({ key }) => {
                  // if (key === "Enter") return handleGetPatient();
                }}
              />
              <IconButton
                iconSize="large"
                tooltip="Buscar Paciente"
                // onClick={handleGetPatient}
              >
                <SearchIcon />
              </IconButton>
            </Box>

            {patientData !== null && patientData !== undefined && (
              <ResultBox onClick={handleSelectPatient}>
                <Typography variant="subtitle1">
                  {patientData?.attributes?.name}
                </Typography>
                <Checkbox checked={selectedPatient !== null} />
              </ResultBox>
            )}
            {patientData === undefined && (
              <Typography variant="h6" color="red" my={2}>
                Paciente não encontrado!
              </Typography>
            )}

            <Box
              display="flex"
              justifyContent={"space-between"}
              columnGap={1}
              width="100%"
              m={1}
            >
              <Autocomplete
                disablePortal
                id="dentist"
                sx={{ width: "100%" }}
                options={dentists}
                value={selectedDentist}
                onChange={(e, v) => setSelectedDentist(v)}
                isOptionEqualToValue={(opt: any, val: any) =>
                  opt.name === val.name
                }
                getOptionLabel={(option: any) => option.name}
                renderInput={(params: any) => (
                  <TextField {...params} label="Dentista" color="info" />
                )}
              />
            </Box>

            <Button
              endIcon={
                <SvgIcon fontSize="small">
                  <CalendarMonthIcon />
                </SvgIcon>
              }
              variant="contained"
              onClick={handleFinishSchedule}
            >
              Agendar
            </Button>
          </Box>
        </form>
      </CModal>

      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        width="100%"
        mt={2}
        sx={{ backgroundColor: "white" }}
      >
        <Typography variant="h5" fontSize="18px">
          {parseDateBr(dateSelected.toLocaleDateString())}
        </Typography>
      </Box>

      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-around"
        my={2}
      >
        <Button
          endIcon={<PersonAddAlt1Icon />}
          sx={{ borderRadius: "4px" }}
          onClick={handleSchedule}
          variant="contained"
        >
          Agendar Paciente
        </Button>

        <Button
          endIcon={<CalendarMonthIcon />}
          sx={{ borderRadius: "4px" }}
          onClick={() => setCalendarVisible(true)}
          variant="contained"
        >
          Selecionar Data
        </Button>
      </Box>

      {data !== null && (
        <Box p={2}>
          <ScreeningTable
            data={data}
            onDelete={handleDeleteScreening}
            onEdit={handleEditScreening}
            onSeeTreatments={handleSeeTreatments}
            messageNothing="Não há pacientes agendados para este dia!"
          />
        </Box>
      )}
    </Container>
  );
};

const Container = styled(Box)``;

ScreeningsPage.getLayout = (page: any) => (
  <DashboardLayout>{page}</DashboardLayout>
);

export default ScreeningsPage;
