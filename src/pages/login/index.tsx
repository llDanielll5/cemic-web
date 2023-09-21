/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useRef, useState } from "react";
import ModalSuccess from "@/components/modalSuccess";
import styles from "../../styles/Modal.module.css";
import Loading from "@/components/loading";
import Modal from "@/components/modal";
import { TbArrowBackUp } from "react-icons/tb";
import { auth } from "@/services/firebase";
import { useRouter } from "next/router";
import { handleLogin } from "@/services/requests/auth";
import { sendPasswordResetEmail } from "firebase/auth";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { getIP } from "@/services/getIp";

const LoginScreen = () => {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [email, setEmail] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalSuccessReset, setModalSuccessReset] = useState(false);

  const sendResetPassword = async () => {
    setIsLoading(true);
    sendPasswordResetEmail(auth, resetEmail)
      .then(() => {
        setIsLoading(false);
        setModalVisible(false);
        setModalSuccessReset(true);
      })
      .catch((error) => {
        setIsLoading(false);
        const errorCode = error.code;
        if (errorCode === "auth/invalid-email") {
          return alert("E-mail não cadastrado ou errado");
        } else if (errorCode === "auth/missing-email") {
          return alert("Digite um e-mail");
        } else if (errorCode === "auth/user-not-found") {
          return alert("Usuário não cadastrado");
        } else return alert(errorCode);
      });
  };

  const handleModalSuccessToggle = () => {
    setModalSuccessReset(false);
    setResetEmail("");
  };

  const handleTogglePasswordVisible = (e: any) => {
    inputRef?.current?.focus();
    let inputType = inputRef?.current?.type;
    if (inputType === "password")
      inputRef?.current?.setAttribute("type", "text");
    else inputRef?.current?.setAttribute("type", "password");

    setPasswordVisible(!passwordVisible);
    return;
  };

  const handleSubmit = async () => {
    if (email === "" && password === "") return alert("Preencha os campos!");
    setIsLoading(true);
    return await handleLogin({ email, password })
      .then(async (res) => {
        if (res === null || res === undefined) {
          return;
        } else if (res?.role === "admin" || res?.role === "employee") {
          const rout = await router.push("/admin");
          if (rout) setIsLoading(false);
        } else if (res?.role === "patient") {
          const rout = await router.push("/patient");
          if (rout) setIsLoading(false);
        } else if (res?.role === "pre-register") {
          const rout = await router.push({
            pathname: `/pre-register/${res?.id}`,
          });
          if (rout) setIsLoading(false);
        } else if (res?.role === "selected") {
          const rout = await router.push({
            pathname: `/selected/${res?.id}`,
          });
          if (rout) setIsLoading(false);
        } else if (res?.role === "professional") {
          const rout = await router.push("/professional");
          if (rout) setIsLoading(false);
        } else router.push("/");
      })
      .finally(() => setIsLoading(false));
  };

  const handleGetIP = async () => {
    const res = await getIP();
    if (
      res === "187.4.88.67" ||
      res === "191.56.48.3" ||
      res === "200.173.248.161" ||
      res === "179.127.249.183"
    ) {
      return;
    } else return await router.push("/");
  };

  // useEffect(() => {
  //   handleGetIP();
  // }, []);

  return (
    <div className={styles.container}>
      {isLoading && <Loading />}
      <ModalSuccess
        actionButton={handleModalSuccessToggle}
        message={"E-mail de recuperação enviado com sucesso!"}
        closeModal={handleModalSuccessToggle}
        visible={modalSuccessReset}
      />
      <div className={styles["back-arrow"]}>
        <TbArrowBackUp
          className={styles["arrow-item"]}
          onClick={() => router.push("/")}
        />
      </div>
      <Modal visible={modalVisible} closeModal={() => setModalVisible(false)}>
        <div className={styles["reset-password"]}>
          <h3>
            Digite o seu email para enviarmos um código de recuperação de senha.
          </h3>
          <div className={styles["input-box"]}>
            <input
              type="text"
              name=""
              required
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
            />
            <span className={styles["text-input"]}>E-mail</span>
            <span className={styles.line}></span>
          </div>
          <div className={styles["submit-container"]}>
            <input
              type={"submit"}
              value={"Requisitar E-mail"}
              onClick={sendResetPassword}
            />
          </div>
        </div>
      </Modal>
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
                  onKeyDown={({ key }) => {
                    if (key === "Enter") return handleSubmit();
                  }}
                />
                <span className={styles["text-input"]}>E-mail</span>
                <span className={styles.line}></span>
              </div>
            </div>

            <div className={styles.col}>
              <div className={styles["input-box"]}>
                <input
                  ref={inputRef}
                  type="password"
                  name=""
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={({ key }) => {
                    if (key === "Enter") return handleSubmit();
                  }}
                />
                <span className={styles["text-input"]}>Senha</span>
                <span className={styles.line} />
                {passwordVisible &&
                  AiOutlineEye({
                    onClick: handleTogglePasswordVisible,
                    className: styles["icon-eye"],
                  })}
                {!passwordVisible &&
                  AiOutlineEyeInvisible({
                    onClick: handleTogglePasswordVisible,
                    className: styles["icon-eye"],
                  })}
              </div>
            </div>

            <div className={styles["submit-container"]}>
              <input type={"submit"} value={"Entrar"} onClick={handleSubmit} />
              <span onClick={() => setModalVisible(true)}>
                Esqueci minha senha
              </span>
            </div>

            {/* <h3>Não possui conta ainda?</h3>
            <p onClick={() => router.push("/register")}>
              Crie uma agora grátis!
            </p> */}
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
