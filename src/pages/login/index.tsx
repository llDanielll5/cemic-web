/* eslint-disable @next/next/no-img-element */
import React from "react";
import { useRouter } from "next/router";
import styles from "../../styles/Modal.module.css";

const LoginScreen = () => {
  const router = useRouter();
  return (
    <div className={styles.container}>
      <div className={styles["left-side"]}>
        <div className={styles["login-form"]}>
          <img
            src="/images/cemicText.png"
            alt="logo cemic"
            className={styles["logo-mini"]}
          />
          <h2>Acesse sua conta</h2>

          <div className={styles.row100}>
            <div className={styles.col}>
              <div className={styles["input-box"]}>
                <input type="text" name="" required />
                <span className={styles["text-input"]}>E-mail</span>
                <span className={styles.line}></span>
              </div>
            </div>

            <div className={styles.col}>
              <div className={styles["input-box"]}>
                <input type="password" name="" required />
                <span className={styles["text-input"]}>Senha</span>
                <span className={styles.line}></span>
              </div>
            </div>

            <div className={styles["submit-container"]}>
              <input type={"submit"} value={"Entrar"} />
              <span>Esqueci minha senha</span>
            </div>

            <h3>Não possui conta ainda?</h3>
            <p onClick={() => router.push("/register")}>
              Crie uma agora grátis!
            </p>
          </div>
        </div>
      </div>
      <div className={styles["right-side"]}>
        <img
          src="/images/logoAndText.png"
          alt="cemic logo"
          className={styles["big-logo"]}
        />
      </div>
    </div>
  );
};

export default LoginScreen;
