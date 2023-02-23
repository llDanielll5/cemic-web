import React from "react";
import ReactModal from "react-modal";
import styles from "../../styles/Modal.module.css";

interface ModalProps {
  visible: boolean;
  closeModal: () => void;
  children: React.ReactNode;
}

const Modal = (props: ModalProps) => {
  return (
    <ReactModal
      isOpen={props.visible}
      shouldCloseOnOverlayClick
      shouldCloseOnEsc
      onRequestClose={props.closeModal}
      overlayClassName={styles["overlay-modal"]}
      className={styles["modal"]}
      portalClassName={styles["modal-portal"]}
      contentLabel="Example Modal"
    >
      {props.children}
    </ReactModal>
  );
};

export default Modal;
