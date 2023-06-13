import React from "react";
import styles from "../../styles/Components.module.css";

interface ButtonProps {
  onClick?: () => void;
  children?: React.ReactNode;
  title?: string;
  styles?: React.CSSProperties;
}

const Button = (props: ButtonProps) => {
  return (
    <button
      onClick={props.onClick}
      className={styles.button}
      title={props.title}
      style={props.styles}
    >
      {props.children}
    </button>
  );
};

export default Button;
