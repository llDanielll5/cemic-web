import React, { useState } from "react";
import { useRouter } from "next/router";
import styles from "../../styles/Modal.module.css";
import ReactDropdown from "react-dropdown";

const userTypes = ["Paciente", "Dentista", "Funcionário"];

const RegisterScreen = () => {
  const router = useRouter();
  const [usertype, setUsertype] = useState("Paciente");
  return (
    <div className={styles.container}>
      <div className={styles["left-side"]}>
        <div className={styles["login-form"]}>
          <h2>Criar conta grátis</h2>

          <div className={styles.row100}>
            <div className={styles.col}>
              <div className={styles["input-box"]}>
                <input type="text" name="" required />
                <span className={styles["text-input"]}>Nome</span>
                <span className={styles.line}></span>
              </div>
            </div>

            <h5 className={styles["drop-title"]}>O que você é na CEMIC?</h5>
            <ReactDropdown
              options={userTypes}
              onChange={({ value }) => setUsertype(value)}
              value={usertype}
              className={styles.drop}
            />

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

            <h6 className={styles["terms-policy"]}>
              Ao criar uma conta, você declara que está de acordo com os{" "}
              <span>Termos de Uso</span> & <span>Política de Privacidade</span>.
            </h6>

            <div className={styles["submit-container"]}>
              <input type={"submit"} value={"Criar conta"} />
            </div>

            <p onClick={() => router.push("/login")}>Já possuo cadastro!</p>
          </div>
        </div>
      </div>
      <div className={styles["right-side-register"]}></div>
    </div>
  );
};

export default RegisterScreen;
