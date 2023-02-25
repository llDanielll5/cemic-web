/* eslint-disable @next/next/no-img-element */
import React from "react";
import styles from "../../styles/Landing.module.css";
import Image1 from "../../../public/images/clients2.jpg";
import Image2 from "../../../public/images/clients3.jpg";
import Image3 from "../../../public/images/clients4.jpg";
import Image from "next/image";

const About = () => {
  return (
    <section className={styles.about} id={"about"}>
      <h3>O que é a CEMIC?</h3>

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
    </section>
  );
};

export default About;
