import React from "react";
import { Box, Button, Stack } from "@mui/material";
import PostAddIcon from "@mui/icons-material/PostAdd";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

interface AddTreatmentProps {
  handleGeneratePayment: any;
  treatments: any;
}

const AddTreatment = (props: AddTreatmentProps) => {
  const { handleGeneratePayment, treatments } = props;
  return (
    <Stack direction="row" justifyContent="center" columnGap={2}>
      {treatments === null && (
        <Box display="flex" flexDirection="column" alignItems="center" mt={1}>
          <Button
            variant="contained"
            onClick={handleGeneratePayment}
            startIcon={<AttachMoneyIcon />}
          >
            Adicionar Pagamento
          </Button>
        </Box>
      )}
    </Stack>
  );
};

export default AddTreatment;
