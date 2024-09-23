/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { Box, Button, SvgIcon, Typography, styled } from "@mui/material";
import About from "../about";
import Link from "next/link";
import useWindowSize from "@/hooks/useWindowSize";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

interface BannerLandingInterface {
  coverImage: string;
  title?: string;
  callText?: string;
  callButton?: any;
}

export const WHATSAPP_CEMIC = "556192156775";

const BannerLanding = (props: BannerLandingInterface) => {
  const size = useWindowSize();
  const msg = `Olá!! Gostaria de saber mais sobre a CEMIC.`;
  const zapHref = `https://api.whatsapp.com/send?phone=${WHATSAPP_CEMIC}&text=${encodeURIComponent(
    msg
  )}`;

  const Container = styled(Box)`
    position: relative;
    background-image: ${props.coverImage && `url(${props.coverImage})`};
    background-size: 100% 100%;
    background-repeat: no-repeat;
    min-height: 100vh;
  `;

  const renderImageBanner = () => (
    <Container>
      <BannerContainer>
        <Informations>
          <Box
            display="flex"
            flexDirection="column"
            alignItems={"flex-start"}
            zIndex={100}
          >
            <TitleText variant="h2" textAlign={"left"}>
              O maior projeto <span>Social</span>
            </TitleText>

            <SubText
              variant="subtitle1"
              my={4}
              color="white"
              fontWeight={"bold"}
            >
              A CEMIC trabalha com a reabilitação oral de diversos pacientes.
              Por meio de seu projeto social, a CEMIC devolveu mais de 15 mil
              sorrisos para diversos paciente, e também pode devolver a você!
            </SubText>

            {/* <Button
              variant="contained"
              onClick={() => window.open(zapHref)}
              startIcon={<WhatsAppIcon />}
              sx={{
                px: 10,
                py: 0.5,
                fontSize: "1rem",
                borderRadius: 7,
                backgroundColor: "var(--dark-blue)",
              }}
            >
              Saber mais
            </Button> */}
          </Box>
        </Informations>
      </BannerContainer>

      <ArrowDownwardIcon
        sx={{ color: "var(--dark-blue)", position: "absolute", bottom: "42px" }}
      />
    </Container>
  );

  return (
    <Box mb={2}>
      <section>{renderImageBanner()}</section>
    </Box>
  );
};

const BannerContainer = styled(Box)`
  width: 100%;
  padding: 5rem;

  /* @media screen and (max-width: 900px) {
    height: auto;
  } */
`;

const Informations = styled(Box)`
  display: flex;
  padding: 4rem 2rem 2rem 2rem;
  height: 100%;
  align-items: center;
  justify-content: space-between;

  @media screen and (max-width: 760px) {
    justify-content: center;
    flex-direction: column;
  }
`;

const SubText = styled(Typography)`
  max-width: 45%;
  text-align: left;
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
  font-family: "Quicksand", sans-serif;
  max-width: 60%;
  font-size: 3rem;
  line-height: 4rem;
  font-weight: normal;
  color: white;
  span {
    font-family: "Quicksand", sans-serif;
    font-weight: bold;
    color: var(--dark-blue);
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

export default BannerLanding;
