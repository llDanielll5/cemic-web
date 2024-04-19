import { Box, Typography, styled } from "@mui/material";
import React from "react";
import { WhiteToothIcon } from "../about/about-item";
import useWindowSize from "@/hooks/useWindowSize";

// import { Container } from './styles';

const PartnersLanding = () => {
  const { width } = useWindowSize();
  const iconWidth = {
    fontSize: `${width! > 760 ? width! / 14 : width! / 8}px`,
  };
  const arrLength = width! > 760 ? 15 : 10;
  let arrTooths = Array(arrLength);

  for (let i = 0; i < arrTooths.length; i++) {
    arrTooths[i] = "tooth";
  }

  if (arrTooths.length === 0) return;

  return (
    <Container>
      <ToothsTopContainer>
        {arrTooths?.map((item, index) => (
          <DownTooth sx={{ ...iconWidth, color: "white" }} key={index} />
        ))}
      </ToothsTopContainer>

      <Typography variant="h3" mb={"24px"} color="white">
        Parceiros
      </Typography>

      <MiniText color="white">
        A CEMIC por meio de dentistas parceiros e na sua clínica própria já
        realizou mais de 15 mil atendimentos, devolvendo o sorriso, alegria e
        auto-estima dessas pessoas. Devido o governo local ou federal não
        possuir projetos de reabilitação com implantes dentários e o alto custo
        do tratamento em clínicas particulares, cada vez mais, aumentam as
        estatísticas de pessoas desdentadas, principalmente as mais carentes,
        fazendo assim com que seja muito importante o trabalho das ONGs e
        escolas de pós-graduação no país.
      </MiniText>

      <ToothsBottomContainer>
        {arrTooths?.map((item, index) => (
          <WhiteToothIcon sx={{ ...iconWidth, color: "white" }} key={index} />
        ))}
      </ToothsBottomContainer>
    </Container>
  );
};

const Container = styled(Box)`
  background-color: var(--dark-blue);
  padding: 10rem 4rem;
  width: 100%;
  position: relative;
  margin-top: 2rem;
`;

const ToothsTopContainer = styled(Box)`
  position: absolute;
  top: -32px;
  left: -65px;
  display: flex;
`;
const ToothsBottomContainer = styled(Box)`
  position: absolute;
  bottom: -32px;
  left: -65px;
  display: flex;
`;
const MiniText = styled(Typography)`
  width: 50%;

  @media screen and (max-width: 760px) {
    width: 100%;
  }
`;

const DownTooth = styled(WhiteToothIcon)`
  transform: scaleY(-1);
`;

export default PartnersLanding;
