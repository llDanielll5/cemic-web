import React, { useState } from "react";
import { StyledButton } from "@/components/dynamicAdminBody/receipts";
import { createUserLanding } from "@/services/requests/auth";
import { Box, Typography, styled } from "@mui/material";
import { nameCapitalized } from "@/services/services";
import { AuthErrors } from "@/services/errors";
import { useRouter } from "next/router";
import Input from "@/components/input";
import Loading from "@/components/loading";
import ModalError from "@/components/modalError";

const FormLanding = () => {
  const router = useRouter();
  const [name, setName] = useState<string>("");
  const [cpf, setCPF] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [modalError, setModalError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleCPF = (event: any) => {
    let input = event;
    setCPF(cpfMask(input));
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
    return alert("Em andamento.");
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

  if (isLoading)
    return (
      <Box position="fixed" top={0} left={0} zIndex={2000}>
        <Loading message="Criando cadastro..." />
      </Box>
    );

  return (
    <Container>
      <ModalError
        actionButton={
          <StyledButton onClick={handleCloseErrorModal}>Ok</StyledButton>
        }
        message={errorMessage}
        closeModal={handleCloseErrorModal}
        visible={modalError}
      />
      <h3 style={{ margin: "0 0 8px 0", textAlign: "center" }}>
        Cadastre-se no Projeto agora!
      </h3>
      <Input
        label="Nome Completo*"
        labelStyle={{ backgroundColor: "rgba(250,250,250,0)" }}
        inputStyle={{ textTransform: "capitalize" }}
        onChange={(e) => setName(e)}
        value={name}
      />
      <Input
        label="CPF*"
        labelStyle={{ backgroundColor: "rgba(250,250,250,0)" }}
        onChange={(e) => handleCPF(e)}
        maxLenght={14}
        value={cpf}
      />
      <Input
        label="Email*"
        type="email"
        value={email}
        labelStyle={{ backgroundColor: "rgba(250,250,250,0)" }}
        onChange={(e) => setEmail(e)}
      />
      <Input
        label="Senha*"
        type="password"
        value={password}
        labelStyle={{ backgroundColor: "rgba(250,250,250,0)" }}
        onChange={(e) => setPassword(e)}
      />
      <Box>
        <StyledButton onClick={handleSubmit}>Cadastrar</StyledButton>
      </Box>
      <Typography mt={1} variant="small">
        Campos com * são obrigatórios
      </Typography>
    </Container>
  );
};

const Container = styled(Box)`
  padding: 40px;
  top: 20%;
  right: 15%;
  border-radius: 8px;
  min-width: 350px;
  position: absolute;
  width: calc(100% / 3.5);
  max-width: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  z-index: 90;
  box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.14);
  transform: translateX(-15%);
  transform: translateY(-20%);
  background-color: rgba(250, 250, 250, 0.95);

  @media screen and (max-width: 550px) {
    position: relative;
    display: flex;
    top: 0;
    left: 0;
    transform: none;
    margin: 0 auto 32px auto;
    width: 100%;
    box-shadow: none;
    border-bottom: 1.3px solid #bbb;
  }
`;

export default FormLanding;
