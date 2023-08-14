import React from "react";
import { Box, Typography, Autocomplete } from "@mui/material";
import { StyledTextField } from "@/components/patient/profile";
import { StyledButton } from "../receipts";

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
      <Typography variant="bold" mb={1} textAlign="center">
        Preencha as informações do paciente
      </Typography>

      <StyledTextField
        margin="dense"
        sx={{ width: "100%" }}
        label="Nome Completo do Paciente*"
        value={patientValues.name}
        onChange={(e) =>
          setPatientValues((prev: any) => ({ ...prev, name: e.target.value }))
        }
      />
      <StyledTextField
        margin="dense"
        sx={{ width: "100%" }}
        label="Telefone do Paciente*"
        value={patientValues.phone}
        inputProps={{ maxLength: 15 }}
        onChange={(e) => handleMasked(e.target.value, "phone")}
      />

      <StyledTextField
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
        <StyledTextField
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
            <StyledTextField
              {...params}
              label="Hora para agendar"
              color="info"
            />
          )}
        />
      </Box>

      <StyledButton onClick={handleSchedule}>Agendar</StyledButton>
    </Box>
  );
};

export default AddPatientLecture;
