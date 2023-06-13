/* eslint-disable @next/next/no-img-element */
//@ts-nocheck
import React, { useState } from "react";
import { Box, Typography, styled } from "@mui/material";
import styles from "../../styles/Landing.module.css";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("../../services/map"), { ssr: false });

const About = (props: any) => {
  return (
    <section className={styles.about} id={"about"} ref={props.ref}>
      <h1>
        <span>S</span>
        <span>O</span>
        <span>B</span>
        <span>R</span>
        <span>E</span>
        <space></space>
        <span>A</span>
        <space></space>
        <img src="/images/cemicText.png" alt="cemic" />
      </h1>
      <div className={styles["about-container"]}>
        <p>
          {"  "}A CEMIC é uma ONG que atua na reabilitação oral a quase 10 anos,
          por meio de um dos maiores projetos sociais do Brasil com Implantes
          Dentários ou Próteses dentárias. <br />
          <br /> A CEMIC foi fundada em 2015 com o objetivo de diminuir o grande
          número de pessoas desdentadas no país, que segundo o IBGE 2020 temos
          mais de 34 milhões de brasileiros desdentados.
        </p>
      </div>
      <div
        className={styles["about-container"]}
        style={{ flexDirection: "row-reverse" }}
      >
        <p>
          A CEMIC por meio de dentistas parceiros e na sua clínica própria já
          realizou mais de 15 mil atendimentos, devolvendo o sorriso, alegria e
          auto-estima dessas pessoas.
        </p>
      </div>
      <div className={styles["about-container"]}>
        <p>
          Devido o governo local ou federal não possuir projetos de reabilitação
          com implantes dentários e o alto custo do tratamento em clínicas
          particulares, cada vez mais, aumentam as estatísticas de pessoas
          desdentadas, principalmente as mais carentes, fazendo assim com que
          seja muito importante o trabalho das ONGs e escolas de pós-graduação
          no país.
        </p>
      </div>

      <Box>
        <h1>
          <span>E</span>
          <span>N</span>
          <span>D</span>
          <span>E</span>
          <span>R</span>
          <span>E</span>
          <span>Ç</span>
          <span>O</span>
        </h1>

        <Box mb={5} />

        <AddressText variant="bold">
          Conjunto Nacional, Torre Amarela, Sala 5092, 5º Andar, Brasília - DF
        </AddressText>

        <Box my={5}>
          <Map />
        </Box>
      </Box>
    </section>
  );
};

export const AddressText = styled(Typography)`
  font-size: 1.5rem;
  text-align: center;
  width: 100%;
  @media screen and (max-width: 760px) {
    font-size: 14px;
  }
`;

export default About;
