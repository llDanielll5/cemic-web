import React, { useState } from "react";
import { useRouter } from "next/router";
import { nameCapitalized } from "@/services/services";
import { createUserLanding } from "@/services/requests/auth";
import { Box } from "@mui/material";
import styles from "../../styles/Landing.module.css";
import { AuthErrors } from "@/services/errors";
import Loading from "@/components/loading";

const ContactForm = () => {
  const router = useRouter();
  const [name, setName] = useState<string>("");
  const [cpf, setCPF] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [modalError, setModalError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleCPF = (event: any) => {
    let input = event.target;
    setCPF(cpfMask(input.value));
  };
  const cpfReplaced = cpf?.replace(".", "").replace("-", "").replace(".", "");

  const cpfMask = (value: any) => {
    if (!value) return "";
    value = value.replace(/\D/g, "");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    return value;
  };

  const handleCloseErrorModal = () => {
    setModalError(false);
    setErrorMessage("");
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (name === "" || email === "" || password === "" || cpf === "")
      return alert("Preencha os campos!");

    setIsLoading(true);
    const completeName = nameCapitalized(name);

    const data = {
      email,
      password,
      name: completeName,
      cpf: cpfReplaced,
    };

    return await createUserLanding(data)
      .then(async (res) => {
        if (res === "CPF existente") {
          setIsLoading(false);
          setModalError(true);
          setErrorMessage(
            "Esse CPF já está em uso! Favor entrar em contato com nosso Whatsapp"
          );
          return;
        } else {
          const finish = await router.push("/pre-register/" + cpfReplaced);
          if (finish) {
            setIsLoading(false);
            setName("");
            setEmail("");
            return;
          }
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
        } else return alert(err);
      });
  };

  return (
    <section className={styles.contact} id={"contact"}>
      {isLoading && (
        <Box position="fixed" top={0} left={0} zIndex={"2000"}>
          <Loading message="Criando cadastro..." />
        </Box>
      )}
      {/* <ModalError
        actionButton={
          <StyledButton onClick={handleCloseErrorModal}>Ok</StyledButton>
        }
        message={errorMessage}
        closeModal={handleCloseErrorModal}
        visible={modalError}
      /> */}
      <h2>
        Faça sua inscrição agora e concorra a sua vaga na <span>CEMIC!</span>
      </h2>
      <div className={styles["contact-container"]}>
        <form>
          <h4>
            Informe seu nome completo <span>*</span>
          </h4>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <h4>
            Informe seu CPF <span>*</span>
          </h4>
          <input
            type="text"
            maxLength={14}
            value={cpf}
            onChange={(event) => handleCPF(event)}
          />

          <h4>
            Informe seu e-mail <span>*</span>
          </h4>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ textTransform: "none" }}
          />

          <h4>
            Digite uma senha <span>*</span>
          </h4>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ textTransform: "none" }}
          />

          <input type="submit" value={"Cadastrar-se"} onClick={handleSubmit} />
        </form>
      </div>

      <h4>
        Campos <span>*</span> são obrigatórios!
      </h4>
    </section>
  );
};

export default ContactForm;
