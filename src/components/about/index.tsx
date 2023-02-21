import React from "react";
import styles from "../../styles/Landing.module.css";
import { GoOrganization } from "react-icons/go";
import { IoMdBusiness } from "react-icons/io";
import { FaCoins } from "react-icons/fa";

const About = () => {
  return (
    <section className={styles.about} id={"about"}>
      <h3>O que é a CEMIC?</h3>

      <div className={styles["about-container"]}>
        <IoMdBusiness className={styles["about-icon"]} />
        <p>
          {"  "}A CEMIC é uma ONG que atua na reabilitação oral a quase 10 anos,
          por meio de um dos maiores projetos sociais do Brasil com Implantes
          Dentários ou Próteses dentárias. <br /> A CEMIC foi fundada em 2015
          com o objetivo de diminuir o grande número de pessoas desdentadas no
          país, que segundo o IBGE 2020 temos mais de 34 milhões de brasileiros
          desdentados.
        </p>
      </div>
      <div className={styles["about-container"]}>
        <GoOrganization className={styles["about-icon"]} />
        <p>
          A CEMIC por meio de dentistas parceiros e na sua clínica própria já
          realizou mais de 15 mil atendimentos, devolvendo o sorriso, alegria e
          auto-estima dessas pessoas.
        </p>
      </div>
      <div className={styles["about-container"]}>
        <FaCoins className={styles["about-icon"]} />
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
