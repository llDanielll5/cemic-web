/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { Box, Button, SvgIcon, Typography, styled } from "@mui/material";
import About from "../about";
import Link from "next/link";
import useWindowSize from "@/hooks/useWindowSize";

const BannerLanding = (props: { setTabIndex: any; aboutRef: any }) => {
  const size = useWindowSize();
  const msg = `Olá!! Gostaria de saber mais sobre a CEMIC.`;
  const zapHref = `https://api.whatsapp.com/send?phone=5561986573056&text=${encodeURIComponent(
    msg
  )}`;
  const renderImageBanner = () => (
    <Box position="relative">
      <BannerContainer>
        <Informations>
          <Box display="flex" flexDirection="column" alignItems={"flex-start"}>
            <TitleText variant="h2">
              O maior projeto <span>Social</span>
            </TitleText>

            <SubText variant="subtitle1" my={2}>
              A CEMIC trabalha com a reabilitação oral de diversos pacientes por
              meio de seu projeto para atendimentos de implantes dentários
              Devolveu mais de 15 mil sorrisos para diversos paciente, e também
              pode devolver a você! Para ter mais informações e saber como
              participar, clique em saiba mais e fale com nossa equipe.
            </SubText>

            <StyledButton
              variant="contained"
              onClick={() => window.open(zapHref)}
            >
              Saber mais
            </StyledButton>
          </Box>
        </Informations>
      </BannerContainer>

      {size?.width! < 900 && <ImageBannerMobile />}

      <ArrowDownContainer>
        <Typography variant="subtitle1">Arraste para baixo...</Typography>
        <Link href={"#about"}>
          <IconDown fontSize="large">
            <ArrowDownwardIcon sx={{ color: "white" }} />
          </IconDown>
        </Link>
      </ArrowDownContainer>

      <About ref={props.aboutRef} />
    </Box>
  );

  return (
    <Box mb={2}>
      <section>{renderImageBanner()}</section>
    </Box>
  );
};

const BannerContainer = styled(Box)`
  width: 100%;
  padding-top: 1rem;
  background-color: white;
  @media screen and (max-width: 900px) {
    height: auto;
  }
`;

const Informations = styled(Box)`
  display: flex;
  padding: 32px;
  align-items: center;
  justify-content: space-between;
  position: absolute;
  top: -400px;
  height: 400px;
  z-index: 3;

  @media screen and (max-width: 760px) {
    justify-content: center;
    flex-direction: column;
  }
`;
const ArrowDownContainer = styled(Box)`
  width: 100%;
  height: 50px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 0.5rem;
`;
const IconDown = styled(SvgIcon)`
  background-color: var(--dark-blue);
  border-radius: 50%;
  cursor: pointer;
  transition: 0.3s;
  :hover {
    opacity: 0.8;
  }
`;
const SubText = styled(Typography)`
  max-width: 45%;
  @media screen and (max-width: 900px) {
    max-width: 100%;
  }
  @media screen and (max-width: 500px) {
    font-size: 0.9rem;
  }
  @media screen and (max-width: 350px) {
    font-size: 0.6rem;
  }
`;
const TitleText = styled(Typography)`
  max-width: 60%;
  font-size: 3rem;
  line-height: 4rem;
  span {
    background-color: var(--blue);
    color: white;
    padding: 5px;
    border-radius: 20px;
  }
  @media screen and (max-width: 900px) {
    max-width: 100%;
    font-size: 3rem;
  }
  @media screen and (max-width: 600px) {
    font-size: 2rem;
  }
`;
const StyledButton = styled(Button)`
  width: fit-content;
  height: 4rem;
  border-radius: 1;
  margin-top: 2;
  font-size: 1.2rem;
  @media screen and (max-width: 900px) {
    font-size: 0.9rem;
    height: 3rem;
  }
  @media screen and (max-width: 600px) {
    font-size: 0.6rem;
    height: 2rem;
  }
`;

const ImageBannerMobile = styled("div")`
  background-image: url("/images/clients7.jpg");
  background-repeat: no-repeat;
  background-size: cover;
  margin-top: -3rem;
  width: 100%;
  height: 10rem;
  @media screen and (max-width: 400px) {
    display: none;
  }
`;

export default BannerLanding;
