/* eslint-disable @next/next/no-img-element */
import React from "react";
import { Box, Typography } from "@mui/material";
import { Button50, PaymentShapesArray } from "./screeningDetails";
import { PaymentTypes } from "types";
import DoneOutlineIcon from "@mui/icons-material/DoneOutline";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";

interface ReceiptAdminProps {
  vezes: string;
  discount: number;
  receiptValues: any;
  onSubmit: () => void;
  paymentShapesValues: string;
  paymentType: PaymentTypes | null;
  paymentShapesArr: PaymentShapesArray[];
}

const ReceiptAdmin = (props: ReceiptAdminProps) => {
  const {
    vezes,
    discount,
    onSubmit,
    paymentType,
    receiptValues,
    paymentShapesArr,
    paymentShapesValues,
  } = props;
  const paymentTypeText = () => {
    if (paymentType === "credit") return "Cartão de Crédito";
    if (paymentType === "pix") return "Pix/Transferência bancária";
    if (paymentType === "cash") return "dinheiro";
  };

  const parsedPaymentTypeText = (type: PaymentTypes | null) => {
    if (type === "credit") return "Cartão de Crédito";
    if (type === "pix") return "Pix/Transferência bancária";
    if (type === "cash") return "dinheiro";
  };
  return (
    <Box
      display={"flex"}
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      width="100%"
      flexDirection={"column"}
    >
      <img
        src="/images/cemicLogo.png"
        alt="CEMIC LOGO"
        style={{ width: "50%", height: "100px" }}
      />

      <Typography variant="bold" textAlign={"center"} m={1}>
        Recibo
      </Typography>

      <Typography variant="body2" textAlign="left" m={1} width={"95%"}>
        Recebi de {receiptValues?.patientName} a quantia de R${" "}
        {receiptValues?.total} referente a:
      </Typography>

      {receiptValues?.treatments.map((v: any, i: number) => (
        <Typography
          key={i}
          variant="body2"
          textAlign="left"
          m={1}
          pl={"16px"}
          width="100%"
        >
          {v}
        </Typography>
      ))}

      <Typography
        variant="semibold"
        textAlign="left"
        m={1}
        pl={"16px"}
        width="100%"
      >
        TOTAL: R$ {receiptValues?.total}
      </Typography>

      {paymentShapesValues === "" ? (
        <Typography variant="body2" textAlign="left" m={1}>
          Pagos no {paymentTypeText()}{" "}
          {paymentType === "credit" && `em ${vezes}`}
          {paymentType === "cash" && `com ${discount}% de desconto`}
        </Typography>
      ) : (
        <Typography variant="body2" textAlign="left" m={1}>
          Sendo pagos{" "}
          {paymentShapesArr.map(
            (v, i) =>
              `R$${v.valueStr} no ${parsedPaymentTypeText(v?.paymentType)}${
                i == paymentShapesArr.length - 1 ? "." : ", "
              }`
          )}
        </Typography>
      )}

      <Typography
        variant="semibold"
        textAlign="left"
        m={1}
        pl={"16px"}
        width="100%"
      >
        Estou ciente que em caso de desistência, será descontado 10% do valor do
        tratamento negociado
      </Typography>
      <Typography
        variant="body1"
        textAlign="justify"
        m={1}
        pl={"16px"}
        width="100%"
      >
        Qualquer divergência em relação ao valor do material e procedimento, é
        necessário retornar com o recibo na CEMIC. Paciente precisa trazer o
        recibo sempre que retornar na CEMIC para resolver qualquer assunto
      </Typography>

      <Typography m={1} variant="semibold" textAlign="right" width="100%">
        Brasília {receiptValues?.date}
      </Typography>

      <Typography
        variant="semibold"
        textAlign="right"
        m={1}
        width="100%"
        display={"flex"}
        justifyContent={"flex-end"}
        flexDirection={"column"}
      >
        ____________________________
        <Typography variant="body1">Paciente</Typography>
      </Typography>

      <Typography
        variant="semibold"
        textAlign="right"
        m={1}
        width="100%"
        display={"flex"}
        justifyContent={"flex-end"}
        flexDirection={"column"}
      >
        ____________________________
        <Typography variant="body1">CEMIC</Typography>
      </Typography>

      {/* <Button50 endIcon={<LocalPrintshopIcon />} onClick={() => window.print()}>
        Imprimir Recibo
      </Button50> */}
      <Button50 endIcon={<DoneOutlineIcon />} onClick={onSubmit}>
        Gerar Pagamento
      </Button50>
    </Box>
  );
};

export default ReceiptAdmin;
