import React from "react";
import { Box, styled, IconButton } from "@mui/material";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import PaymentsIcon from "@mui/icons-material/Payments";
import PixIcon from "@mui/icons-material/Pix";

interface PaymentTypesProps {
  onClickCard: () => void;
  onClickPix: () => void;
  onClickCash: () => void;
  valueCard: boolean;
  valuePix: boolean;
  valueCash: boolean;
}

const RenderPaymentTypes = (props: PaymentTypesProps) => {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      columnGap="20%"
    >
      <PaymentOption
        onClick={props.onClickCard}
        title={"Cartão de Crédito"}
        selected={props.valueCard}
      >
        <CreditCardIcon className="icon" />
      </PaymentOption>
      <PaymentOption
        onClick={props.onClickPix}
        title="Pix/Transferência"
        selected={props.valuePix}
      >
        <PixIcon className="icon" />
      </PaymentOption>
      <PaymentOption
        onClick={props.onClickCash}
        title="Á vista"
        selected={props.valueCash}
      >
        <PaymentsIcon className="icon" />
      </PaymentOption>
    </Box>
  );
};

export const PaymentOption = styled(IconButton)<{ selected: boolean }>`
  border-radius: 4px;
  border: 1px solid var(--dark-blue);
  padding: 0 4px;
  background-color: ${({ selected }) =>
    selected ? "var(--dark-blue)" : "white"};
  color: ${({ selected }) => (!selected ? "var(--dark-blue)" : "white")};
  :hover {
    background-color: orangered;
  }
  .icon {
    font-size: 30px;
  }
`;

export default RenderPaymentTypes;
