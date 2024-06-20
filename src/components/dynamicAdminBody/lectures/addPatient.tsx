import React, { useState } from "react";
import {
  Box,
  Typography,
  Autocomplete,
  TextField,
  Button,
  SvgIcon,
  styled,
  Checkbox,
} from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import IconButton from "@/components/iconButton";
import SearchIcon from "@mui/icons-material/Search";
// import { handleGetPatientByCPF } from "@/axios/admin/patients";
import { schedulePatientLecture } from "@/axios/admin/lectures";
import { useRecoilValue } from "recoil";
import UserData from "@/atoms/userData";

interface AddPatientLectureProps {
  patientValues: any;
  setPatientValues: any;
  onScheduled: any;
}

const AddPatientLecture = (props: AddPatientLectureProps) => {
  const { patientValues, setPatientValues, onScheduled } = props;
  const [data, setData] = useState<any | null>(null);
  const [selectedPatient, setSelectedPatient] = useState(false);
  const userData: any = useRecoilValue(UserData);

  const phoneMask = (value: any) => {
    if (!value) return "";
    value = value.replace(/\D/g, "");
    value = value.replace(/(\d{2})(\d)/, "($1) $2");
    value = value.replace(/(\d)(\d{4})$/, "$1-$2");
    return value;
  };
  const cpfMask = (value: any) => {
    if (!value) return "";
    value = value.replace(/\D/g, "");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    return value;
  };

  const handleMasked = (value: string, type: string) => {
    const masked = type === "cpf" ? cpfMask : phoneMask;
    setPatientValues((prev: any) => ({ ...prev, [type]: masked(value) }));
  };

  // async function handleGetPatient() {
  //   if (patientValues.cpf === "") return;
  //   let cpf = patientValues.cpf.replaceAll(".", "").replace("-", "");
  //   return await handleGetPatientByCPF(cpf).then(
  //     (res) => setData(res.data.data[0]),
  //     (err) => {
  //       console.log(err.response);
  //     }
  //   );
  // }
  async function handleSelectPatient() {
    if (selectedPatient) {
      setSelectedPatient(false);
      setPatientValues((prev: any) => ({ ...prev, participant: null }));
      return;
    }

    setSelectedPatient(true);
    setPatientValues((prev: any) => ({ ...prev, participant: data?.id }));
  }

  const handleSchedule = async () => {
    if (!selectedPatient) return alert("Selecione algum paciente.");
    if (patientValues.date === "") return alert("Adicione uma data");
    if (patientValues.hour !== "11:00" && patientValues.hour !== "17:00")
      return alert("Adicione um horário");

    let data = { ...patientValues, admin: userData?.id };

    // setIsScheduling(true);

    await schedulePatientLecture(data).then(
      async (res) => onScheduled(),
      (err) => {
        if (err.response.data.error.status === 400)
          alert(err.response.data.error.message);
        if (err.response) console.log(err.response);
      }
    );
  };

  return (
    <Box display="flex" alignItems="center" flexDirection="column">
      <Typography variant="h5" mb={1} textAlign="center">
        Preencha as informações do paciente
      </Typography>

      <Box width="100%" display="flex" flexDirection="row">
        <TextField
          margin="dense"
          sx={{ width: "100%" }}
          label="CPF do Paciente*"
          value={patientValues.cpf}
          inputProps={{ maxLength: 14 }}
          onChange={(e) => handleMasked(e.target.value, "cpf")}
          onKeyDown={({ key }) => {
            // if (key === "Enter") return handleGetPatient();
          }}
        />
        <IconButton
          iconSize="large"
          tooltip="Buscar Paciente"
          // onClick={handleGetPatient}
          onClick={() => {}}
        >
          <SearchIcon />
        </IconButton>
      </Box>

      {data !== null && data !== undefined && (
        <ResultBox onClick={handleSelectPatient}>
          <Typography variant="subtitle1">{data?.attributes?.name}</Typography>
          <Checkbox checked={selectedPatient} />
        </ResultBox>
      )}
      {data === undefined && (
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
        <TextField
          type="date"
          sx={{ width: "100%" }}
          label="Data de agendamento"
          InputLabelProps={{ shrink: true }}
          value={patientValues.date}
          onChange={(e) =>
            setPatientValues((prev: any) => ({ ...prev, date: e.target.value }))
          }
        />
        <Autocomplete
          disablePortal
          sx={{ width: "100%" }}
          options={["11:00", "17:00"]}
          value={patientValues.hour}
          onChange={(e, v) =>
            setPatientValues((prev: any) => ({ ...prev, hour: v! }))
          }
          renderInput={(params) => (
            <TextField {...params} label="Hora para agendar" color="info" />
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
        onClick={handleSchedule}
      >
        Agendar
      </Button>
    </Box>
  );
};

export const ResultBox = styled(Box)`
  border-radius: 1rem;
  border: 1px solid #f3f3f3;
  background-color: #f3f3f3;
  padding: 0.3rem 1rem;
  margin: 1rem 0;
  cursor: pointer;
  width: 100%;
  min-width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export default AddPatientLecture;
