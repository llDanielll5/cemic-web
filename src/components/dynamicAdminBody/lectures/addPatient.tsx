import React from "react";
import {
  Box,
  Typography,
  Autocomplete,
  TextField,
  Button,
  SvgIcon,
} from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

interface AddPatientLectureProps {
  patientValues: any;
  setPatientValues: any;
  handleSchedule: any;
}

const AddPatientLecture = (props: AddPatientLectureProps) => {
  const { patientValues, setPatientValues, handleSchedule } = props;

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

  return (
    <Box display="flex" alignItems="center" flexDirection="column">
      <Typography variant="h5" mb={1} textAlign="center">
        Preencha as informações do paciente
      </Typography>

      <TextField
        margin="dense"
        sx={{ width: "100%" }}
        label="Nome Completo do Paciente*"
        value={patientValues.name}
        onChange={(e) =>
          setPatientValues((prev: any) => ({ ...prev, name: e.target.value }))
        }
      />
      <TextField
        margin="dense"
        sx={{ width: "100%" }}
        label="Telefone do Paciente*"
        value={patientValues.phone}
        inputProps={{ maxLength: 15 }}
        onChange={(e) => handleMasked(e.target.value, "phone")}
      />

      <TextField
        margin="dense"
        sx={{ width: "100%" }}
        label="CPF do Paciente*"
        value={patientValues.cpf}
        inputProps={{ maxLength: 14 }}
        onChange={(e) => handleMasked(e.target.value, "cpf")}
      />

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

export default AddPatientLecture;
