import React from "react";
import { Modal, Box, Typography } from "@mui/material";

interface ModalInterface {
  visible: any;
  closeModal: any;
  children: React.ReactNode;
  styles?: React.CSSProperties;
}

const basicStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  borderRadius: 1,
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

const CModal = (props: ModalInterface) => {
  // common modal
  const { closeModal, children, visible } = props;
  return (
    <Modal open={visible} onClose={closeModal}>
      <Box sx={{ ...basicStyle, ...props.styles }}>{children}</Box>
    </Modal>
  );
};

export default CModal;
