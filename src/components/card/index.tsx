import React from "react";

interface CardProps {
  children?: React.ReactNode;
  w?: string;
  styles?: React.CSSProperties;
}

const Card = (props: CardProps) => {
  return (
    <div
      style={{ width: props.w ?? "fit-content", ...props.styles }}
      // className={styles.card}
    >
      {props.children}
    </div>
  );
};

export default Card;
