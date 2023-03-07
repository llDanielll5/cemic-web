/* eslint-disable @next/next/no-img-element */
import React from "react";
import ReactModal from "react-modal";
import styles from "../../styles/Modal.module.css";

interface ModalSuccessProps {
  visible: boolean;
  closeModal: () => void;
  actionButton: () => void;
  message: string;
}

const ModalSuccess = (props: ModalSuccessProps) => {
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
        <img
          src="/images/checked.jpg"
          alt="checked image"
          className={styles["check-img"]}
        />
        <h3>{props.message}</h3>
        <button onClick={props.actionButton}>Fazer Login</button>
      </div>
    </ReactModal>
  );
};

export default ModalSuccess;
