/* eslint-disable react/jsx-key */
import React, { useState } from "react";
// import { createUserLanding } from "@/services/requests/auth";
import { Box, styled } from "@mui/material";
import { nameCapitalized } from "@/services/services";
import { useRouter } from "next/router";
import Loading from "@/components/loading";
import CustomTab from "@/components/customTab";
import RegisterLandingForm from "./register";
import { AuthErrorCodes } from "firebase/auth";

const FormLanding = () => {
  const router = useRouter();
  const [name, setName] = useState<string>("");
  const [cpf, setCPF] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [modalError, setModalError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const tabs = ["Cadastrar", "Entrar"];

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
    return alert("Em andamento");
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

    // return await createUserLanding(data)
    //   .then(async (res) => {
    //     if (res === "CPF existente") {
    //       setIsLoading(false);
    //       setModalError(true);
    //       setErrorMessage(
    //         "Esse CPF já está em uso! Favor entrar em contato com nosso Whatsapp"
    //       );
    //       return;
    //     } else {
    //       const finish = await router.push("/pre-register/" + cpfReplaced);
    //       if (finish) {
    //         setIsLoading(false);
    //         setName("");
    //         setEmail("");
    //         return;
    //       }
    //     }
    //   })
    //   .catch((err) => {
    //     setIsLoading(false);
    //     if (err.code === AuthErrorCodes.EMAIL_EXISTS) {
    //       setModalError(true);
    //       setErrorMessage("Email já está em uso");
    //       return;
    //     } else if (err.code === "auth/invalid-email") {
    //       setModalError(true);
    //       setErrorMessage(
    //         "Email inválido. Verifique corretamente o email adicionado!"
    //       );
    //     } else return alert(err);
    //   });
  };

  const renders = [
    <RegisterLandingForm
      cpf={cpf}
      email={email}
      handleCPF={handleCPF}
      handleSubmit={handleSubmit}
      name={name}
      password={password}
      setEmail={setEmail}
      setName={setName}
      setPassword={setPassword}
    />,
    // <LoginFormLanding
    //   email={email}
    //   password={password}
    //   setEmail={setEmail}
    //   setPassword={setPassword}
    //   setIsLoading={setIsLoading}
    // />,
  ];

  if (isLoading)
    return (
      <Box position="fixed" top={0} left={0} zIndex={2000}>
        <Loading message="Aguarde um pouco..." />
      </Box>
    );

  return (
    <Container>
      {/* <ModalError
        actionButton={
          <StyledButton onClick={handleCloseErrorModal}>Ok</StyledButton>
        }
        message={errorMessage}
        closeModal={handleCloseErrorModal}
        visible={modalError}
      /> */}

      <CustomTab labels={tabs} values={tabs} renders={renders} />
    </Container>
  );
};

const Container = styled(Box)`
  padding: 40px 40px 20px 40px;
  border-radius: 8px;
  min-width: 200px;
  width: 60%;
  max-width: 500px;
  min-height: 400px;
  display: flex;
  align-items: center;
  flex-direction: column;
  z-index: 90;
  margin: 0 auto;
  box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.14);
  background-color: rgba(250, 250, 250, 0.95);

  @media screen and (max-width: 760px) {
    width: 80%;
  }

  @media screen and (max-width: 550px) {
    position: relative;
    display: flex;
    margin: 0 auto 32px auto;
    width: 100%;
    box-shadow: none;
    border-bottom: 1.3px solid #bbb;
  }
`;

export default FormLanding;
