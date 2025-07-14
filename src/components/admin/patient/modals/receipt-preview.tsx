/* eslint-disable @next/next/no-img-element */
import React from "react";
import CModal from "@/components/modal";
import UserData from "@/atoms/userData";
import PatientData from "@/atoms/patient";
import DoneOutlineIcon from "@mui/icons-material/DoneOutline";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Box, Button, Stack, styled, Typography } from "@mui/material";
import { parseToothRegion } from "@/services/services";
import { PaymentShapeTypes, ReceiptValues } from "types/payments";
import { useRecoilValue } from "recoil";
import { BankInformationsTable } from "@/components/table/bank-informations";

interface ReceiptPreviewProps {
  visible: any;
  closeModal: any;
  receiptValues?: ReceiptValues | null;
  onSubmit: () => void;
}

export const parseToBrl = (val?: number) => {
  return val?.toLocaleString("pt-br", {
    style: "currency",
    currency: "BRL",
  });
};

const ReceiptPreview = (props: ReceiptPreviewProps) => {
  const { closeModal, visible, receiptValues, onSubmit } = props;
  const patientData = useRecoilValue(PatientData);
  const adminData = useRecoilValue(UserData);
  const patient = patientData?.attributes;
  const payShapes = receiptValues?.paymentShapes;

  const getTotal = receiptValues!.totalValue!.toLocaleString("pt-br", {
    style: "currency",
    currency: "BRL",
  });

  const colorBlue = { sx: { color: "var(--dark-blue)" } };

  const parseShape = (shape: PaymentShapeTypes) => {
    if (shape === "BANK_CHECK") return "Cheque";
    if (shape === "CASH") return "Dinheiro";
    if (shape === "CREDIT_CARD") return "Cartão de Crédito";
    if (shape === "DEBIT_CARD") return "Cartão de Débito";
    if (shape === "PIX") return "Transferência Pix";
    if (shape === "TRANSFER") return "Transferência Bancária TED/DOC";
    if (shape === "WALLET_CREDIT") return "Crédito de Carteira";
  };

  return (
    <CModal
      visible={visible}
      closeModal={closeModal}
      styles={{
        height: "100vh",
        width: "90vw",
        overflowX: "auto",
        overflowY: "auto",
      }}
    >
      <Box
        display={"flex"}
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        minWidth={"100%"}
        flexDirection={"column"}
        overflow={"auto"}
      >
        <img
          src="/images/cemicLogo.png"
          alt="CEMIC LOGO"
          style={{ width: "50%", height: "100px" }}
        />

        <Typography variant="h4" textAlign={"center"} my={2}>
          Recibo
        </Typography>

        <Typography
          variant="subtitle1"
          fontWeight={"bold"}
          textAlign="left"
          m={1}
          width={"95%"}
          {...colorBlue}
        >
          Recebi de {patient?.name} a quantia de R$ {getTotal} referente a:
        </Typography>

        <Box my={2} width="100%">
          {receiptValues?.treatmentsForPayment.map((v, i: number) => (
            <Stack
              key={i}
              direction={"row"}
              width={"100%"}
              alignItems={"center"}
              justifyContent={"space-between"}
            >
              <Typography
                variant="subtitle1"
                textAlign="left"
                ml={3}
                my={0.5}
                pl={"16px"}
                textOverflow={"ellipsis"}
                overflow={"hidden"}
              >
                {`♦ Região ${parseToothRegion(v.attributes.region)} => ${
                  v.attributes.name
                }`}
              </Typography>

              <Line>
                <IconForward />
              </Line>

              <Typography>{parseToBrl(v.attributes.price)}</Typography>
            </Stack>
          ))}
        </Box>

        <Typography
          mt={1}
          variant="subtitle1"
          textAlign="left"
          pl={"16px"}
          width="100%"
          fontWeight="bold"
          {...colorBlue}
        >
          TOTAL: {getTotal}
        </Typography>

        {receiptValues?.paymentShapes?.length! > 0 && (
          <Typography
            variant="body2"
            textAlign="left"
            my={1}
            px={2}
            width="100%"
            {...colorBlue}
          >
            <b>Forma de Pagamento:</b> Sendo{" "}
            {payShapes?.length === 1 &&
              payShapes?.map((v) => {
                const valueAdditional = (v.price / 100) * v.creditAdditional!;
                if (v.shape === "CREDIT_CARD") {
                  return `pagos no ${parseShape(v.shape)} em ${v.split_times}x${
                    typeof v.creditAdditional === "string" &&
                    parseInt(v?.creditAdditional) > 0
                      ? `(${parseToBrl(v.price)} + ${parseToBrl(
                          v.creditAdditionalValue
                        )} (${v.creditAdditional}% de acréscimo))`
                      : ""
                  }`;
                } else if (v.shape === "BANK_CHECK") {
                  return `No ${parseShape(v.shape)} em ${
                    v.split_times
                  }x, sendo os cheques informados abaixo:`;
                } else if (v.shape === "WALLET_CREDIT") {
                  console.log({ v });
                  const payment = v.fundCredits?.attributes
                    ?.payment as unknown as StrapiRelation<
                    StrapiData<PaymentsInterface>
                  >;
                  const maxValue = parseToBrl(
                    v.fundCredits?.attributes.max_used_value
                  );
                  const price = parseToBrl(v.price);
                  const day = new Date(
                    payment.data.attributes.date
                  ).toLocaleDateString();
                  return `usado ${price} do crédito de ${maxValue} do paciente pago no dia ${day}`;
                } else return `No ${parseShape(v.shape)}`;
              })}
            {payShapes?.length! > 1 &&
              payShapes?.map((v, i) => {
                const hasSpace = i === payShapes?.length - 1 ? "" : " + ";
                const valueAdditional = (v.price / 100) * v.creditAdditional!;
                if (v.shape === "CREDIT_CARD") {
                  return ` ${parseToBrl(v.price)} no ${parseShape(
                    v.shape
                  )} em ${v.split_times}x${
                    typeof v.creditAdditional === "string" &&
                    parseInt(v?.creditAdditional) > 0
                      ? `(${parseToBrl(v.price)} + ${parseToBrl(
                          v.creditAdditionalValue
                        )} (${v.creditAdditional}% de acréscimo))`
                      : ""
                  }${hasSpace}`;
                } else if (v.shape === "BANK_CHECK") {
                  return `${parseToBrl(v.price)} no ${parseShape(v.shape)} em ${
                    v.split_times
                  }x, sendo os cheques informados abaixo${hasSpace}`;
                } else if (v.shape === "WALLET_CREDIT") {
                  const p = v.fundCredits?.attributes
                    ?.payment as unknown as StrapiRelation<
                    StrapiData<PaymentsInterface>
                  >;

                  const maxValue = parseToBrl(
                    v.fundCredits?.attributes.max_used_value
                  );
                  const price = parseToBrl(v.price);
                  const day = new Date(
                    p.data.attributes.date
                  ).toLocaleDateString();
                  return `usado ${price} do crédito de ${maxValue} do paciente pago no dia ${day}${hasSpace}`;
                } else {
                  return ` ${parseToBrl(v.price)} no(a) ${parseShape(
                    v.shape
                  )}${hasSpace}`;
                }
              })}
          </Typography>
        )}

        {receiptValues?.discount! > 0 && (
          <Typography variant="subtitle2">
            * Foi concedido para o paciente o desconto de{" "}
            {receiptValues?.discount}%
          </Typography>
        )}

        {receiptValues?.bankCheckInfos.length! > 0 && (
          <Box
            position={"relative"}
            display={"flex"}
            flexDirection={"column"}
            alignItems={"flex-start"}
            width={"100%"}
            px={2}
            my={1}
          >
            <Typography variant="h6" mb={1} {...colorBlue}>
              Cheques:
            </Typography>
            <BankInformationsTable items={receiptValues?.bankCheckInfos!} />
          </Box>
        )}

        <Typography
          variant="subtitle2"
          textAlign="left"
          m={1}
          pt={1}
          pl={"16px"}
          width="100%"
          {...colorBlue}
        >
          Estou ciente que em caso de desistência, será descontado 10% do valor
          do tratamento negociado
        </Typography>
        <Typography
          variant="body2"
          textAlign="justify"
          m={1}
          pl={"16px"}
          width="100%"
        >
          Qualquer divergência em relação ao valor do material e procedimento, é
          necessário retornar com o recibo na CEMIC. Paciente precisa trazer o
          recibo sempre que retornar na CEMIC para resolver qualquer assunto
        </Typography>

        <Typography
          m={1}
          variant="subtitle2"
          textAlign="right"
          width="100%"
          mt={5}
        >
          {adminData?.filial!}{" "}
          {receiptValues?.dateSelected?.toLocaleDateString()}
        </Typography>

        <Typography
          variant="subtitle1"
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
          variant="subtitle1"
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
        <Button
          endIcon={<DoneOutlineIcon />}
          onClick={onSubmit}
          fullWidth
          variant="contained"
          sx={{ my: 2 }}
        >
          Gerar Pagamento
        </Button>
      </Box>
    </CModal>
  );
};

const Line = styled(Box)`
  height: 1px;
  width: 50%;
  background-color: #d5d5d5;
  border-radius: 5rem;
  position: relative;
  margin: 0 1rem;
`;

const IconForward = styled(ArrowForwardIcon)`
  position: absolute;
  right: -10px;
  top: 50%;
  transform: translateY(-50%);
  margin-top: 1px;
`;

export default ReceiptPreview;
