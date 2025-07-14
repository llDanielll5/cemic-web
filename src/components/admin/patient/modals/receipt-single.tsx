/* eslint-disable @next/next/no-img-element */
import React from "react";
import PatientData from "@/atoms/patient";
import CModal from "@/components/modal";
import { BankInformationsTable } from "@/components/table/bank-informations";
import { ReceiptSingle } from "@/components/table/receipts-table";
import { Box, Button, Stack, Typography, styled } from "@mui/material";
import { useRecoilValue } from "recoil";
import { PaymentShapeTypes } from "types/payments";
import { parseToBrl } from "./receipt-preview";
import { parseToothRegion } from "@/services/services";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import UserData from "@/atoms/userData";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

interface ReceiptSingleProps {
  visible: boolean;
  closeModal: any;
  receiptSingleValues?: StrapiData<PaymentsInterface>;
}

const ReceiptSinglePatient = (props: ReceiptSingleProps) => {
  const { closeModal, visible, receiptSingleValues } = props;
  const patientData = useRecoilValue(PatientData);
  const patient = patientData?.attributes;
  const receipt = receiptSingleValues?.attributes;
  const payShapes = receiptSingleValues?.attributes?.payment_shapes;
  const adminData = useRecoilValue(UserData);
  const fundCredit = receipt?.fund_credit;

  console.log({ receipt });

  const getTotal = receipt?.total_value!.toLocaleString("pt-br", {
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
    if (shape === "WALLET_CREDIT") return "Carteira de Crédito";
  };

  return (
    <CModal
      visible={visible}
      closeModal={closeModal}
      styles={{
        overflowY: "auto",
        width: "90vw",
        height: "95vh",
        maxWidth: "800px",
        minWidth: "750px",
      }}
    >
      <Box
        display={"flex"}
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        flexDirection={"column"}
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
          {receipt?.description === null &&
            (
              receipt?.treatments as unknown as StrapiListRelation<
                StrapiData<PatientTreatmentInterface>
              >
            ).data.map((v, i: number) => (
              <Stack
                key={i}
                direction={"row"}
                width={"100%"}
                alignItems={"center"}
                justifyContent={"space-between"}
              >
                <Typography
                  variant="subtitle2"
                  textAlign="left"
                  ml={3}
                  my={0.5}
                  pl="16px"
                  maxWidth="max-content"
                  textOverflow="ellipsis"
                  overflow="hidden"
                  // whiteSpace="nowrap"
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

          {receipt?.description !== null && (
            <Typography
              variant="subtitle2"
              textAlign="left"
              ml={3}
              my={0.5}
              pl={"16px"}
            >
              - {receipt?.description}
            </Typography>
          )}
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

        {receipt?.payment_shapes?.length! > 0 && (
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
              payShapes?.map((v: PaymentShapesInterface) => {
                const valueAdditional = (v.price / 100) * v.creditAdditional!;
                if (v.shape === "CREDIT_CARD") {
                  return `pagos ${parseToBrl(v.price)} no ${parseShape(
                    v.shape
                  )} em ${v.split_times}x${
                    typeof v.creditAdditional === "number" &&
                    v?.creditAdditional > 0
                      ? ` (C/ ${
                          v.creditAdditional
                        }% de acréscimo + ${parseToBrl(valueAdditional)})`
                      : ""
                  }`;
                } else if (v.shape === "WALLET_CREDIT") {
                  return (
                    v.fundCredits?.attributes
                      ?.payment as unknown as StrapiRelation<
                      StrapiData<PaymentsInterface>
                    >
                  ).data.attributes.payment_shapes.map(
                    (w: PaymentShapesInterface, index: number) => {
                      const p = v.fundCredits?.attributes
                        ?.payment as unknown as StrapiRelation<
                        StrapiData<PaymentsInterface>
                      >;
                      const paymentId = p.data.id;
                      const payment = p.data.attributes;
                      const equalsValue = v.price === payment.total_value;
                      const valueAdditional =
                        (w.price / 100) * w.creditAdditional!;

                      if (w.shape === "CREDIT_CARD") {
                        return `${
                          equalsValue
                            ? "No"
                            : `${parseToBrl(v.price)} de ${parseToBrl(
                                (payment.total_value -
                                  v.fundCredits?.attributes
                                    ?.used_value!) as number
                              )} do`
                        } ${parseShape(w.shape)} em ${w.split_times}x${
                          typeof w.creditAdditional === "string" &&
                          parseInt(w?.creditAdditional) > 0
                            ? ` (C/ ${
                                w.creditAdditional
                              }% de acréscimo + ${parseToBrl(valueAdditional)})`
                            : ""
                        } do crédito do paciente do dia ${new Date(
                          payment.date
                        ).toLocaleDateString()}`;
                      } else if (w.shape === "BANK_CHECK") {
                        return `No ${parseShape(w.shape)} em ${
                          w.split_times
                        }x, sendo os cheques informados abaixo:`;
                      } else
                        return `
                                        ${
                                          equalsValue
                                            ? "No"
                                            : `${parseToBrl(
                                                v.price
                                              )} de ${parseToBrl(
                                                (payment.total_value -
                                                  v.fundCredits?.attributes
                                                    ?.used_value!) as number
                                              )}`
                                        } no ${parseShape(
                          w.shape
                        )} do crédito do paciente do dia ${new Date(
                          payment.date
                        ).toLocaleDateString()}`;
                    }
                  );
                } else if (v.shape === "BANK_CHECK") {
                  return `pagos no ${parseShape(v.shape)} em ${
                    v.split_times
                  }x, sendo os cheques informados abaixo:`;
                } else return `pagos no(a) ${parseShape(v.shape)}`;
              })}
            {payShapes?.length! > 1 &&
              payShapes?.map((v: PaymentShapesInterface, i: number) => {
                const hasSpace = i === payShapes?.length - 1 ? "" : " + ";

                if (v.shape === "CREDIT_CARD") {
                  return `pagos ${parseToBrl(v.price)} no ${parseShape(
                    v.shape
                  )} em ${v.split_times}x${
                    typeof v.creditAdditional === "number" &&
                    v?.creditAdditional > 0
                      ? ` (C/ ${
                          v.creditAdditional
                        }% de acréscimo + ${parseToBrl(
                          v.creditAdditionalValue
                        )})`
                      : ""
                  }${hasSpace}`;
                } else if (v.shape === "WALLET_CREDIT") {
                  for (let i = 0; i < receipt?.payment_shapes?.length!; i++) {
                    const w = receipt?.payment_shapes[i];
                    if (!w) return ``;

                    const price = parseToBrl(w!.price);

                    const paymentsUseds =
                      (receipt?.fund_useds as StrapiListRelationData<FundCreditsInterface>) ??
                      [];

                    if (paymentsUseds.data.length === 0) return;

                    const pUseds = paymentsUseds.data;
                    // const pay = p.attributes
                    //   .payment as StrapiRelationData<PaymentsInterface>;

                    return pUseds.flatMap((p) => {
                      const maxValue = parseToBrl(p.attributes.max_used_value);
                      const value = p.attributes.used_value;
                      const paymentt = p.attributes
                        .payment as StrapiRelationData<PaymentsInterface>;

                      return `usados ${price} do crédito de ${maxValue} pagos pelo paciente no dia ${new Date(
                        paymentt.data.attributes.date
                      ).toLocaleDateString()}${hasSpace}`;
                    });
                  }
                } else if (v.shape === "BANK_CHECK") {
                  return `pagos ${parseToBrl(v.price)} no ${parseShape(
                    v.shape
                  )} em ${
                    v.split_times
                  }x, sendo os cheques informados abaixo${hasSpace}`;
                } else
                  return `pagos ${parseToBrl(v.price)} no(a) ${parseShape(
                    v.shape
                  )}${hasSpace}`;
              })}
          </Typography>
        )}

        {receipt?.discount! > 0 && (
          <Typography variant="subtitle2">
            * Foi concedido para o paciente o desconto de {receipt?.discount}%
          </Typography>
        )}

        {/* {receiptValues?.bankCheckInfos.length! > 0 && (
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
        )} */}

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
          {adminData?.filial}{" "}
          {new Date(receipt?.date as unknown as string).toLocaleDateString()}
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

        <StyledButton
          endIcon={<LocalPrintshopIcon />}
          onClick={() => window.print()}
        >
          Imprimir Recibo
        </StyledButton>
      </Box>
    </CModal>
  );
};

const StyledButton = styled(Button)`
  :hover {
    opacity: 0.3;
  }
  :active {
    opacity: 0;
  }
`;

const Line = styled(Box)`
  height: 1px;
  width: max-content;
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

export default ReceiptSinglePatient;
