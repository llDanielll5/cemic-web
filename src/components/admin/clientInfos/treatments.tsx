//@ts-nocheck
import React, { useState, useEffect, useCallback } from "react";
import { StyledButton } from "@/components/dynamicAdminBody/receipts";
import {
  ClientTreatmentsProps,
  ClientType,
  PaymentShape,
  PaymentTypes,
  ReceiptProps,
} from "types";
import { Box, Typography } from "@mui/material";
import { useRecoilValue } from "recoil";
import { db } from "@/services/firebase";
import * as F from "firebase/firestore";
import Link from "next/link";
import Modal from "@/components/modal";
import UserData from "@/atoms/userData";
import HistoryIcon from "@mui/icons-material/History";
import TreatmentPlanUpdate from "@/components/dynamicProfBody/screening/details/treatmentPlan";
import ModalPaymentAdmin from "@/components/dynamicAdminBody/screening/modalPayment";
import ReceiptAdmin from "@/components/dynamicAdminBody/screening/receipt";
import { maskValue } from "@/services/services";
import AddTreatment from "./addTreatment";

interface ClientTreatmentsInterface {
  client: ClientType;
}

export interface PaymentShapesArray {
  paymentType: PaymentTypes | null;
  value: number;
  valueStr: string;
}

interface ReceiptValuesProps {
  total: string;
  patientName: string;
  date: string;
  treatments: any[];
}

type ReceiptType = ReceiptValuesProps | null;
type PayShapeArr = PaymentShapesArray[];

