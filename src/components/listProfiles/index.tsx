/* eslint-disable @next/next/no-img-element */
import React from "react";
import styles from "../../styles/Admin.module.css";
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
            <div className={styles["container-avatar"]}>
              <span className={styles.name}>Código: {item.id}</span>
              <p className={styles.cpf}>
                {item?.role === "patient" ? (
                  <p className={styles.patient}>Paciente</p>
                ) : item?.role === "pre-register" ? (
                  <p className={styles.notPatient}>Não-paciente</p>
                ) : (
                  <p className={styles.selected}>Selecionado</p>
                )}
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ListProfiles;
