import React from "react";
import styles from "../../styles/Admin.module.css";

interface BasicProfiles {
  name: string;
  profileImage: string;
  phone: string;
  cpf: string;
  type?: string;
  id: string;
}

interface ListProfilesProps {
  profiles: BasicProfiles[];
  notHaveMessage: string;
}

const ListProfiles = (props: ListProfilesProps) => {
  return (
    <div className={styles["container-list"]}>
      {props.profiles.length === 0 ? (
        <div className={styles["notHaveProfiles"]}>
          <h2>{props.notHaveMessage}</h2>
        </div>
      ) : (
        props.profiles.map((item, index) => (
          <div key={index} className={styles["profile-item"]}>
            <div className={styles["avatar-image"]}></div>
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
                Telefone: {item.phone === "" ? "Nenhum" : item.phone}
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ListProfiles;
