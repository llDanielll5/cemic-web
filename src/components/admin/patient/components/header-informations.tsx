//@ts-nocheck
import React from "react";
import { Box, TextField, Typography, styled } from "@mui/material";
import { useRecoilState, useRecoilValue } from "recoil";
import UserData from "@/atoms/userData";
import PatientData from "@/atoms/patient";
import { parseDateIso, phoneMask } from "@/services/services";
import HeaderTopPatientInformations from "./header-top-informations";

interface HeaderPatientInterface {
  clientData: any;
}

const HeaderPatientInformations = (props: HeaderPatientInterface) => {
  const { clientData } = props;

  const adminData: any = useRecoilValue(UserData);
  const [patientData, setPatientData] = useRecoilState(PatientData);
  let client = patientData?.attributes;

  return (
    <Container>
      <HeaderTopPatientInformations patient={clientData} />
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

const Container = styled(Box)`
  display: flex;
  flex-direction: column;
`;

export default HeaderPatientInformations;
