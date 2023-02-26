/* eslint-disable @next/next/no-img-element */
import React from "react";
import styles from "../../styles/Landing.module.css";

const About = () => {
  return (
    <section className={styles.about} id={"about"}>
      <h3>
        Sobre a
        <span>
          <img src="/images/cemicText.png" alt="cemic" />
        </span>
      </h3>
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
      <div className={styles["help-container"]}>
        <p>
          Se você acha nosso trabalho importante, ajude-nos a multiplicar nossos
          atendimentos. <br />
          <br />
          Faça uma doação de R$30, R$50 ou R$100 reais, a sua doação pode mudar
          a vida de alguém que sofre com problemas dentários.
          <br />
          <br />
          <h4>Compartilhe essa ideia, juntos somos mais fortes.</h4>
        </p>
        <img
          src="/images/maos.png"
          alt="mãos que ajudam"
          className={styles["help-image"]}
        />
      </div>
      <div className={styles.pix}>
        <img
          src="/images/qrcodepix.png"
          alt="qrcode pix"
          className={styles["qrcode-pix"]}
        />
        Centro Médico e de Implantes Comunitário <br /> Pix CNPJ:
        23.147.717/0001-66
        <p>
          <br />
          Ao realizar a doação, favor entrar em contato no nosso whatsapp.
        </p>
      </div>
    </section>
  );
};

export default About;
