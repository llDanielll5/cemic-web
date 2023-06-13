import React, { useState, useRef } from "react";
import styles from "../../styles/Input.module.css";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

interface InputProps {
  value?: string;
  label: string;
  onChange?: (e: string) => void;
  maxLenght?: number;
  onKeyDown?: any;
  type?: string;
  onFocus?: any;
  disabled?: boolean;
  inputStyle?: React.CSSProperties;
  labelStyle?: React.CSSProperties;
}

const Input = (props: InputProps) => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleTogglePasswordVisible = (e: any) => {
    inputRef?.current?.focus();
    let inputType = inputRef?.current?.type;
    if (inputType === "password")
      inputRef?.current?.setAttribute("type", "text");
    else inputRef?.current?.setAttribute("type", "password");

    setPasswordVisible(!passwordVisible);
    return;
  };

  return (
    <div className={styles["input-box"]}>
      <input
        name=""
        required
        ref={inputRef}
        value={props.value}
        onFocus={props.onFocus}
        disabled={props.disabled}
        type={props.type ?? "text"}
        onChange={(e) => props?.onChange?.(e.target.value)}
        maxLength={props.maxLenght}
        onKeyDown={props.onKeyDown}
        style={{ ...props.inputStyle }}
      />
      <span className={styles["text-input"]} style={{ ...props.labelStyle }}>
        {props.label}
      </span>
      <span className={styles.line}></span>

      {passwordVisible && props.type === "password"
        ? AiOutlineEye({
            onClick: handleTogglePasswordVisible,
            className: styles["icon-eye"],
          })
        : null}
      {!passwordVisible && props.type === "password"
        ? AiOutlineEyeInvisible({
            onClick: handleTogglePasswordVisible,
            className: styles["icon-eye"],
          })
        : null}
    </div>
  );
};

export default Input;
