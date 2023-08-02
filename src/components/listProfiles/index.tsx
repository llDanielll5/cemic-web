/* eslint-disable @next/next/no-img-element */
import React from "react";
import styles from "../../styles/Admin.module.css";
import { Box, styled, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { defaultImage, getImage } from "@/services/services";

interface BasicProfiles {
  name: string;
  profileImage: string;
  phone: string;
  cpf: string;
  type?: string;
  role?: string;
  id: string;
}

interface ListProfilesProps {
  notHaveMessage: string;
  profiles: BasicProfiles[];
  setClientID: (e: string) => void;
  setClientDetailsVisible: (e: boolean) => void;
}

const ListProfiles = (props: ListProfilesProps) => {
  const route = useRouter();

  return (
    <div className={styles["container-list"]}>
      {props.profiles.length === 0 ? (
        <div className={styles["notHaveProfiles"]}>
          <h2>{props.notHaveMessage}</h2>
        </div>
      ) : (
        props.profiles.map((item, index) => (
          <div
            key={index}
            className={styles["profile-item"]}
            onClick={() => {
              props.setClientID(item?.id);
              props.setClientDetailsVisible(true);
              return;
            }}
          >
            <img
              className={styles["avatar-image"]}
              src={getImage(item.profileImage)}
              alt=""
            ></img>
            <div className={styles["container-avatar"]}>
              <span className={styles.name}>Nome: {item.name}</span>
              <p className={styles.cpf}>
                CPF:{" "}
                {item.cpf.replace(
                  /(\d{3})(\d{3})(\d{3})(\d{2})/g,
                  "$1.$2.$3-$4"
                )}
              </p>
            </div>
            <RoleCard>
              {item?.role === "patient" ? (
                <Patient>Paciente</Patient>
              ) : item?.role === "pre-register" ? (
                <NotPatient>Não-Paciente</NotPatient>
              ) : (
                <Selected>Selecionado</Selected>
              )}
            </RoleCard>
          </div>
        ))
      )}
    </div>
  );
};

const RoleCard = styled(Box)`
  color: var(--dark-blue);
  width: fit-content;
`;
const Patient = styled(Typography)`
  background-color: green;
  color: white;
  padding: 2px 4px;
  border-radius: 4px;
  font-size: 0.8rem;
`;
const NotPatient = styled(Typography)`
  background-color: var(--red);
  color: white;
  padding: 2px 4px;
  border-radius: 4px;
  font-size: 0.8rem;
`;
const Selected = styled(Typography)`
  background-color: goldenrod;
  color: white;
  padding: 2px 4px;
  border-radius: 4px;
  font-size: 0.8rem;
`;

export default ListProfiles;
