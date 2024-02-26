import React from "react";
import AddIcon from "@mui/icons-material/Add";
import { Box, Button, Typography, styled } from "@mui/material";

interface CashierButtonsProps {
  cashierData: any;
  onAddInformations: () => void;
  onOpenCashier: () => void;
  onCloseCashier: () => void;
}

const CashierButtons = (props: CashierButtonsProps) => {
  const { cashierData, onAddInformations, onOpenCashier, onCloseCashier } =
    props;

  const colorCashierInfo =
    cashierData === null
      ? "orange"
      : cashierData.attributes.hasClosed
      ? "green"
      : "red";
  const cashierInfo =
    cashierData === null
      ? "Caixa não aberto"
      : cashierData.attributes.hasClosed
      ? "Caixa fechado"
      : "Caixa não fechado";

  return (
    <ButtonsContainer>
      <Typography
        width={"100%"}
        variant="subtitle1"
        fontWeight={"bold"}
        color={colorCashierInfo}
      >
        {cashierInfo}
      </Typography>
      <Buttons>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onAddInformations}
        >
          Add
        </Button>
        {cashierData === null && (
          <Button variant="contained" color={"success"} onClick={onOpenCashier}>
            Abrir Caixa
          </Button>
        )}
        {cashierData !== null && (
          <Button
            variant="contained"
            color={"warning"}
            onClick={onCloseCashier}
          >
            Fechar Caixa
          </Button>
        )}
      </Buttons>
    </ButtonsContainer>
  );
};

const ButtonsContainer = styled(Box)`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;

  @media screen and (max-width: 760px) {
    flex-direction: column;
    row-gap: 1rem;
  }
`;
const Buttons = styled(Box)`
  display: flex;
  justify-content: flex-end;
  width: 100%;
  column-gap: 1rem;

  @media screen and (max-width: 760px) {
    justify-content: flex-start;
  }
`;

export default CashierButtons;
