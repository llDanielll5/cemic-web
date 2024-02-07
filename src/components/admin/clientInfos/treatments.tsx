import React, { useState, useEffect, useCallback } from "react";
import * as F from "firebase/firestore";
import Modal from "@/components/modal";
import UserData from "@/atoms/userData";
import AddTreatment from "./addTreatment";
import ReceiptAdmin from "@/components/dynamicAdminBody/screening/receipt";
import ModalPaymentAdmin from "@/components/dynamicAdminBody/screening/modalPayment";
import TreatmentPlanUpdate from "@/components/dynamicProfBody/screening/details/treatmentPlan";
import { Box } from "@mui/material";
import { useRecoilValue } from "recoil";
import { db } from "@/services/firebase";
import { maskValue } from "@/services/services";
import { PatientInterface } from "types/patient";
import { PaymentShape, PaymentTypes } from "types/payments";
import {
  handleGetPatientTreatments,
  handleUpdatePatient,
} from "@/axios/admin/patients";
import { defaultOdontogram } from "types/odontogram";
import {
  handleCreateOdontogram,
  updateToothOfPatient,
} from "@/axios/admin/odontogram";
import { formatISO } from "date-fns";

interface ClientTreatmentsInterface {
  client: PatientInterface;
  onUpdatePatient: any;
}

interface TreatmentsInterface {
  screening: any;
  treatments: any;
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
  const { client, onUpdatePatient }: any = props;
  const [vezes, setVezes] = useState("");
  const adminData: any = useRecoilValue(UserData);
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
  let clientOdontogram = client?.attributes?.odontogram?.data;

  const [data, setData] = useState<TreatmentsInterface>({
    treatments: null,
    screening: null,
  });

  const getActualProfessional = useCallback(async () => {
    return;
  }, []);

  const handleCloseAddTreatment = async () => {
    setAddTreatmentVisible(false);
    return await getTreatments();
  };

  const handleSubmitTreatment = async (values: any, odontogramId: any) => {
    //Aqui ele pega o histórico da atualização criada naquela data para o odontograma do paciente
    let newDate = formatISO(new Date()).substring(0, 19);
    let odontogram = { ...clientOdontogram };
    let { attributes } = odontogram;
    let { tooths } = attributes;
    let adminInfos = {
      updated: adminData?.id,
      updateTimestamp: new Date(),
      history: { [newDate]: tooths },
    };

    return await updateToothOfPatient(odontogramId, values, adminInfos).then(
      async (res) => {
        onUpdatePatient();
        handleCloseAddTreatment();
        return alert("Tratamento atualizado!");
      },
      (err) => console.log(err)
    );
  };

  const getTotalValue = useCallback(
    (
      arr: {
        region: string;
        treatment: { name: string; price: number; id: string };
      }[]
    ) => {
      const prices: number[] = [];

      const arrMap = arr?.map((v) => {
        let hasPoint = v?.treatment?.price;
        if (hasPoint) prices.push(v?.treatment?.price);
        else prices.push(v?.treatment?.price);
      });

      if (arrMap.length > 0) {
        let reduced = prices?.reduce((prev, curr) => prev + curr);

        if (paymentType === "pix/cash") {
          let discounted = (reduced * discount) / 100;
          if (!discount) {
            reduced = reduced;
          } else reduced -= discounted;
          setTotalValue(reduced);
          return;
        } else if (paymentType === "credit") {
          let percent = (reduced * 10) / 100;
          reduced += percent;
          setTotalValue(reduced);
          return;
        } else return setTotalValue(reduced);
      } else return;
    },
    [paymentType, discount]
  );

  const handleGeneratePayment = () => {
    if (data?.treatments?.all.length === 0) return;
    let allTreatments = data?.treatments?.all ?? [];
    let negotiateds = data?.treatments?.negotiateds ?? [];

    let reduced: any[] = [];
    allTreatments.forEach((item: any) => {
      var duplicated =
        negotiateds.findIndex((val: any) => {
          return (
            item.region === val.region &&
            item.treatment.cod === val.treatment.cod &&
            item.treatment.id === val.treatment.id
          );
        }) > -1;
      if (!duplicated) reduced.push(item);
    });

    setTreatmentsToPay(reduced);
    setPaymentModal(true);
  };

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

