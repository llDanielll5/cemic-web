import React, { useCallback, useEffect, useMemo, useState } from "react";
import Modal from "@/components/modal";
import Loading from "@/components/loading";
import CalendarModal from "@/components/modal/calendar";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AddPatientLecture from "@/components/dynamicAdminBody/lectures/addPatient";
import LectureDetails from "@/components/dynamicAdminBody/lectures/lectureDetails";
import { add, formatISO } from "date-fns";
import { parseDateBr } from "@/services/services";
import { DashboardLayout } from "src/layouts/dashboard/layout";
import { getActualLectureDetails } from "@/axios/admin/lectures";
import {
  Box,
  Typography,
  Button,
  Card,
  Stack,
  Container,
  OutlinedInput,
  InputAdornment,
  SvgIcon,
  Autocomplete,
  TextField,
} from "@mui/material";
import { toast } from "react-toastify";
import { useRecoilValue } from "recoil";
import LecturesTable from "@/components/table/lectures-table";
import UserData from "@/atoms/userData";
import MagnifyingGlassIcon from "@heroicons/react/24/solid/MagnifyingGlassIcon";
import "react-calendar/dist/Calendar.css";
import { CEMIC_FILIALS } from "@/utils";

interface PatientInfos {
  participant: string;
  date: string;
  hour: string;
  cpf: string;
}

const tomorrowFns = add(new Date(), { days: 1 });
const defaultPatientValues = {
  participant: "",
  date: tomorrowFns.toISOString().substring(0, 10),
  hour: "11:00",
  cpf: "",
};

