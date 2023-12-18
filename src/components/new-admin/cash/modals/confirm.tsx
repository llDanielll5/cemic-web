import CModal from "@/components/modal";
import { Typography } from "@mui/material";
import React from "react";

// import { Container } from './styles';

const ConfirmCashModal = (props: any) => {
  const { closeModal, visible } = props;
  return (
    <CModal closeModal={closeModal} visible={visible}>
      <Typography variant="subtitle1">Teste</Typography>
    </CModal>
  );
};

export default ConfirmCashModal;