  const handleViewPayment = async () => {
    if (discount > 8 || discount < 5)
      return alert("Desconto não liberado no sistema");

    const totalValue = "";
    const patientName = client?.name;
    const dateNow = new Date().toLocaleDateString("pt-br");
    const treatmentsString = negotiateds.flatMap(
      (v) =>
        `· Região ${v?.region} - ${v?.treatments?.name} ==> R$ ${maskValue(
          v?.treatments?.price
        )}`
    );

    if (paymentType === "pix/cash") {
      const changeNegotiatedsValues = negotiateds.map(
        (v) => v.treatments.price
      );
      return console.log(changeNegotiatedsValues);
    }

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
    if (paymentType === "pix/cash") {
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

    //getdoc

    updateTreatmentsPayeds();

    return;
  };

  const openAddTreatment = async () => {
    if (clientOdontogram === null) {
      return await handleCreateOdontogram(client?.id!).then(
        (res) => {
          alert("Odontograma do paciente criado!");
          onUpdatePatient();
        },
        (err) => console.log(err.response)
      );
    } else setAddTreatmentVisible(true);
  };

  const getInformations = (data: any) => {
    let treatments = data?.attributes?.treatments;
    let screening = data?.attributes?.screening?.data;
    return setData({ treatments, screening });
  };

  const getTreatments = useCallback(async () => {
    return await handleGetPatientTreatments(client!.id).then(
      (res) => getInformations(res.data.data),
      (err) => console.log(err.response)
    );
  }, [client]);

  useEffect(() => {
    getTreatments();
  }, [getTreatments]);

  useEffect(() => {
    getTotalValue(negotiateds);
  }, [getTotalValue, negotiateds]);

  useEffect(() => {
    if (client?.actualProfessional !== "") return;
    getActualProfessional();
  }, [client?.actualProfessional, getActualProfessional]);

  return (
    <Box py={2} width="100%">
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

      {/* {clientTreatments !== null && (
        <>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            columnGap={2}
          >
            {actualProfessional !== null ? (
              <Typography variant="subtitle1">
                Atual Dentista: {actualProfessional?.name ?? ""}
              </Typography>
            ) : (
              <Typography variant="subtitle1">
                Sem dentista atualmente
              </Typography>
            )}
            <Typography variant="caption">
              Atualizado por: {clientTreatments?.updatedBy?.reporterName} dia{" "}
              {clientAdminTimestamp?.toDate()?.toLocaleString("pt-br")}
            </Typography>
          </Box>
          <Typography variant="subtitle1">
            Plano de Tratamento do paciente:
          </Typography>
          <Box
            border="1.3px solid var(--dark-blue)"
            p={1}
            borderRadius={2}
            my={1}
          >
            {hasTreatmentPlan &&
              clientTreatments?.treatment_plan?.map((v: any, i: number) => (
                <Box
                  key={i}
                  display={"flex"}
                  alignItems={"center"}
                  columnGap={"4px"}
                  width={"100%"}
                  my={"4px"}
                >
                  <Typography variant="subtitle1">{v?.region} - </Typography>
                  <Typography variant="subtitle1">
                    {v?.treatments?.name}
                  </Typography>
                </Box>
              ))}
            {!hasTreatmentPlan && (
              <Typography variant="subtitle1">
                Sem plano de Tratamento
              </Typography>
            )}
          </Box>

          <Typography variant="subtitle1">
            Tratamentos já realizados:
          </Typography>
          <Box
            border="1.3px solid var(--dark-blue)"
            p={1}
            borderRadius={2}
            mt={1}
          >
            {hasRealizeds &&
              clientTreatments?.negotiateds?.realizeds?.map(
                (v: any, i: number) => (
                  <Box
                    key={i}
                    display={"flex"}
                    alignItems={"center"}
                    columnGap={"4px"}
                    width={"100%"}
                    my={"4px"}
                  >
                    <Typography variant="subtitle1">{v?.region} - </Typography>
                    <Typography variant="subtitle1">
                      {v?.treatments?.name}
                    </Typography>
                  </Box>
                )
              )}
            {!hasRealizeds && (
              <Typography variant="subtitle1">
                Sem Tratamentos concluídos
              </Typography>
            )}
          </Box>

          <Box display="flex" flexDirection="column" alignItems="center" mt={1}>
            <Typography variant="subtitle1">
              Verificar histórico de encaminhamentos
            </Typography>
            <Link
              passhref="true"
              target="_blank"
              href={`/admin/treatment-history/${client!.id}`}
            >
              <StyledButton endIcon={<HistoryIcon />}>Histórico</StyledButton>
            </Link>
          </Box>
        </>
      )} */}

      {client?.role !== "PRE-REGISTER" && (
        <AddTreatment
          openModal={openAddTreatment}
          handleGeneratePayment={handleGeneratePayment}
          treatments={data?.treatments?.all}
        />
      )}
      {clientOdontogram !== undefined && (
        <TreatmentPlanUpdate
          patientOdontogram={clientOdontogram ?? undefined}
          onSaveTreatments={handleSubmitTreatment}
        />
      )}
    </Box>
  );
};

export default ClientInfosTreatments;
