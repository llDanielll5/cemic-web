/* eslint-disable @next/next/no-img-element */
import React from "react";
import ReactModal from "react-modal";
import styles from "../../styles/Modal.module.css";
import { Box, Typography } from "@mui/material";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";

interface ModalErrorProps {
  visible: boolean;
  closeModal: () => void;
  actionButton?: any;
  message: string;
}

const ModalError = (props: ModalErrorProps) => {
  return (
    <ReactModal
      isOpen={props.visible}
      shouldCloseOnOverlayClick
      shouldCloseOnEsc
      onRequestClose={props.closeModal}
      overlayClassName={styles["overlay-modal"]}
      className={styles["modal"]}
      portalClassName={styles["modal-portal"]}
      //   contentLabel="Example Modal"
    >
      <div className={styles["finish-register"]}>
        <HighlightOffIcon sx={{ fontSize: "70px", color: "var(--red)" }} />
        <h3>{props.message}</h3>
        {props.actionButton}
      </div>
    </ReactModal>
  );
};

export default ModalError;
