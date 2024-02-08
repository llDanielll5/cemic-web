//@ts-nocheck
import React from "react";
import { Box, TextField, Typography, styled } from "@mui/material";
import { useRecoilState, useRecoilValue } from "recoil";
import UserData from "@/atoms/userData";
import PatientData from "@/atoms/patient";
import { parseDateIso } from "@/services/services";

interface HeaderPatientInterface {
  clientData: any;
  handleChange: any;
}

const HeaderPatientInformations = (props: HeaderPatientInterface) => {
  const { clientData, handleChange } = props;

  const adminData: any = useRecoilValue(UserData);
  const [patientData, setPatientData] = useRecoilState(PatientData);
  let client = patientData?.attributes;

  return (
    <Container>
      <Double>
        <TextField
          value={clientData?.name}
          label="Paciente"
          margin="dense"
          placeholder="Nome do Paciente"
          InputLabelProps={{ shrink: true }}
          onChange={(e) => handleChange(e.target.value, "name")}
          fullWidth
        />
      </Double>
      <TextField
        label="Email"
        margin="dense"
        value={clientData?.email}
        placeholder="Email do Paciente"
        InputLabelProps={{ shrink: true }}
        fullWidth
        onChange={(e) => handleChange(e.target.value, "email")}
      />

      <Box
        columnGap={1}
        display="flex"
        justifyContent={
          !client?.adminInfos?.updated ? "flex-end" : "space-between"
        }
        alignItems="center"
      >
        {client?.adminInfos !== null && (
          <Typography variant="caption">
            Atualizado por {client?.adminInfos?.updated?.data?.attributes?.name}{" "}
            dia{" "}
            {parseDateIso(
              client?.adminInfos?.updateTimestamp?.substring?.(0, 10)
            )}
          </Typography>
        )}
      </Box>
    </Container>
  );
};

const Double = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  column-gap: 12px;
`;

const Container = styled(Box)`
  display: flex;
  flex-direction: column;
`;

export default HeaderPatientInformations;
