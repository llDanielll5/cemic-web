//@ts-nocheck
/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from "react";
import Input from "@/components/input";
import UserData from "@/atoms/userData";
import { withStyles } from "@mui/styles";
import useWindowSize from "@/hooks/useWindowSize";
import styles from "../../../styles/Patient.module.css";
import { AddressType, ClientType, SexType } from "types";
import { updateUserData } from "@/services/requests/firestore";
import { StyledButton } from "@/components/dynamicAdminBody/receipts";
import { TextField, Box, styled } from "@mui/material";
import { nameCapitalized } from "@/services/services";
import { useSetRecoilState } from "recoil";
export interface userDataEdited {
  name?: string;
  cpf?: string;
  rg?: string;
  phone?: string;
  phone2?: string;
  sexo?: SexType | null;
  bornDate?: string;
}

const defaultValues: userDataEdited = {
  bornDate: "",
  cpf: "",
  email: "",
  name: "",
  phone: "",
  rg: "",
  sexo: null,
};

const defaultAddress: AddressType = {
  neighbor: "",
  cep: "",
  city: "",
  complement: "",
  line1: "",
  uf: "",
  address: "",
  number: "",
};

const ProfilePatient = (props: {
  userData?: ClientType;
  setIsLoading: any;
}) => {
  const { userData } = props;
  const size = useWindowSize();
  const [dataUser, setDataUser] = useState<userDataEdited>(defaultValues);
  const [locationData, setLocationData] = useState<AddressType>(defaultAddress);
  const setUserData = useSetRecoilState(UserData);

  const handleMasked = (value: string, type: string) => {
    const masked = type === "cpf" ? cpfMask : phoneMask;
    setDataUser((prev) => ({ ...prev, [type]: masked(value) }));
  };

  const handleChange = (e: any, value: string) => {
    setDataUser((prev: any) => ({ ...prev, [value]: e }));
  };

  const handleChangeLocation = (e: any, value: string) => {
    setLocationData((prev: any) => ({ ...prev, [value]: e }));
  };

  useEffect(() => {
    const addr = userData?.address;
    setDataUser((prev: any) => ({
      ...prev,
      rg: userData?.rg,
      name: userData?.name,
      email: userData?.email,
      cpf: cpfMask(userData?.cpf),
      bornDate: userData?.dateBorn,
      sexo: userData?.sexo ?? "NENHUM",
      phone: phoneMask(userData?.phone),
    }));
    setLocationData((prev: any) => ({
      ...prev,
      uf: addr?.uf,
      cep: addr?.cep,
      city: addr?.city,
      line1: addr?.line1,
      number: addr?.number,
      neighbor: addr?.neighbor,
      complement: addr?.complement,
    }));
  }, [userData]);

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

  function parseDate(date: string) {
    const [y, m, d] = date.split("-");
    return `${d}/${m}/${y}`;
  }

  const blankImage =
    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";
  const hasUserImage = props.userData?.profileImage
    ? props.userData?.profileImage
    : blankImage;
  const formatCPF = props.userData?.cpf
    ? props.userData.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, "$1.$2.$3-$4")
    : "";
  const parseDateBorn = props.userData?.dateBorn
    ? parseDate(props.userData?.dateBorn)
    : "Sem Data";

  const handleSubmit = async () => {
    props.setIsLoading(true);

    if (
      dataUser?.bornDate === "" ||
      dataUser?.cpf === "" ||
      dataUser?.name === ""
    )
      return alert("Preencha os dados corretamente");
    const phoneReplaced = dataUser
      .phone!.replace("(", "")
      .replace(")", "")
      .replace("-", "")
      .replace(" ", "");
    const cpfReplaced = dataUser.cpf
      .replace(".", "")
      .replace("-", "")
      .replace(".", "");
    const [y, m, d] = dataUser.bornDate?.split("-");
    const dateTimestamp = new Date(y, parseInt(m) - 1, d)
      .toISOString()
      .substring(0, 10);

    const completeName = nameCapitalized(dataUser?.name);

    const updateData = {
      name: completeName,
      cpf: cpfReplaced,
      rg: dataUser.rg,
      dateBorn: dateTimestamp,
      phone: phoneReplaced,
      "address.neighbor": locationData?.neighbor ?? "",
      "address.address": locationData?.address ?? "",
      "address.city": locationData?.city ?? "",
      "address.line1": locationData?.line1 ?? "",
      "address.uf": locationData?.uf ?? "",
      "address.cep": locationData?.cep ?? "",
      "address.number": locationData?.number ?? "",
      "address.complement": locationData?.complement ?? "",
    };
    const updateRecoilData = {
      name: dataUser.name,
      cpf: cpfReplaced,
      rg: dataUser.rg,
      dateBorn: dateTimestamp,
      phone: phoneReplaced,
      address: {
        neighbor: locationData?.neighbor ?? "",
        address: locationData?.address ?? "",
        city: locationData?.city ?? "",
        line1: locationData?.line1 ?? "",
        uf: locationData?.uf ?? "",
        cep: locationData?.cep ?? "",
        number: locationData?.number ?? "",
        complement: locationData?.complement ?? "",
      },
    };

    const updated = await updateUserData(userData?.id!, updateData);

    if (updated === "Sucesso") {
      props.setIsLoading(false);
      setUserData((prev) => ({ ...prev, ...updateRecoilData }));
      return alert("Usuário Atualizado com sucesso!");
    } else {
      props.setIsLoading(false);
      return alert("Não foi possível atualizar os dados do usuário");
    }
  };

  const handleGetCep = async (e: any) => {
    setLocationData((prev) => ({ ...prev, cep: e }));
    if (e.length === 8) {
      props.setIsLoading(true);
      try {
        const res = await fetch(`https://viacep.com.br/ws/${e}/json/`);
        const json = await res.json();
        if (json) {
          setLocationData((prev: any) => ({
            cep: e,
            uf: json.uf,
            neighbor: json.bairro,
            city: json.localidade,
            complement: json.complemento,
            line1: json.logradouro,
            address: `${json.logradouro}, ${json.bairro} ${json.complemento}, ${json.localidade} - ${json.uf}`,
          }));
          props.setIsLoading(false);
        }
      } catch (error) {
        props.setIsLoading(false);
      }
    }
  };

  return (
    <div className={styles["container-profile"]}>
      <div className={styles.container}>
        {size?.width! > 327 ? (
          <div className={styles["card-profile"]}>
            <div className={styles["title-card"]}>
              <img
                src="/images/cemicLogo.png"
                alt="logoCemic"
                className={styles["cemic-logo"]}
              />
              <h2>Cartão do Paciente</h2>
            </div>

            <div className={styles["header-card"]}>
              <div className={styles["name-container"]}>
                <div className={styles["user-image"]}>
                  <img
                    src={hasUserImage}
                    alt="User image"
                    className={styles["image-item"]}
                  />
                </div>
                <div className={styles["name-items"]}>
                  <p>{props.userData?.name ?? ""}</p>
                  <span>CPF: {formatCPF}</span>
                  <p>Cód. Paciente: {props.userData?.id ?? ""}</p>
                  <span>Nascimento: {parseDateBorn}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className={styles["min-devices-card"]}>
            <span>Ver Cartão do Paciente</span>
          </div>
        )}
      </div>
      <h1>Dados do Paciente</h1>

      <div className={styles["patient-data-container"]}>
        <div className={styles["dates-container"]}>
          <Input
            label="Nome:"
            value={dataUser.name}
            onChange={(e) => handleChange(e, "name")}
          />

          <div className={styles["cpf-container"]}>
            <div className={styles.cpf}>
              <TextField
                label="CPF:"
                value={dataUser.cpf}
                onChange={(e) => handleMasked(e, "cpf")}
                maxLenght={14}
                disabled
                sx={{ width: "100%" }}
              />
            </div>
            <div className={styles.rg}>
              <StyledTextField
                label="RG:"
                value={dataUser.rg}
                onChange={(e) => handleChange(e.target.value, "rg")}
                maxLenght={7}
                color={"primary"}
              />
            </div>
          </div>

          <div className={styles["cpf-container"]}>
            <div className={styles.cpf}>
              <Input
                label="Telefone:"
                value={dataUser?.phone}
                onChange={(e) => handleMasked(e, "phone")}
                maxLenght={14}
              />
            </div>
            <div className={styles.date}>
              <div className={styles["input-box"]}>
                <span className={styles["text-input"]}>Nascimento</span>
                <input
                  className={styles.datepicker}
                  type={"date"}
                  value={dataUser.bornDate}
                  onChange={(e) => handleChange(e.target.value, "bornDate")}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <h2
        style={{
          width: "100%",
          textAlign: "center",
          padding: "8px 0",
          backgroundColor: "white",
          margin: "16px 0",
        }}
      >
        Dados de Endereço
      </h2>

      <Container>
        <Inline>
          <Input
            label="CEP*:"
            value={locationData?.cep!}
            onChange={handleGetCep}
            maxLenght={8}
          />
          <Input
            label="Logradouro:"
            value={locationData?.line1!}
            onChange={(e) => handleChangeLocation(e, "line1")}
          />
        </Inline>

        <Inline>
          <Input
            label="Bairro:"
            value={locationData?.neighbor!}
            onChange={(e) => handleChangeLocation(e, "neighbor")}
            maxLenght={8}
          />
          <Box width="30%">
            <Input
              label="Número:"
              value={locationData?.number!}
              onChange={(e) => handleChangeLocation(e, "number")}
            />
          </Box>
        </Inline>

        <Inline>
          <Input
            label="Cidade:"
            value={locationData?.city!}
            onChange={(e) => handleChangeLocation(e, "city")}
            maxLenght={8}
          />
          <Box width="30%">
            <Input
              label="UF:"
              value={locationData?.uf!}
              onChange={(e) => handleChangeLocation(e, "uf")}
            />
          </Box>
        </Inline>

        <Inline>
          <Input
            label="Complemento:"
            value={locationData?.complement!}
            onChange={(e) => handleChangeLocation(e, "complement")}
          />
        </Inline>
      </Container>

      <Box display="flex" alignItems="center" justifyContent="center" my={2}>
        <StyledButton onClick={handleSubmit}>Salvar Alterações</StyledButton>
      </Box>
    </div>
  );
};

const Inline = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 55%;
  column-gap: 24px;
  @media screen and (max-width: 1100px) {
    width: 70%;
  }
  @media screen and (max-width: 900px) {
    flex-direction: column;
  }
  @media screen and (max-width: 500px) {
    width: 85%;
  }
`;

const Container = styled(Box)`
  background-color: white;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

export const StyledTextField = withStyles({
  root: {
    "& label.Mui-focused": {
      color: "var(--dark-blue)",
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "var(--dark-blue)",
      },
      "&:hover fieldset": {
        borderColor: "var(--dark-blue)",
      },
      "&.Mui-focused fieldset": {
        borderColor: "var(--dark-blue)",
      },
    },
  },
})(TextField);

export default ProfilePatient;
