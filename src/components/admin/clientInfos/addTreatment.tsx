import React from "react";
import { Box, Typography } from "@mui/material";
import { StyledButton } from "@/components/dynamicAdminBody/receipts";
import PostAddIcon from "@mui/icons-material/PostAdd";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

interface AddTreatmentProps {
  openModal: any;
  handleGeneratePayment: any;
  treatments: any;
}

const AddTreatment = (props: AddTreatmentProps) => {
  const { handleGeneratePayment, openModal } = props;
  return (
    <>
      <Box display="flex" flexDirection="column" alignItems="center" mt={1}>
        <Typography variant="semibold">Adicionar tratamentos</Typography>

        <StyledButton onClick={openModal} endIcon={<PostAddIcon />}>
          Adicionar Tratamento
        </StyledButton>
      </Box>

      {props.treatments !== null && (
        <Box display="flex" flexDirection="column" alignItems="center" mt={1}>
          <Typography variant="semibold">Adicionar Pagamento</Typography>

          <StyledButton
            onClick={handleGeneratePayment}
            endIcon={<AttachMoneyIcon />}
          >
            Adicionar Pagamento
          </StyledButton>
        </Box>
      )}
    </>
  );
};

export default AddTreatment;