const ClientInfosTreatments = (props: ClientTreatmentsInterface) => {
  const { client } = props;
  const [vezes, setVezes] = useState("");
  const userData = useRecoilValue(UserData);
  const [discount, setDiscount] = useState(5);
  const [totalValue, setTotalValue] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [negotiateds, setNegotiateds] = useState<any[]>([]);
  const [receiptVisible, setReceiptVisible] = useState(false);
  const [totalValueString, setTotalValueString] = useState("");
  const [allValue, setAllValue] = useState<string | null>(null);
  const [paymentModal, setPaymentModal] = useState<boolean>(false);
  const [treatmentsToPay, setTreatmentsToPay] = useState<any[]>([]);
  const [paymentShapesValues, setPaymentShapesValues] = useState("");
  const [addTreatmentVisible, setAddTreatmentVisible] = useState(false);
  const [paymentType, setPaymentType] = useState<PaymentTypes | null>(null);
  const [receiptValues, setReceiptValues] = useState<ReceiptType>(null);
  const [paymentShapesArr, setPaymentsShapesArr] = useState<PayShapeArr>([]);
  const [treatments, setTreatments] = useState<ClientTreatmentsProps | null>(
    null
  );
  const [actualProfessional, setActualProfessional] = useState<any | null>(
    null
  );

  const getUserTreatments = useCallback(async () => {
    const ref = F.collection(db, "clients_treatments");
    const q = F.query(ref, F.where("client", "==", client?.id));

    const querySnapshot = await F.getDocs(q);

    if (querySnapshot.docs.length > 0) {
      const document: any = querySnapshot.docs[0].data();
      return setTreatments(document);
    } else return;
  }, [client?.id]);

  const getActualProfessional = useCallback(async () => {
    const ref = F.collection(db, "professionals");
    const q = F.query(ref, F.where("id", "==", treatments?.actualProfessional));

    const querySnapshot = await F.getDocs(q);

    if (querySnapshot.docs.length > 0) {
      const document: any = querySnapshot.docs[0].data();
      return setActualProfessional(document);
    } else return;
  }, [treatments]);

  const handleCloseAddTreatment = () => {
    setAddTreatmentVisible(false);
  };

  const handleSubmitTreatment = async (field: string, values: any[]) => {
    let reduced: any[] = [];
    setIsLoading(true);
    if (treatments?.treatments?.treatment_plan.length > 0) {
      let newArr = [...treatments?.treatments?.treatment_plan, ...values];
      newArr.forEach((item) => {
        var duplicated =
          reduced.findIndex((val) => {
            return (
              item.region === val.region &&
              item.treatments.cod === val.treatments.cod &&
              item.treatments.cod !== "00002" &&
              val.treatments.cod !== "00002"
            );
          }) > -1;

        if (!duplicated) {
          reduced.push(item);
        }
      });

      const ref = F.doc(db, "clients_treatments", treatments!.id);

      return await F.updateDoc(ref, {
        "treatments.treatment_plan": F.arrayUnion(...reduced),
      })
        .then(async () => {
          const ref = F.doc(db, "clients", treatments!.client);
          return await F.updateDoc(ref, { role: "patient" })
            .then(() => {
              setIsLoading(false);
              handleCloseAddTreatment();
              return alert("Tratamento atualizado!");
            })
            .catch(() => setIsLoading(false));
        })
        .catch((err) => {
          setIsLoading(false);
          return alert("Erro ao atualizar tratamento");
        });
    } else {
      reduced = [...values];

      const ref = F.doc(
        db,
        "clients_treatments",
        `${client!.id}-${F.Timestamp.now().seconds}`
      );

      return await F.setDoc(ref, {
        treatments: { treatment_plan: values, realizeds: [], forwardeds: [] },
        client: client!.id,
        updatedAt: F.Timestamp.now(),
        actualProfessional: "",
        screeningId: "",
        professionalScreening: "",
        medias: [],
        negotiateds: [],
        id: `${client!.id}-${F.Timestamp.now().seconds}`,
      })
        .then(async () => {
          const ref = F.doc(db, "clients", client!.id);
          return await F.updateDoc(ref, { role: "patient" })
            .then(() => {
              setIsLoading(false);
              handleCloseAddTreatment();
              return alert("Tratamento atualizado!");
            })
            .catch(() => setIsLoading(false));
        })
        .catch((err) => {
          setIsLoading(false);
          return alert("Erro ao atualizar tratamento");
        });
    }
  };

  const getTotalValue = useCallback(
    (arr: { region: string; treatments: any }[]) => {
      const prices: number[] = [];

      const arrMap = arr?.flatMap((v) =>
        prices.push(parseFloat(v?.treatments?.price.replaceAll(".", "")))
      );

      if (arrMap.length > 0) {
        let reduced = prices?.reduce(
          (prev, curr) =>
            parseFloat(prev.toFixed(2)) + parseFloat(curr.toFixed(2))
        );

        if (paymentType === "cash") {
          let discounted = (reduced * discount) / 100;
          if (!discount) {
            reduced = reduced;
          } else reduced -= discounted;

          setTotalValue(parseFloat(reduced.toFixed(2)));
          setTotalValueString(reduced.toFixed(2));
          return;
        } else if (paymentType === "credit") {
          let percent = (reduced * 10) / 100;
          reduced += percent;
          setTotalValue(parseFloat(reduced.toFixed(2)));
          setTotalValueString(reduced.toFixed(2));
          return;
        } else {
          setTotalValue(parseFloat(reduced.toFixed(2)));
          setTotalValueString(reduced.toFixed(2));
          return;
        }
      } else return;
    },
    [paymentType, discount]
  );

  useEffect(() => {
    getTotalValue(negotiateds);
  }, [getTotalValue, negotiateds]);

  useEffect(() => {
    if (client?.id === "" || client?.id === null || client?.id === undefined)
      return;
    getUserTreatments();
  }, [client?.id, getUserTreatments]);

  useEffect(() => {
    if (
      treatments?.actualProfessional === "" ||
      treatments?.actualProfessional === null ||
      treatments?.actualProfessional === undefined
    )
      return;
    getActualProfessional();
  }, [getActualProfessional, treatments?.actualProfessional]);

  const handleGeneratePayment = () => {
    const treats = treatments?.treatments?.treatment_plan;
    const neg = treatments?.negotiateds;

    let reduced = [];
    treats.forEach((item) => {
      var duplicated =
        neg.findIndex((val) => {
          return (
            item.region === val.region &&
            item.treatments.cod === val.treatments.cod
          );
        }) > -1;

      if (!duplicated) {
        reduced.push(item);
      }
    });

    setTreatmentsToPay(reduced);
    setPaymentModal(true);
  };

  const hasTreatmentPlan = treatments?.treatments?.treatment_plan?.length > 0;
  const hasRealizeds = treatments?.treatments?.realizeds?.length > 0;

  const onCloseModalPayment = () => {
    setPaymentShapesValues("");
    setPaymentsShapesArr([]);
    setPaymentModal(false);
    setTreatmentsToPay([]);
    setPaymentType(null);
    setNegotiateds([]);
    setAllValue(null);
    setDiscount(5);
    setVezes("");
    return;
  };

  const handleCloseReceiptVisible = () => {
    setReceiptValues(null);
    setReceiptVisible(false);
    return;
  };

  const money = totalValueString.replace(".", "");
  const masked = maskValue(money);

  const handleViewPayment = async () => {
    if (discount > 8 || discount < 5)
      return alert("Desconto não liberado no sistema");

    const totalValue = masked;
    const patientName = client?.name;
    const dateNow = new Date().toLocaleDateString("pt-br");
    const treatmentsString = negotiateds.flatMap(
      (v) =>
        `·${v?.region} - ${v?.treatments?.name} ==> R$ ${maskValue(
          v?.treatments?.price
        )}`
    );

    setReceiptValues({
      total: totalValue,
      patientName,
      date: dateNow,
      treatments: treatmentsString,
    });
    setReceiptVisible(true);
    return;
  };

  const handleFinishPayment = async () => {
    setIsLoading(true);
    const dateNow = F.Timestamp.now();
    let paymentShape: PaymentShape[] = [];

    if (paymentType !== null) {
      paymentShape = [
        { type: paymentType, value: totalValue, valueStr: totalValueString },
      ];
    } else {
      let formatShapes: any[] = paymentShapesArr.map((v) => ({
        type: v.paymentType,
        value: v.value,
        valueStr: v.valueStr,
      }));
      paymentShape = formatShapes;
    }

    let generateId = `${client.id!}-${dateNow.seconds}`;

    const receiptData: ReceiptProps = {
      negotiateds,
      paymentShape,
      timestamp: dateNow,
      screeningId: "",
      patientId: client?.id,
      paymentId: generateId,
      id: generateId,
      total: totalValue,
      totalStr: totalValueString,
    };

    const paymentData = {
      id: generateId,
      patientId: client?.id,
      receiptId: generateId,
      shape: paymentShape,
      total: totalValue,
      totalStr: totalValueString,
    };

    const receiptRef = F.doc(db, "receipts", generateId);
    const paymentsRef = F.doc(db, "payments", generateId);
    const clientTreatmentRef = F.doc(db, "clients_treatments", treatments!.id);

    const handleSuccess = async () => {
      const ref = F.doc(db, "clients", client!.id);
      return await F.updateDoc(ref, { role: "patient" })
        .then(async () => {
          return await F.updateDoc(clientTreatmentRef, {
            negotiateds: F.arrayUnion(...negotiateds),
          })
            .then(() => {
              setIsLoading(false);
              onCloseModalPayment();
              return;
            })
            .catch((err) => {
              setIsLoading(false);
            });
        })
        .catch(() => {
          setIsLoading(false);
          return alert("Erro ao atualizar o paciente");
        });
    };

    await F.setDoc(receiptRef, receiptData)
      .then(async () => {
        await F.setDoc(paymentsRef, paymentData).then(handleSuccess, (err) => {
          setIsLoading(false);
          return alert(err + " Deu erro");
        });
      })
      .catch((err) => {
        setIsLoading(false);
        return alert("Deu erro ao criar o recibo");
      });

    return;
  };

  return (
    <Box py={2} width="100%">
      <Modal visible={addTreatmentVisible} closeModal={handleCloseAddTreatment}>
        <TreatmentPlanUpdate
          onSaveTreatments={handleSubmitTreatment}
          setVisible={setAddTreatmentVisible}
        />
      </Modal>

      <Modal visible={paymentModal} closeModal={onCloseModalPayment}>
        <ModalPaymentAdmin
          vezes={vezes}
          allValue={allValue}
          discount={discount}
          setVezes={setVezes}
          totalValue={totalValue}
          setAllValue={setAllValue}
          negotiateds={negotiateds}
          paymentType={paymentType}
          setDiscount={setDiscount}
          setTotalValue={setTotalValue}
          setNegotiateds={setNegotiateds}
          setPaymentType={setPaymentType}
          treatmentsToPay={treatmentsToPay}
          paymentShapesArr={paymentShapesArr}
          totalValueString={totalValueString}
          handleViewPayment={handleViewPayment}
          setTreatmentsToPay={setTreatmentsToPay}
          onCloseModalPayment={onCloseModalPayment}
          setTotalValueString={setTotalValueString}
          setPaymentShapesArr={setPaymentsShapesArr}
          paymentShapesValues={paymentShapesValues}
          setPaymentShapesValues={setPaymentShapesValues}
        />
      </Modal>

      <Modal visible={receiptVisible} closeModal={handleCloseReceiptVisible}>
        <ReceiptAdmin
          receiptValues={receiptValues}
          onSubmit={handleFinishPayment}
          paymentShapesArr={paymentShapesArr}
          paymentShapesValues={paymentShapesValues}
          paymentType={paymentType}
          discount={discount}
          vezes={vezes}
        />
      </Modal>

      {treatments !== null && (
        <>
          <Box>
            {actualProfessional !== null ? (
              <Typography variant="bold">
                Atual Dentista: {actualProfessional?.name ?? ""}
              </Typography>
            ) : (
              <Typography variant="bold">Sem dentista atualmente</Typography>
            )}
          </Box>
          <Typography variant="bold">
            Plano de Tratamento do paciente:
          </Typography>
          <Box
            border="1.3px solid var(--dark-blue)"
            p={1}
            borderRadius={2}
            my={1}
          >
            {hasTreatmentPlan &&
              treatments?.treatments?.treatment_plan?.map((v, i) => (
                <Box
                  key={i}
                  display={"flex"}
                  alignItems={"center"}
                  columnGap={"4px"}
                  width={"100%"}
                  my={"4px"}
                >
                  <Typography variant="semibold">{v?.region} - </Typography>
                  <Typography variant="semibold">
                    {v?.treatments?.name}
                  </Typography>
                </Box>
              ))}
            {!hasTreatmentPlan && (
              <Typography variant="semibold">
                Sem plano de Tratamento
              </Typography>
            )}
          </Box>

          <Typography variant="bold">Tratamentos já realizados:</Typography>
          <Box
            border="1.3px solid var(--dark-blue)"
            p={1}
            borderRadius={2}
            mt={1}
          >
            {hasRealizeds &&
              treatments?.treatments?.realizeds?.map((v, i) => (
                <Box
                  key={i}
                  display={"flex"}
                  alignItems={"center"}
                  columnGap={"4px"}
                  width={"100%"}
                  my={"4px"}
                >
                  <Typography variant="semibold">{v?.region} - </Typography>
                  <Typography variant="semibold">
                    {v?.treatments?.name}
                  </Typography>
                </Box>
              ))}
            {!hasRealizeds && (
              <Typography variant="semibold">
                Sem Tratamentos concluídos
              </Typography>
            )}
          </Box>

          <Box display="flex" flexDirection="column" alignItems="center" mt={1}>
            <Typography variant="semibold">
              Verificar histórico de encaminhamentos
            </Typography>
            <Link
              passHref
              target="_blank"
              href={`/admin/treatment-history/${treatments?.client}`}
            >
              <StyledButton endIcon={<HistoryIcon />}>Histórico</StyledButton>
            </Link>
          </Box>
        </>
      )}

      <AddTreatment
        handleGeneratePayment={handleGeneratePayment}
        openModal={() => setAddTreatmentVisible(true)}
        treatments={treatments}
      />
    </Box>
  );
};

export default ClientInfosTreatments;
