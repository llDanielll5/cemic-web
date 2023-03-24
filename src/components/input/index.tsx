import React, { useState } from "react";
import styles from "../../styles/Input.module.css";

interface InputProps {
  value: string;
  label: string;
  onChange: (e: string) => void;
  maxLenght?: number;
  type?: string;
}

const Input = (props: InputProps) => {
  return (
    <div className={styles["input-box"]}>
      <input
        type={props.type ?? "text"}
        name=""
        required
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        maxLength={props.maxLenght}
      />
      <span className={styles["text-input"]}>{props.label}</span>
      <span className={styles.line}></span>
    </div>
  );
};

export default Input;
