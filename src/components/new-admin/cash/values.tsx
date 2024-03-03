//@ts-nocheck

import React from "react";
import { Box, Typography } from "@mui/material";
import { getCreditDiscount } from "@/services/services";

interface CashierValuesInterface {
  cash: any;
  credit: any;
  out: any;
  debit: any;
  pix: any;
  total: any;
}

const textStyle = {
  backgroundColor: "white",
  padding: ".5rem 1rem",
  borderRadius: 2,
  border: "1.5px solid #e4e4e4",
};

const CashierValues = (props: CashierValuesInterface) => {
  const { cash, credit, out, debit, pix, total } = props;

  const getBRLValue = (val: string) => {
    return parseFloat(val).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  return (
    <Box
      display="grid"
      flexDirection={"column"}
      border={"1.4px solid #f5f5f5"}
      sx={{ backgroundColor: "#f5f5f5" }}
      columnGap={1}
      rowGap={2}
      borderRadius={4}
      px={4}
      py={2}
      mt={2}
    >
      <Typography variant="h5" textAlign={"center"} color="goldenrod">
        Movimentação do Ano
      </Typography>
      <Box
        display={"flex"}
        flexDirection={"row"}
        justifyContent={"space-between"}
        width="100%"
      >
        <Typography variant="subtitle2">
          Dinheiro: <b>{getBRLValue(cash)}</b>
        </Typography>
        <Typography variant="subtitle2">
          Débito: <b> {getBRLValue(debit)}</b>
        </Typography>
        <Typography variant="subtitle2">
          Crédito:{" "}
          <b>
            {" "}
            {getBRLValue(credit)}{" "}
            {`(${getBRLValue(getCreditDiscount(credit))})`}
          </b>
        </Typography>
      </Box>

      <Box display="flex" justifyContent={"space-between"} width="100%">
        <Typography variant="subtitle2">
          Pix: <b> {getBRLValue(pix)}</b>
        </Typography>
        <Typography variant="subtitle2" color="red">
          Saída: <b> {getBRLValue(out)}</b>
        </Typography>
        <Typography variant="subtitle2" color="black" sx={textStyle}>
          Total: <b> {getBRLValue(total)}</b>
        </Typography>
      </Box>
    </Box>
  );
};

export default CashierValues;
