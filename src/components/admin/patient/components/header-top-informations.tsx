import React from "react";
import ptBR from "date-fns/locale/pt-BR";
import useWindowSize from "@/hooks/useWindowSize";
import { Box, Typography, styled } from "@mui/material";
import { parseDateIso, phoneMask } from "@/services/services";
import { addDays, formatDistance } from "date-fns";

const HeaderTopPatientInformations = (props: { patient?: any }) => {
  const { patient } = props;
  const { width } = useWindowSize();
  let dateBornDate = new Date(patient?.dateBorn);

  console.log(dateBornDate);

  return (
    <Container>
      <Box>
        <Typography variant="subtitle1">
          <b>Paciente:</b> {patient?.name}
        </Typography>
        {width! >= 760 && (
          <Typography variant="subtitle1">
            <b>Telefone:</b> {phoneMask(patient?.phone)}
          </Typography>
        )}
      </Box>
      <Box>
        <Typography variant="subtitle1">
          <b>Email:</b> {patient?.email}
        </Typography>
        {width! >= 760 && (
          <Typography variant="subtitle1">
            <b>Data Nasc:</b> {parseDateIso(patient?.dateBorn)} (
            {formatDistance(addDays(dateBornDate, 1), new Date(), {
              locale: ptBR,
            })}
            )
          </Typography>
        )}
      </Box>
    </Container>
  );
};

const Container = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 0;
  @media screen and (max-width: 760px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export default HeaderTopPatientInformations;
