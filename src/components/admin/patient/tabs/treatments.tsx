import React, { useState, useEffect, useCallback } from "react";
import UserData from "@/atoms/userData";
import ReceiptAdmin from "@/components/dynamicAdminBody/screening/receipt";
import { Box, Button } from "@mui/material";
import { useRecoilState, useRecoilValue } from "recoil";
import { maskValue } from "@/services/services";
import { PaymentTypes } from "types/payments";
import { handleGetPatientTreatments } from "@/axios/admin/patients";
import PatientData from "@/atoms/patient";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import OdontogramPatientDetails from "../components/odontogram-details";
import {
  handleCreateOdontogram,
  updateToothOfPatient,
} from "@/axios/admin/odontogram";

interface ClientTreatmentsInterface {
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

const PatientTreatmentsTab = (props: ClientTreatmentsInterface) => {
  const { onUpdatePatient } = props;
  const [patientData, setPatientData] = useRecoilState(PatientData);
  const client = patientData?.attributes;
  const [vezes, setVezes] = useState("");
  const adminData: any = useRecoilValue(UserData);
  const [discount, setDiscount] = useState(5);
  const [totalValue, setTotalValue] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [negotiateds, setNegotiateds] = useState<any[]>([]);
  const [receiptVisible, setReceiptVisible] = useState(false);
  const [totalValueString, setTotalValueString] = useState("");
  const [paymentShapesValues, setPaymentShapesValues] = useState("");
  const [paymentType, setPaymentType] = useState<PaymentTypes | null>(null);
  // const [receiptValues, setReceiptValues] = useState<ReceiptType>(null);
  // const [paymentShapesArr, setPaymentsShapesArr] = useState<PayShapeArr>([]);
  const [negotiatedsToRealize, setNegotiatedsToRealize] = useState<any[]>([]);
  let patientOdontogram = client?.odontogram?.data;

  const [data, setData] = useState<TreatmentsInterface>({
    treatments: null,
    screening: null,
  });

  // const handleCloseReceiptVisible = () => {
  //   setReceiptValues(null);
  //   setReceiptVisible(false);
  //   return;
  // };

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

    // setReceiptValues({
    //   total: totalValue,
    //   patientName: patientName!,
    //   date: dateNow,
    //   treatments: treatmentsString,
    // });
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

  // const handleFinishPayment = async () => {
  //   // setIsLoading(true);
  //   const dateNow = F.Timestamp.now();
  //   let paymentShape: PaymentShape[] = [];

  //   if (paymentType !== null) {
  //     paymentShape = [
  //       { type: paymentType, value: totalValue, valueStr: totalValueString },
  //     ];
  //   } else {
  //     let formatShapes: any[] = paymentShapesArr.map((v) => ({
  //       type: v.paymentType,
  //       value: v.value,
  //       valueStr: v.valueStr,
  //     }));
  //     paymentShape = formatShapes;
  //   }
  //   const receiptData = {
  //     negotiateds,
  //     paymentShape,
  //     timestamp: dateNow,
  //     client: patientData?.id,
  //     total: totalValue,
  //     totalStr: totalValueString,
  //   };

  //   //getdoc

  //   updateTreatmentsPayeds();

  //   return;
  // };

  const openAddTreatment = async () => {
    if (patientOdontogram === null) {
      return await handleCreateOdontogram(patientData?.id, adminData?.id!).then(
        (res) => {
          alert("Odontograma do paciente criado!");
          onUpdatePatient();
        },
        (err) => console.log(err.response)
      );
    }
  };

  const getInformations = (data: any) => {
    let treatments = data?.attributes?.treatments;
    let screening = data?.attributes?.screening?.data;
    return setData({ treatments, screening });
  };

  const getTreatments = useCallback(async () => {
    return await handleGetPatientTreatments(patientData?.id!).then(
      (res) => getInformations(res.data.data),
      (err) => console.log(err.response)
    );
  }, [patientData]);

  useEffect(() => {
    getTreatments();
  }, [getTreatments]);

  return (
    <Box py={2} width="100%">
      {/* <Modal visible={receiptVisible} closeModal={handleCloseReceiptVisible}>
        <ReceiptAdmin
          receiptValues={receiptValues}
          onSubmit={handleFinishPayment}
          paymentShapesArr={paymentShapesArr}
          paymentShapesValues={paymentShapesValues}
          paymentType={paymentType}
          discount={discount}
          vezes={vezes}
        />
      </Modal> */}

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

      {patientOdontogram !== null ? (
        <OdontogramPatientDetails
          patientOdontogram={patientOdontogram ?? undefined}
          onUpdatePatient={onUpdatePatient}
        />
      ) : (
        <Box display="flex" alignItems="center" justifyContent="center" p={2}>
          <Button
            variant="contained"
            fullWidth
            sx={{ width: "max-content" }}
            onClick={openAddTreatment}
            endIcon={<EmojiEmotionsIcon />}
          >
            Criar Odontograma do Paciente
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default PatientTreatmentsTab;
