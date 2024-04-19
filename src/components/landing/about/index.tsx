/* eslint-disable @next/next/no-img-element */
//@ts-nocheck
import React from "react";
import useWindowSize from "@/hooks/useWindowSize";
import AboutItem from "./about-item";
import PartnersLanding from "../partners";
import Help from "../help";
import AddressLanding from "../address";
import { Box, styled } from "@mui/material";

const About = (props: any) => {
  const { width } = useWindowSize();

  return (
    <section id={"about"} ref={props.ref}>
      <AboutContainer>
        <AboutItem
          title="Sobre nós"
          description="A CEMIC é uma ONG que atua na reabilitação oral a quase 10 anos, por meio de um dos maiores projetos sociais do Brasil com Implantes Dentários ou Próteses dentárias."
          imgSrc="/images/v2/smile.png"
          icon="tooth"
        />
        <AboutItem
          title=" "
          description="A CEMIC foi fundada em 2015 com o objetivo de diminuir o grande número de pessoas desdentadas no país, que segundo o IBGE 2020 temos mais de 34 milhões de brasileiros desdentados."
          imgSrc="/images/v2/tooth-model.png"
          icon="bucal"
          isReverse
        />
      </AboutContainer>

      <PartnersLanding />
      <Help />
      <AddressLanding />
    </section>
  );
};
const AboutContainer = styled(Box)`
  position: relative;
`;

export default About;
