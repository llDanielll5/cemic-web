import React from "react";
import CModal from "@/components/modal";
import { Box, Button, Typography } from "@mui/material";
import { formatISO } from "date-fns";

const OpenCashierModal = (props: any) => {
  const { closeModal, visible, handleConfirmOpenCashier, dateSelected } = props;
  const today =
    formatISO(dateSelected).substring(0, 10) ===
    formatISO(new Date()).substring(0, 10);
  return (
    <CModal visible={visible} closeModal={closeModal}>
      <Typography variant="h5" p={3}>
        Deseja abrir o caixa{" "}
        {today ? "de Hoje?" : `do dia ${dateSelected.toLocaleDateString()}?`}
      </Typography>

      <Box display="flex" columnGap={2} width="100%" justifyContent={"center"}>
        <Button
          variant="contained"
          fullWidth
          onClick={handleConfirmOpenCashier}
        >
          Sim
        </Button>
        <Button
          variant="contained"
          color="error"
          fullWidth
          onClick={closeModal}
        >
          Não
        </Button>
      </Box>
    </CModal>
  );
};

export default OpenCashierModal;
