/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import styles from "../../styles/Modal.module.css";
import { createUser } from "@/services/requests/auth";
import { makeid } from "@/services/services";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/services/firebase";
import Modal from "@/components/modal";
import Loading from "@/components/loading";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import ModalSuccess from "@/components/modalSuccess";

const RegisterScreen = () => {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [finishRegister, setFinishRegister] = useState(false);

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
    return alert("Página em construção");

    if (name === "" || email === "" || password === "")
      alert("Preencha os campos!");

    setIsLoading(true);

    const checkHasIdUsed = async () => {
      var createAccount = false;
      while (!createAccount) {
        let userID = makeid(7);
        const existRef = doc(db, "clients", userID);
        const docSnap = await getDoc(existRef);
        const hasSnap = docSnap.exists();
        if (!hasSnap) {
          createAccount = true;
          await createUser({ email, password, name }, userID!).then(() => {
            setIsLoading(false);
            setName("");
            setEmail("");
            setFinishRegister(true);
          });
        }
        return;
      }
    };
    checkHasIdUsed();
  };

  const handleFinishRegister = () => {
    setFinishRegister(false);
    router.push("/login");
  };

  return (
    <div className={styles.container}>
      {isLoading && <Loading message="Estamos criando sua conta..." />}
      <ModalSuccess
        actionButton={handleFinishRegister}
        message={"Você criou sua conta na CEMIC com sucesso!"}
        closeModal={handleFinishRegister}
        visible={finishRegister}
      />
      <div className={styles["left-side"]}>
        <div className={styles["login-form"]}>
          <h2>Criar conta grátis</h2>

          <div className={styles.row100}>
            <div className={styles.col}>
              <div className={styles["input-box"]}>
                <input
                  type="text"
                  name=""
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <span className={styles["text-input"]}>Nome Completo</span>
                <span className={styles.line}></span>
              </div>
            </div>

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
                <span className={styles.line} />
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

            <h6 className={styles["terms-policy"]}>
              Ao criar uma conta, você declara que está de acordo com os{" "}
              <span>Termos de Uso</span> & <span>Política de Privacidade</span>.
            </h6>

            <div className={styles["submit-container"]}>
              <input
                type={"submit"}
                value={"Criar conta"}
                onClick={handleSubmit}
              />
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
