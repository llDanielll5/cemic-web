//@ts-nocheck
/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from "react";
import useWindowSize from "@/hooks/useWindowSize";
import styles from "../../../styles/Patient.module.css";
import Input from "@/components/input";
import { ClientType, SexType } from "types";
import { updateUserData } from "@/services/requests/firestore";

export interface userDataEdited {
  name?: string;
  cpf?: string;
  rg?: string;
  phone?: string;
  phone2?: string;
  email?: string;
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

const ProfilePatient = (props: {
  userData?: ClientType;
  setIsLoading: any;
}) => {
  const { userData } = props;
  const size = useWindowSize();
  const [dataUser, setDataUser] = useState<userDataEdited>(defaultValues);

  const handleMasked = (value: string, type: string) => {
    const masked = type === "cpf" ? cpfMask : phoneMask;
    setDataUser((prev) => ({
      ...prev,
      [type]: masked(value),
    }));
  };

  const handleChange = (e: any, value: string) => {
    setDataUser((prev: any) => ({
      ...prev,
      [value]: e,
    }));
  };

  useEffect(() => {
    setDataUser((prev: any) => ({
      ...prev,
      bornDate: userData?.dateBorn,
      cpf: cpfMask(userData?.cpf),
      rg: userData?.rg,
      email: userData?.email,
      name: userData?.name,
      phone: phoneMask(userData?.phone),
      sexo: "NENHUM",
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

  const blankImage =
    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";
  const hasUserImage = props.userData?.profileImage
    ? props.userData?.profileImage
    : blankImage;
  const formatCPF = props.userData?.cpf
    ? props.userData.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, "$1.$2.$3-$4")
    : "";
  const parseDateBorn = props.userData?.dateBorn
    ? props.userData?.dateBorn?.toDate().toLocaleDateString()
    : "Sem Data";

  const handleSubmit = async () => {
    props.setIsLoading(true);
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
    const dateTimestamp = new Date(y, parseInt(m) - 1, d);

    const updated = await updateUserData(userData?.id!, {
      name: dataUser.name,
      cpf: cpfReplaced,
      rg: dataUser.rg,
      email: dataUser.email,
      dateBorn: dateTimestamp,
      phone: phoneReplaced,
    });

    if (updated === "Sucesso") {
      props.setIsLoading(false);
      return alert("Usuário Atualizado com sucesso!");
    } else {
      props.setIsLoading(false);
      return alert("Não foi possível atualizar os dados do usuário");
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
              <Input
                label="CPF:"
                value={dataUser.cpf}
                onChange={(e) => handleMasked(e, "cpf")}
                maxLenght={14}
              />
            </div>
            <div className={styles.rg}>
              <Input
                label="RG:"
                value={dataUser.rg}
                onChange={(e) => handleChange(e, "rg")}
                maxLenght={7}
              />
            </div>
          </div>

          <div className={styles["cpf-container"]}>
            <div className={styles.cpf}>
              <Input
                label="E-mail:"
                value={dataUser.email}
                onChange={(e) => handleChange(e, "email")}
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

          <div className={styles["cpf-container"]}>
            <div className={styles.cpf}>
              <Input
                label="Telefone:"
                value={dataUser?.phone}
                onChange={(e) => handleMasked(e, "phone")}
                maxLenght={14}
              />
            </div>
            <div className={styles.rg}></div>
          </div>

          <div className={styles.save}>
            <button className={styles["save-button"]} onClick={handleSubmit}>
              Salvar Alterações
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePatient;
