/* eslint-disable @next/next/no-img-element */
import React from "react";
import styles from "../../../styles/Dashboard.module.css";

const CemicLogo = (props: any) => {
  return (
    <li>
      <a href={props.href}>
        <img
          src="/images/logo.png"
          alt="logo"
          className={styles["cemic-logo"]}
        />
        <span className={styles.title}>
          {props?.userData?.name ? `${props?.userData?.name}` : ""}
        </span>
      </a>
    </li>
  );
};

export default CemicLogo;
