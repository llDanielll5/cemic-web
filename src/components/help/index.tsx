/* eslint-disable @next/next/no-img-element */
import React from "react";
import styles from "../../styles/Landing.module.css";

const Help = (props: { ref: any }) => {
  return (
    <section id={"help"} ref={props.ref}>
      <h1>
        <span>A</span>
        <span>J</span>
        <span>U</span>
        <span>D</span>
        <span>E</span>
        <span>-</span>
        <span>N</span>
        <span>O</span>
        <span>S</span>
      </h1>
      <div className={styles["help-container"]}>
        <p>
          Se você acha nosso trabalho importante, ajude-nos a multiplicar nossos
          atendimentos. <br />
          <br />
          Faça uma doação de R$30, R$50 ou R$100 reais, a sua doação pode mudar
          a vida de alguém que sofre com problemas dentários.
          <br />
          <br />
          <h4>Juntos somos mais fortes.</h4> <br />
          <h5>CEMIC. Compartilhe essa ideia!</h5>
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

export default Help;
