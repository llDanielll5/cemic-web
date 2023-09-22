import React, { useState, useEffect, useCallback } from "react";
import { StyledButton } from "@/components/dynamicAdminBody/receipts";
import { Box, Typography } from "@mui/material";
import { maskValue, parseDateIso } from "@/services/services";
import { useRecoilValue } from "recoil";
import { db } from "@/services/firebase";
import * as F from "firebase/firestore";
import Link from "next/link";
import Modal from "@/components/modal";
import UserData from "@/atoms/userData";
import AddTreatment from "./addTreatment";
import HistoryIcon from "@mui/icons-material/History";
import ReceiptAdmin from "@/components/dynamicAdminBody/screening/receipt";
import ModalPaymentAdmin from "@/components/dynamicAdminBody/screening/modalPayment";
import TreatmentPlanUpdate from "@/components/dynamicProfBody/screening/details/treatmentPlan";
import {
  ClientTreatmentsProps,
  ClientType,
  PaymentShape,
  PaymentTypes,
  ReceiptProps,
} from "types";
import { useOnSnapshotQuery } from "@/hooks/useOnSnapshotQuery";

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
  const adminData = useRecoilValue(UserData);
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
  const [negotiatedsToRealize, setNegotiatedsToRealize] = useState<any[]>([]);
  const [actualProfessional, setActualProfessional] = useState<any | null>(
    null
  );
  const refTreats = F.collection(db, "clients_treatments");
  const queryTreats = F.query(
    refTreats,
    F.where("client", "==", client?.id ?? "")
  );
  const snapUserTreatments = useOnSnapshotQuery(
    "clients_treatments",
    queryTreats,
    [client]
  );
  let clientTreatments = snapUserTreatments[0];
  let clientAdminTimestamp: F.Timestamp =
    clientTreatments?.updatedBy?.timestamp;

  const getActualProfessional = useCallback(async () => {
    if (client?.actualProfessional === "") return;

    const ref = F.collection(db, "professionals");
    const q = F.query(ref, F.where("id", "==", client?.actualProfessional));

    const querySnapshot = await F.getDocs(q);

    if (querySnapshot.docs.length > 0) {
      const document: any = querySnapshot.docs[0].data();
      return setActualProfessional(document);
    } else return;
  }, [client]);

  const handleCloseAddTreatment = () => {
    setAddTreatmentVisible(false);
  };

  const handleSubmitTreatment = async (field: string, values: any[]) => {
    let reduced: any[] = [];
    setIsLoading(true);
    if (clientTreatments?.treatments?.treatment_plan.length > 0) {
      let newArr = [...clientTreatments?.treatments?.treatment_plan, ...values];
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

      const ref = F.doc(db, "clients_treatments", clientTreatments!.id);

      return await F.updateDoc(ref, {
        "treatments.treatment_plan": F.arrayUnion(...reduced),
        "updatedBy.reporter": adminData?.id,
        "updatedBy.reporterName": adminData?.name,
        "updatedBy.timestamp": F.Timestamp.now(),
        "updatedBy.role": adminData?.role,
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
    } else {
      reduced = [...values];

      const ref = F.collection(db, "clients_treatments");

      return await F.addDoc(ref, {
        treatments: { treatment_plan: values },
        negotiateds: {
          payeds: [],
          realizeds: [],
          forwardeds: [],
          toRealize: [],
        },
        client: client!.id,
        updatedBy: {
          reporter: adminData?.id,
          reporterName: adminData?.name,
          timestamp: F.Timestamp.now(),
          role: adminData?.role,
        },
      })
        .then(async (queryDoc) => {
          const clientRef = F.doc(db, "clients", client!.id);
          await F.updateDoc(F.doc(db, "clients_treatments", queryDoc.id), {
            id: queryDoc.id,
          });
          return await F.updateDoc(clientRef, { role: "patient" })
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
    (
      arr: {
        region: string;
        treatments: { cod: string; name: string; price: string };
      }[]
    ) => {
      const prices: number[] = [];

      const arrMap = arr?.map((v) => {
        let hasPoint = v?.treatments?.price?.includes(".");
        if (hasPoint)
          prices.push(parseFloat(v?.treatments?.price.replaceAll(".", "")));
        else prices.push(parseFloat(v?.treatments?.price));
      });

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
    if (client?.actualProfessional !== "") return;
    getActualProfessional();
  }, [client?.actualProfessional, getActualProfessional]);

  const handleGeneratePayment = () => {
    if (!clientTreatments) return;
    const treats = clientTreatments?.treatments?.treatment_plan;
    const neg = clientTreatments?.negotiateds?.payeds;

    let reduced: any[] = [];
    treats.forEach((item: any) => {
      var duplicated =
        neg.findIndex((val: any) => {
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

  const hasTreatmentPlan =
    clientTreatments?.treatments?.treatment_plan?.length > 0;
  const hasRealizeds = clientTreatments?.negotiateds?.realizeds?.length > 0;

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
        `· Região ${v?.region} - ${v?.treatments?.name} ==> R$ ${maskValue(
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

  const updateTreatmentsPayeds = () => {
    let negClone = negotiateds;
    if (paymentType === "pix" || paymentType === "cash") {
      let negotiatedsValues = negClone.map((v) =>
        parseFloat(v?.treatments.price)
      );
      let reduced = negotiatedsValues.map((v) => {
        let percent = (v * discount) / 100;
        return v - percent;
      });

      let negotiatedsClone = negClone;
      for (let i = 0; i < negClone.length; i++) {
        negotiatedsClone[i].treatments.price = reduced[i]
          .toFixed(2)
          .replaceAll(".", ",");
      }

      setNegotiatedsToRealize(negotiatedsClone);
    } else if (paymentType === "credit") {
      let negotiatedsValues = negClone.map((v) =>
        parseFloat(v?.treatments.price)
      );
      let reduced = negotiatedsValues.map((v) => {
        let minAddition = 5;
        let maxAddition = 10;
        let percent =
          parseInt(vezes) < 7
            ? (v * minAddition) / 100
            : (v * maxAddition) / 100;
        return v + percent;
      });

      let negotiatedsClone = negClone;
      for (let i = 0; i < negClone.length; i++) {
        negotiatedsClone[i].treatments.price = reduced[i]
          .toFixed(2)
          .replaceAll(".", ",");
      }
      setNegotiatedsToRealize(negotiatedsClone);
    } else setNegotiatedsToRealize(negotiateds);
  };

  const handleFinishPayment = async () => {
    // setIsLoading(true);
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
    const receiptData = {
      negotiateds,
      paymentShape,
      timestamp: dateNow,
      client: client?.id,
      total: totalValue,
      totalStr: totalValueString,
    };

    const clientRef = F.doc(db, "clients", client!.id);
    const receiptRef = F.collection(db, "receipts");
    const paymentsRef = F.collection(db, "payments");
    const clientTreatmentRef = F.doc(
      db,
      "clients_treatments",
      clientTreatments!.id
    );

    updateTreatmentsPayeds();

    return;

    const receiptDoc = await F.addDoc(receiptRef, receiptData);
    if (receiptDoc) {
      const paymentData = {
        client: client?.id,
        receipt: receiptDoc.id,
        shape: paymentShape,
        total: totalValue,
        totalStr: totalValueString,
      };
      const paymentDoc = await F.addDoc(paymentsRef, paymentData);

      if (paymentDoc) {
        let refReceipt = F.doc(db, "receipts", receiptDoc.id);
        return await F.updateDoc(refReceipt, {
          paymentId: paymentDoc.id,
        }).then(async () => {
          return await F.updateDoc(clientRef, { role: "patient" })
            .then(async () => {
              return await F.updateDoc(clientTreatmentRef, {
                "negotiateds.toRealize": F.arrayUnion(...negotiatedsToRealize),
                "negotiateds.payeds": F.arrayUnion(...negotiateds),
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
        });
      }
    } else return alert("Deu erro");

    return;
  };

  return (
    <Box py={2} width="100%">
      <Modal visible={addTreatmentVisible} closeModal={handleCloseAddTreatment}>
        <TreatmentPlanUpdate
          onSaveTreatments={handleSubmitTreatment}
          setVisible={setAddTreatmentVisible}
          previousTreatments={clientTreatments?.treatments?.treatment_plan}
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
          negotiatedsToRealize={negotiatedsToRealize}
          setNegotiatedsToRealize={setNegotiatedsToRealize}
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

      {clientTreatments !== null && (
        <>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            columnGap={2}
          >
            {actualProfessional !== null ? (
              <Typography variant="bold">
                Atual Dentista: {actualProfessional?.name ?? ""}
              </Typography>
            ) : (
              <Typography variant="bold">Sem dentista atualmente</Typography>
            )}
            <Typography variant="small">
              Atualizado por: {clientTreatments?.updatedBy?.reporterName} dia{" "}
              {clientAdminTimestamp?.toDate()?.toLocaleString("pt-br")}
            </Typography>
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
              clientTreatments?.treatments?.treatment_plan?.map((v, i) => (
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
              clientTreatments?.treatments?.realizeds?.map((v, i) => (
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
              href={`/admin/treatment-history/${client!.id}`}
            >
              <StyledButton endIcon={<HistoryIcon />}>Histórico</StyledButton>
            </Link>
          </Box>
        </>
      )}

      {client?.role !== "pre-register" && (
        <AddTreatment
          openModal={() => setAddTreatmentVisible(true)}
          handleGeneratePayment={handleGeneratePayment}
          treatments={clientTreatments}
        />
      )}
    </Box>
  );
};

export default ClientInfosTreatments;
