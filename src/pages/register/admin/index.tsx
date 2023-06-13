//@ts-nocheck
import React, { useState } from "react";
import styles from "../../../styles/ProfessionalRegister.module.css";
import Input from "@/components/input";
import { ProfessionalData } from "types";
import { useRouter } from "next/router";
import ModalSuccess from "@/components/modalSuccess";
import Loading from "@/components/loading";
import { createAdmin } from "@/services/requests/auth";
import Modal from "@/components/modal";
import { Typography } from "@mui/material";
import { StyledButton } from "@/components/dynamicAdminBody/receipts";

const baseData = {
  cpf: "",
  name: "",
  payments: [],
  phone: "",
  profileImage: "",
  protocols: [],
  rg: "",
  treatments: [],
  email: "",
  id: "",
  uid: "",
};

const ProfessionalRegister = () => {
  const router = useRouter();
  const [data, setData] = useState<ProfessionalData>(baseData);
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [finishRegister, setFinishRegister] = useState(false);
  const [modalConfirm, setModalConfirm] = useState(true);
  const [code, setCode] = useState("");
  const [chances, setChances] = useState(3);

  const handleChange = (e: any, field: string) => {
    return setData((prev: any) => ({ ...prev, [field]: e }));
  };
  const handleMasked = (value: string, type: string) => {
    const masked = type === "cpf" ? cpfMask : phoneMask;
    setData((prev: any) => ({ ...prev, [type]: masked(value) }));
  };

  const phoneMask = (value: any) => {
    if (!value) return "";
    value = value.replace(/\D/g, "");
    value = value.replace(/(\d{2})(\d)/, "($1) $2");
    value = value.replace(/(\d)(\d{4})$/, "$1-$2");
    return value;
  };
  const cpfMask = (value: any) => {
    if (!value) return "";
    value = value.replace(/\D/g, "");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    return value;
  };

  const handleSubmit = async () => {
    const { cpf, email, name, phone, rg } = data;
    if (
      name === "" ||
      email === "" ||
      password === "" ||
      cpf.length < 14 ||
      phone.length < 15 ||
      rg === ""
    )
      return alert("Preencha os campos!");

    const phoneReplaced = data
      ?.phone!.replace("(", "")
      .replace(")", "")
      .replace("-", "")
      .replace(" ", "");
    const cpfReplaced = data
      ?.cpf!.replace(".", "")
      .replace("-", "")
      .replace(".", "");

    setIsLoading(true);

    const completeName = nameCapitalized(name);

    const dataChange = {
      cpf,
      cro,
      email,
      name: completeName,
      phone,
      rg,
    };

    return await createAdmin(dataChange, password, cpfReplaced, phoneReplaced)
      .then(() => {
        setIsLoading(false);
        setData(baseData);
        setPassword("");
        setFinishRegister(true);
      })
      .catch((err) => {
        setIsLoading(false);
        return alert(err);
      });
  };

  const handleFinishRegister = async () => {
    const isLogout = await router.push("/login");
    if (isLogout) setFinishRegister(false);
  };

  const handleVerify = () => {
    if (code === process.env.ADMIN_PASSWORD) return setModalConfirm(false);
    else {
      setChances((prev) => prev - 1);
      if (chances === 0) {
        router.push("/login");
      } else
        return alert(`Código incorreto. Você tem mais ${chances} chance(s)`);
    }
  };

  const handlePressVerify = ({ key }: any) => {
    if (key === "Enter") return handleVerify();
  };

  return (
    <div className={styles.container}>
      {isLoading && <Loading message="Estamos criando sua conta..." />}

      <Modal visible={modalConfirm}>
        <Typography variant="semibold">
          Digite o código de administrador:
        </Typography>
        <Input
          onChange={(e) => setCode(e)}
          label="Código"
          value={code}
          onKeyDown={handlePressVerify}
        />
        <StyledButton onClick={handleVerify}>Verificar</StyledButton>
      </Modal>

      <ModalSuccess
        actionButton={handleFinishRegister}
        message={"Você criou sua conta na CEMIC com sucesso!"}
        closeModal={handleFinishRegister}
        visible={finishRegister}
      />
      <div className={styles.register}>
        <h3>Registro de Administrador</h3>
        <div className={styles.inputs}>
          <Input
            label="Nome Completo *"
            onChange={(e) => handleChange(e, "name")}
            value={data.name}
          />

          <Input
            label="Telefone *"
            onChange={(e) => handleMasked(e, "phone")}
            value={data.phone}
            maxLenght={15}
          />
          <Input
            label="CPF *"
            onChange={(e) => handleMasked(e, "cpf")}
            value={data.cpf}
            maxLenght={14}
          />
          <Input
            label="RG *"
            onChange={(e) => handleChange(e, "rg")}
            value={data.rg}
          />

          <Input
            label="Email *"
            onChange={(e) => handleChange(e, "email")}
            value={data.email}
          />

          <Input
            label="Senha para acesso *"
            onChange={(e) => setPassword(e)}
            value={password}
            type={"password"}
          />

          <StyledButton onClick={handleSubmit}>
            Registrar Administrador
          </StyledButton>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalRegister;
