import React, { useState } from "react";
import {
  Box,
  Typography,
  styled,
  Autocomplete,
  TextField,
} from "@mui/material";

import { Timestamp } from "firebase/firestore";

interface ContentPayment {
  title: string;
  content: string;
  value?: number;
  valueString: string;
}

interface NewPaymentProps {
  title: string;
  dateString: string;
  date: Timestamp;
  paymentMethod: string;
  discounts?: string;
  content: ContentPayment[];
}

const defaultValues: NewPaymentProps = {
  date: Timestamp.now(),
  dateString: "",
  title: "",
  paymentMethod: "",
  content: [],
};

const AddAdminPaymentModal: React.FC = () => {
  const [values, setValues] = useState(defaultValues);
  return (
    <Box>
      <Typography variant="subtitle1">
        Selecione a quem será o pagamento:
      </Typography>
      <Autocomplete
        disablePortal
        options={["Marisvaldo Protético"]}
        sx={{ width: "100%", backgroundColor: "white" }}
        value={values.title}
        onChange={(e, v) => setValues((prev: any) => ({ ...prev, title: v }))}
        renderInput={(params) => (
          <TextField {...params} label="" color="info" />
        )}
      />
    </Box>
  );
};

export default AddAdminPaymentModal;
