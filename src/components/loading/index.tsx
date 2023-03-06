import React from "react";
import styles from "../../styles/Loading.module.css";

const Loading = (props: { message?: string }) => {
  return (
    <div className={styles["spinner-container"]}>
      <div className={styles["loading-spinner"]} />
      <h2>{props.message ?? "Carregando..."}</h2>
    </div>
  );
};

export default Loading;
