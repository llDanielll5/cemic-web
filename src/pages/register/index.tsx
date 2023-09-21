/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useRef, useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { doc, getDoc } from "firebase/firestore";
import { createUser } from "@/services/requests/auth";
import { useRouter } from "next/router";
import { makeid } from "@/services/services";
import { db } from "@/services/firebase";
import Loading from "@/components/loading";
import styles from "../../styles/Modal.module.css";
import ModalSuccess from "@/components/modalSuccess";
import { AuthErrors } from "@/services/errors";
import { StyledButton } from "@/components/dynamicAdminBody/receipts";
import ModalError from "@/components/modalError";

const RegisterScreen = () => {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCPF] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [finishRegister, setFinishRegister] = useState(false);
  const [modalError, setModalError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const loginPage = async () => {
      setIsLoading(true);
      setLoadingMessage("Voltando para a tela de login");
      await router.push("/login").then(
        () => setIsLoading(false),
        (er) => setIsLoading(false)
      );
    };
    loginPage();
  }, [router]);

  const handleTogglePasswordVisible = (e: any) => {
    inputRef?.current?.focus();
    let inputType = inputRef?.current?.type;
    if (inputType === "password")
      inputRef?.current?.setAttribute("type", "text");
    else inputRef?.current?.setAttribute("type", "password");

    setPasswordVisible(!passwordVisible);
    return;
  };
  const handleCloseErrorModal = () => {
    setModalError(false);
    setErrorMessage("");
  };

  const cpfReplaced = cpf.replace(".", "").replace("-", "").replace(".", "");

  const handleSubmit = async () => {
    return alert("Ainda não é possível se registrar");
    if (name === "" || email === "" || password === "")
      return alert("Preencha os campos!");

    const arrStr = name.split(" ");
    const capitalizeds = arrStr.map((v) => {
      const char = v.charAt(0);
      const rest = v.slice(1);

      return `${char.toUpperCase()}${rest.toLowerCase()}`;
    });

    const completeName = capitalizeds.join(" ");

    setIsLoading(true);
    setLoadingMessage("Estamos criando sua conta");
    const checkHasIdUsed = async () => {
      await createUser({
        email,
        password,
        name: completeName,
        cpf: cpfReplaced,
      })
        .then((res) => {
          if (res === "CPF existente") {
            setIsLoading(false);
            setModalError(true);
            setErrorMessage(
              "Esse CPF já está em uso! Favor entrar em contato com nosso Whatsapp"
            );
            return;
          } else {
            setIsLoading(false);
            setName("");
            setEmail("");
            setFinishRegister(true);
          }
        })
        .catch((err) => {
          setIsLoading(false);
          if (err.code === AuthErrors["01"]) {
            setModalError(true);
            setErrorMessage("Email já está em uso");
            return;
          } else if (err.code === "auth/invalid-email") {
            setModalError(true);
            setErrorMessage(
              "Email inválido. Verifique corretamente o email adicionado!"
            );
          } else return alert(err.code);
        });
    };

    checkHasIdUsed();
  };

  const handleFinishRegister = async () => {
    const res = await router.push("/login");
    if (res) return setFinishRegister(false);
  };

  const cpfMasked = (cpf: string) => {
    cpf = cpf.replace(/\D/g, "");
    cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
    cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
    cpf = cpf.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    return cpf;
  };

  return (
    <div className={styles.container}>
      {isLoading && <Loading message={loadingMessage} />}
      <ModalSuccess
        actionButton={handleFinishRegister}
        message={"Você criou sua conta na CEMIC com sucesso!"}
        closeModal={handleFinishRegister}
        visible={finishRegister}
      />
      <ModalError
        actionButton={
          <StyledButton onClick={handleCloseErrorModal}>Ok</StyledButton>
        }
        message={errorMessage}
        closeModal={handleCloseErrorModal}
        visible={modalError}
      />
      <div className={styles["left-side"]}>
        <div className={styles["login-form"]}>
          <h2>Criar conta grátis</h2>

          <div className={styles.row100}>
            <div className={styles.col}>
              <div className={styles["input-box"]}>
                <input
                  type="text"
                  required
                  value={name}
                  autoCapitalize="words"
                  style={{ textTransform: "capitalize" }}
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
                  required
                  value={cpf}
                  maxLength={14}
                  onChange={(e) => setCPF(cpfMasked(e.target.value))}
                />
                <span className={styles["text-input"]}>CPF</span>
                <span className={styles.line}></span>
              </div>
            </div>

            <div className={styles.col}>
              <div className={styles["input-box"]}>
                <input
                  type="text"
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