const LecturesAdmin = () => {
  const adminData = useRecoilValue(UserData);
  const hasSuperAdmin = adminData?.userType === "SUPERADMIN";
  const [dateSelected, setDateSelected] = useState(new Date());
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [addPatientVisible, setAddPatientVisible] = useState(false);
  const [lectureDetailsVisible, setLectureDetailsVisible] = useState(false);
  const [lectureID, setLectureID] = useState<string | null>(null);
  const [isScheduling, setIsScheduling] = useState<boolean>(false);
  const hasWeekend = dateSelected.getDay() === 0 || dateSelected.getDay() === 6;
  const [lectureData, setLectureData] = useState<
    StrapiData<LecturesInterface>[]
  >([]);
  const [patientValues, setPatientValues] =
    useState<PatientInfos>(defaultPatientValues);
  const [searchPatientValue, setSearchPatientValue] = useState("");
  const searchMemoFilial = useMemo(() => {
    if (!adminData) return "";

    if (hasSuperAdmin) return "";
    return `${adminData?.filial?.toUpperCase()}-${adminData?.location.toUpperCase()}`;
  }, [adminData, hasSuperAdmin]);
  const [searchFilial, setSearchFilial] = useState<string | undefined>(
    searchMemoFilial
  );

  const tableHead = ["Horário", "Paciente", "Compareceu?", "Pegou Exame?"];

  const handleChangeDate = (e: any) => {
    setDateSelected(e);
    setCalendarVisible(false);
    return;
  };

  const handleCloseLectureDetails = () => {
    setLectureDetailsVisible(false);
    setLectureID(null);
    return;
  };

  const handleGetDetails = (item: any) => {
    setLectureID(item?.id);
    setLectureDetailsVisible(true);
    return;
  };

  const closeAddPatient = () => {
    setAddPatientVisible(false);
    setPatientValues(defaultPatientValues);
  };

  const onScheduled = () => {
    closeAddPatient();
    setIsScheduling(false);
    return alert("Sucesso ao agendar sua palestra");
  };

  const handleGetAllLecturesOfDay = useCallback(async () => {
    if (!dateSelected) return;
    let date = formatISO(dateSelected).substring(0, 10);
    const adminFilial = `${adminData?.filial?.toUpperCase()}-${adminData?.location.toUpperCase()}`;

    const filialFilter = () => {
      if (hasSuperAdmin && searchFilial !== "") {
        return searchFilial;
      } else if (!hasSuperAdmin) {
        return adminFilial;
      } else if (hasSuperAdmin && !searchFilial) {
        return ``;
      }
    };

    try {
      const { data } = await getActualLectureDetails(
        date,
        searchPatientValue,
        filialFilter()
      );
      setLectureData(data.data as StrapiData<LecturesInterface>[]);
    } catch (error) {
      console.log({ error });
      toast.error("Erro ao recuperar os agendamentos de Hoje!");
    }
  }, [
    adminData?.filial,
    adminData?.location,
    dateSelected,
    hasSuperAdmin,
    searchFilial,
    searchPatientValue,
  ]);

  useEffect(() => {
    handleGetAllLecturesOfDay();
  }, [handleGetAllLecturesOfDay]);

  return (
    <Stack my={8}>
      {/* MODALS */}
      {isScheduling && (
        <Box position="fixed" zIndex={9999} left={0} top={0}>
          <Loading message="Agendando o paciente..." />
        </Box>
      )}

      <CalendarModal
        closeModal={() => setCalendarVisible(false)}
        dateSelected={dateSelected}
        handleChangeDate={handleChangeDate}
        visible={calendarVisible}
      />

      <Modal
        visible={lectureDetailsVisible}
        closeModal={handleCloseLectureDetails}
      >
        {lectureID !== null && (
          <LectureDetails
            lectureID={lectureID}
            closeModal={handleCloseLectureDetails}
          />
        )}
      </Modal>

      <Modal visible={addPatientVisible} closeModal={closeAddPatient}>
        <AddPatientLecture
          patientValues={patientValues}
          setPatientValues={setPatientValues}
          onScheduled={onScheduled}
        />
      </Modal>
      {/* END MODALS */}

      <Container maxWidth="xl">
        <Stack mb={4}>
          <Typography variant="h4">Palestras</Typography>
        </Stack>
        <Card elevation={10} sx={{ p: 2 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            spacing={2}
            alignItems={"center"}
          >
            <Stack spacing={3} width={"50%"}>
              <Typography variant="h4" fontSize="18px">
                {parseDateBr(dateSelected.toLocaleDateString())}
              </Typography>
            </Stack>

            <Stack width={"50%"} direction={"row"} gap={2} maxHeight={"60px"}>
              <OutlinedInput
                defaultValue=""
                value={searchPatientValue}
                onChange={({ target }) => setSearchPatientValue(target.value)}
                // onKeyDown={props.onKeyDown}
                fullWidth
                placeholder="Buscar paciente por Nome"
                startAdornment={
                  <InputAdornment position="start">
                    <SvgIcon color="action" fontSize="small">
                      <MagnifyingGlassIcon />
                    </SvgIcon>
                  </InputAdornment>
                }
              />
              <Button variant="contained" onClick={() => console.log("")}>
                Buscar
              </Button>
            </Stack>
          </Stack>
          <Stack spacing={3} mt={2}>
            <Button
              endIcon={<CalendarMonthIcon />}
              onClick={() => setCalendarVisible(true)}
              variant="contained"
            >
              Selecionar Data
            </Button>
          </Stack>
        </Card>

        {hasSuperAdmin && (
          <Card elevation={10} sx={{ my: 3, p: 1 }}>
            <Autocomplete
              fullWidth
              value={searchFilial}
              options={CEMIC_FILIALS.map((i) => i.toUpperCase())}
              onChange={(e, v: any) => setSearchFilial(v!)}
              renderInput={(props) => (
                <TextField {...props} label="Alterar Filial" />
              )}
            />
          </Card>
        )}

        <Box p={4}>
          <LecturesTable
            tableData={lectureData}
            tableHeads={
              adminData?.userType === "SUPERADMIN"
                ? [...tableHead, "Localização", "Converter"]
                : [...tableHead, "Converter"]
            }
            onChangeTable={handleGetAllLecturesOfDay}
          />
        </Box>
      </Container>
    </Stack>
  );
};

LecturesAdmin.getLayout = (page: any) => (
  <DashboardLayout>{page}</DashboardLayout>
);

export default LecturesAdmin;
