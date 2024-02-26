import CModal from "@/components/modal";
import { Box, Button, Typography } from "@mui/material";
import React from "react";

interface DeletePaymentModalProps {
  visible: any;
  closeModal: any;
  onDeleteReceipt: () => void;
  onRefuse: () => void;
}

const DeletePaymentModal = (props: DeletePaymentModalProps) => {
  return (
    <CModal visible={props.visible} closeModal={props.closeModal}>
      <Box display="flex" flexDirection="column" alignItems="center">
        <Typography variant="h5">
          Deseja realmente apagar este pagamento?
        </Typography>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          columnGap={2}
        >
          <Button onClick={props.onDeleteReceipt}>Sim</Button>
          <Button onClick={props.onRefuse}>Não</Button>
        </Box>
      </Box>
    </CModal>
  );
};

export default DeletePaymentModal;
