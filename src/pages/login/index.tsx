/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import { useRouter } from "next/router";
import styles from "../../styles/Modal.module.css";
import { handleLogin } from "@/services/requests/auth";

const LoginScreen = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    if (email === "" && password === "") alert("Preencha os campos!");
    handleLogin({ email, password }).then((res) => {
      if (res === null || res === undefined) {
        return;
      } else if (res?.role === "admin") {
        router.push("/admin");
      } else if (res?.role === "client") {
        router.push({
          pathname: `/patient/${res?.id}`,
        });
      } else router.push("/");
    });
  };

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
                <input
                  type="text"
                  name=""
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <span className={styles["text-input"]}>E-mail</span>
                <span className={styles.line}></span>
              </div>
            </div>

            <div className={styles.col}>
              <div className={styles["input-box"]}>
                <input
                  type="password"
                  name=""
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span className={styles["text-input"]}>Senha</span>
                <span className={styles.line}></span>
              </div>
            </div>

            <div className={styles["submit-container"]}>
              <input type={"submit"} value={"Entrar"} onClick={handleSubmit} />
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
