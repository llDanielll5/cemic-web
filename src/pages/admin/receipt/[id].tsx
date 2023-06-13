/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect, useCallback } from "react";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import { Box, styled, Typography, Button, IconButton } from "@mui/material";
import { parseDateIso } from "@/services/services";
import { TreatmentPlanInterface } from "types";
import { db } from "@/services/firebase";
import { useRouter } from "next/router";
import { ReceiptProps } from "types";
import { PaymentTypes } from "types";
import Loading from "@/components/loading";
import ReplyIcon from "@mui/icons-material/Reply";
import {
  Timestamp,
  collection,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";

const receiptRef = collection(db, "receipts");
const clientRef = collection(db, "clients");

const ReceiptPage = () => {
  const router = useRouter();
  const id = router.query.id;
  const [receiptData, setReceiptData] = useState<ReceiptProps | null>(null);
  const [patientData, setPatientData] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);

  const parseDate = (t: Timestamp) => {
    return t.toDate().toISOString().substring(0, 10);
  };

  const getReceiptData = useCallback(async () => {
    setIsLoading(true);
    const q = query(receiptRef, where("id", "==", id));
    const getReceipt = async () => {
      onSnapshot(q, (querySnapshot) => {
        if (querySnapshot.docs.length > 0) {
          const result: any = querySnapshot.docs[0].data();
          setReceiptData(result);
          setIsLoading(false);
        } else {
          setIsLoading(false);
          alert("Recibo não encontrado");
          router.back();
        }
      });
    };
    getReceipt();
  }, [id]);

  useEffect(() => {
    if (id) getReceiptData();
  }, [getReceiptData, id]);

  useEffect(() => {
    if (receiptData === null) return;

    function getPatientData() {
      setIsLoading(true);
      const q = query(clientRef, where("id", "==", receiptData?.patientId!));
      const getPatient = async () => {
        onSnapshot(q, (querySnapshot) => {
          if (querySnapshot.docs.length > 0) {
            const result: any = querySnapshot.docs[0].data();
            setPatientData(result);
            setIsLoading(false);
            return;
          } else {
            setIsLoading(false);
            alert("paciente não encontrado");
            router.back();
            return;
          }
        });
      };
      getPatient();
    }

    getPatientData();
  }, [receiptData]);

  const parsedPaymentTypeText = (type: PaymentTypes | null) => {
    if (type === "credit") return "Cartão de Crédito";
    if (type === "pix") return "Pix/Transferência bancária";
    if (type === "cash") return "dinheiro";
  };

  if (receiptData === null)
    return (
      <Box position={"absolute"}>
        {isLoading && <Loading message="Carregando informações" />}
      </Box>
    );
  else
    return (
      <Box
        display={"flex"}
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        position="relative"
        width="100%"
        flexDirection={"column"}
        minWidth={"500px"}
        maxWidth={"800px"}
        mx={"auto"}
        py={2}
        px={3}
      >
        <IconBack onClick={() => router.back()}>
          <ReplyIcon fontSize={"large"} color="error" />
        </IconBack>
        <img
          src="/images/cemicLogo.png"
          alt="CEMIC LOGO"
          style={{ width: "50%", height: "100px" }}
        />

        <Typography variant="bold" textAlign={"center"} m={2}>
          Recibo
        </Typography>

        <Typography variant="body2" textAlign="left" m={1} width={"95%"}>
          Recebi de {patientData?.name} a quantia de R$ {receiptData.totalStr}{" "}
          referente a:
        </Typography>

        {receiptData.negotiateds.map((v: TreatmentPlanInterface, i: number) => (
          <Typography
            key={i}
            variant="body2"
            textAlign="left"
            m={1}
            pl={"16px"}
            width="100%"
          >
            ·{v.region} - {`${v.treatments.name} ==> R$ ${v.treatments.price}`}
          </Typography>
        ))}

        <Typography
          variant="semibold"
          textAlign="left"
          m={1}
          pl={"16px"}
          width="100%"
        >
          TOTAL: R$ {receiptData.totalStr}
        </Typography>

        {receiptData.paymentShape.length <= 1 ? (
          receiptData.paymentShape.map((v, i) => (
            <Typography key={i} variant="body2" textAlign="left" m={1}>
              Pagos no {parsedPaymentTypeText(v.type)}{" "}
              {v.type === "credit" && `em ${"vezes"}`}
              {v.type === "cash" && `com ${"discount"}% de desconto`}
            </Typography>
          ))
        ) : (
          <Typography variant="body2" textAlign="left" m={1}>
            Sendo pagos{" "}
            {receiptData.paymentShape.map(
              (v, i) =>
                `R$${v.valueStr} no ${parsedPaymentTypeText(v?.type)}${
                  i == receiptData.paymentShape.length - 1 ? "." : ", "
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
          Em caso de desistência, será descontado 10% do valor pago
        </Typography>
        <Typography
          variant="semibold"
          textAlign="justify"
          m={1}
          pl={"16px"}
          width="100%"
        >
          Estou ciente de que o pagamento de meus implantes, não estão inclusas
          as próteses definitivas, da qual somente estarei fazendo no tempo
          determinado pelo dentista e pagando na data proposta pelo dentista
        </Typography>

        <Typography m={1} variant="semibold" textAlign="right" width="100%">
          Brasília {parseDateIso(parseDate(receiptData.timestamp))}
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

        <Button50
          endIcon={<LocalPrintshopIcon />}
          onClick={() => window.print()}
        >
          Imprimir Recibo
        </Button50>
      </Box>
    );
};

const Button50 = styled(Button)`
  width: 50%;
  align-self: center;
  margin: 8px 0;
  color: white;
  background-color: var(--dark-blue);
  @media screen and (max-width: 900px) {
    width: 90%;
  }
  :hover {
    background-color: var(--dark-blue);
    opacity: 0;
  }
`;

const IconBack = styled(IconButton)`
  position: absolute;
  top: 8px;
  left: 8px;
`;

export default ReceiptPage;
