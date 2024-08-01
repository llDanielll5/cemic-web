import React, { useState } from "react";
import Loading from "@/components/loading";
import PatientData from "@/atoms/patient";
import AddTreatment from "../modals/add-payment";
import DeleteIcon from "@mui/icons-material/Delete";
import PostAddIcon from "@mui/icons-material/PostAdd";
import { useRecoilValue } from "recoil";
import {
  BankCheckInformationsInterface,
  PaymentInfosInterface,
  PaymentShapesInterface,
  ReceiptValues,
} from "types/payments";
import { createPatientPayment } from "@/axios/admin/payments";
import { StyledButton } from "@/components/dynamicAdminBody/receipts";
import { handleGetTreatmentsToPay } from "@/axios/admin/odontogram";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import AddPaymentPatientModal from "../modals/add-payment";
import ReceiptPreview, { parseToBrl } from "../modals/receipt-preview";
import PaymentsSharpIcon from "@mui/icons-material/PaymentsSharp";
import UserData from "@/atoms/userData";
import { AdminInfosInterface } from "types/admin";
import ReceiptSinglePatient from "../modals/receipt-single";
import {
  handleUpdateHasPayedTreatments,
  handleUpdatePatient,
} from "@/axios/admin/patients";
import { CreateCashierInfosInterface } from "types/cashier";
import { Box, Typography, styled, Button, Card, Alert } from "@mui/material";
import { formatISO } from "date-fns";
import {
  ReceiptSingle,
  ReceiptsPatientTable,
} from "@/components/table/receipts-table";
import {
  generatePatientPaymentInCashier,
  handleGetCashierOpened,
} from "@/axios/admin/cashiers";
import AddCreditToPatientModal from "../modals/add-credits";
import ReceiptCreditsPreview from "../modals/receipt-credits-preview";

interface PatientFinaceTabProps {
  onUpdatePatient: any;
}

interface CreatePayment {
  data: {
    date: Date | string;
    total_value: number;
    discount?: number;
    patient: any;
    bank_check_infos: BankCheckInformationsInterface[];
    payment_shapes: PaymentShapesInterface[];
    adminInfos: AdminInfosInterface;
    treatments: any[];
    filial?: string;
    location?: "DF" | "MG" | "";
  };
}

const PatientFinanceTab = (props: PatientFinaceTabProps) => {
  const { onUpdatePatient } = props;
  const patientData = useRecoilValue(PatientData);
  const adminData = useRecoilValue(UserData);
  const patient = patientData?.attributes;
  const paymentsPatient = patient?.payments?.data;

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [addCreditModal, setAddCreditModal] = useState(false);
  const [treatmentsToPay, setTreatmentsToPay] = useState<any>([]);
  const [receiptPreviewVisible, setReceiptPreviewVisible] = useState(false);
  const [receiptSingle, setReceiptSingle] = useState<ReceiptSingle | null>(
    null
  );
  const [receiptValues, setReceiptValues] = useState<ReceiptValues | null>(
    null
  );
  const [receiptCredits, setReceiptCredits] = useState<any | null>(null);
  const [receiptCreditsPreview, setReceiptCreditsPreview] = useState(false);

  const handleCloseAddPayment = () => setTreatmentsToPay([]);
  const handleGeneratePayment = async () => {
    setIsLoading(true);
    setLoadingMessage("Estamos Carregando Informações de Tratamentos!");
    const res = await handleGetTreatmentsToPay(patientData?.id!);
    const notPayeds = res.data.data.filter((v: any) => !v.attributes.hasPayed);

    setIsLoading(false);
    if (notPayeds.length === 0)
      return alert("Não há tratamentos sem pagamento deste paciente!");
    setTreatmentsToPay(notPayeds);
  };
  const handleAddCredits = async () => {
    setAddCreditModal(true);
  };

  const handleSubmitCredits = async () => {
    setIsLoading(true);
    setLoadingMessage("Adicionando Fundos de Crédito para o paciente!");
    const adminInfos = { created: adminData?.id, createTimestamp: new Date() };
    const dataUpdate: any = {
      data: {
        adminInfos,
        date: new Date(),
        patient: patientData?.id,
        total_value: receiptCredits!.totalValue!,
        discount: Number.isNaN(receiptCredits?.discount)
          ? 0
          : receiptCredits?.discount,
        description: receiptCredits.description,
        payment_shapes: receiptCredits?.paymentShapes!,
        bank_check_infos: receiptCredits?.bankCheckInfos ?? [],
      },
    };

    const handleConclusion = () => {
      handleCloseReceiptCredits();
      setReceiptCredits(null);
      setAddCreditModal(false);
      onUpdatePatient();
      setIsLoading(false);
    };
    const cashierType: "clinic" | "implant" = receiptCredits?.cashierType!;
    const isoDate = formatISO(new Date()).substring(0, 10);
    const { data: resData } = await handleGetCashierOpened(
      isoDate,
      cashierType,
      adminData?.filial!
    );
    setLoadingMessage("Estamos verificando o Caixa do Dia!");
    const { data: hasOpenedCashier } = resData;

    if (hasOpenedCashier.length === 0) {
      setIsLoading(false);
      alert("Não há caixa aberto ou já possui caixa fechado de hoje!");
      return;
    }

    let cashValues: any[] = [];
    let creditValues: any[] = [];
    let debitValues: any[] = [];
    let pixValues: any[] = [];
    let bankCheckValues: any[] = [];
    let transferValues: any[] = [];

    receiptCredits?.paymentShapes?.forEach((v: any) => {
      if (v.shape === "CASH") cashValues.push(v.price);
      if (v.shape === "BANK_CHECK") bankCheckValues.push(v.price);
      if (v.shape === "CREDIT_CARD") creditValues.push(v.price);
      if (v.shape === "DEBIT_CARD") debitValues.push(v.price);
      if (v.shape === "TRANSFER") transferValues.push(v.price);
      if (v.shape === "PIX") pixValues.push(v.price);
    });

    const values = {
      bank_check:
        bankCheckValues.length > 0
          ? bankCheckValues.reduce((prev, curr) => prev + curr, 0)
          : 0,
      cash:
        cashValues.length > 0
          ? cashValues.reduce((prev, curr) => prev + curr, 0)
          : 0,
      credit:
        creditValues.length > 0
          ? creditValues.reduce((prev, curr) => prev + curr, 0)
          : 0,
      debit:
        debitValues.length > 0
          ? debitValues.reduce((prev, curr) => prev + curr, 0)
          : 0,
      out: 0,
      pix:
        pixValues.length > 0
          ? pixValues.reduce((prev, curr) => prev + curr, 0)
          : 0,
      transfer:
        transferValues.length > 0
          ? transferValues.reduce((prev, curr) => prev + curr, 0)
          : 0,
    };

    const cashierInfoData: CreateCashierInfosInterface = {
      data: {
        date: new Date(),
        description: receiptCredits.description,
        type: "IN",
        cashier: hasOpenedCashier[0].id!,
        outInfo: null,
        verifyBy: null,
        total_values: values,
        patient: patientData?.id!,
      },
    };

    return await createPatientPayment(dataUpdate).then(
      async (res) => {
        setLoadingMessage("Atualizando o caixa do Dia!");
        return await generatePatientPaymentInCashier(cashierInfoData).then(
          async (res) => {
            setLoadingMessage("Estamos atualizando informações do paciente...");
            return await handleUpdatePatient(patientData?.id!, {
              data: { credits: receiptCredits!.totalValue },
            }).then(
              async () => handleConclusion(),
              (err) => {
                setIsLoading(false);
                console.log(err.response);
              }
            );
          },
          (err) => {
            setIsLoading(false);
            console.log(err.response);
          }
        );
      },
      (err) => console.log(err.response)
    );
  };
  const handleSubmitReceipt = async () => {
    setIsLoading(true);
    setLoadingMessage("Criando Pagamento do Paciente...");

    const treatmentsIds = receiptValues?.treatmentsForPayment.map((v) => v.id)!;
    const adminInfos = { created: adminData?.id, createTimestamp: new Date() };
    const dataUpdate: CreatePayment = {
      data: {
        adminInfos,
        date: receiptValues?.dateSelected!,
        patient: patientData?.id,
        total_value: receiptValues!.totalValue!,
        discount: Number.isNaN(receiptValues?.discount)
          ? 0
          : receiptValues?.discount,
        treatments: treatmentsIds,
        payment_shapes: receiptValues?.paymentShapes!,
        bank_check_infos: receiptValues?.bankCheckInfos ?? [],
        location: adminData?.location as "DF" | "MG",
        filial: adminData?.filial,
      },
    };

    const handleConclusion = () => {
      handleCloseReceiptValues();
      handleCloseAddPayment();
      setReceiptValues(null);
      onUpdatePatient();
      setIsLoading(false);
    };
    const cashierType: "clinic" | "implant" = receiptValues?.cashierType!;
    const isoDate = formatISO(receiptValues?.dateSelected!).substring(0, 10);
    const { data: resData } = await handleGetCashierOpened(
      isoDate,
      cashierType,
      adminData?.filial!
    );
    setLoadingMessage("Estamos verificando o Caixa do Dia!");
    const { data: hasOpenedCashier } = resData;

    if (hasOpenedCashier.length === 0) {
      setIsLoading(false);
      alert("Não há caixa aberto ou já possui caixa fechado de hoje!");
      return;
    }

    let cashValues: any[] = [];
    let creditValues: any[] = [];
    let debitValues: any[] = [];
    let pixValues: any[] = [];
    let bankCheckValues: any[] = [];
    let transferValues: any[] = [];

    receiptValues?.paymentShapes?.forEach((v) => {
      if (v.shape === "CASH") cashValues.push(v.price);
      if (v.shape === "BANK_CHECK") bankCheckValues.push(v.price);
      if (v.shape === "CREDIT_CARD") creditValues.push(v.price);
      if (v.shape === "DEBIT_CARD") debitValues.push(v.price);
      if (v.shape === "TRANSFER") transferValues.push(v.price);
      if (v.shape === "PIX") pixValues.push(v.price);
    });

    const values = {
      bank_check:
        bankCheckValues.length > 0
          ? bankCheckValues.reduce((prev, curr) => prev + curr, 0)
          : 0,
      cash:
        cashValues.length > 0
          ? cashValues.reduce((prev, curr) => prev + curr, 0)
          : 0,
      credit:
        creditValues.length > 0
          ? creditValues.reduce((prev, curr) => prev + curr, 0)
          : 0,
      debit:
        debitValues.length > 0
          ? debitValues.reduce((prev, curr) => prev + curr, 0)
          : 0,
      out: 0,
      pix:
        pixValues.length > 0
          ? pixValues.reduce((prev, curr) => prev + curr, 0)
          : 0,
      transfer:
        transferValues.length > 0
          ? transferValues.reduce((prev, curr) => prev + curr, 0)
          : 0,
    };

    let equalsNames: any = {};

    receiptValues?.treatmentsForPayment.map((item: any) => {
      equalsNames[item.attributes.name] = [
        ...(equalsNames[item.attributes.name] ?? []),
        item.attributes.name,
      ];
    });

    let keys = Object.keys(equalsNames);

    const description = keys
      .map((key, index) => {
        return `${equalsNames[key].length} ${key}${
          equalsNames[key].length > 1 ? "s" : ""
        }${index === equalsNames[key].length ? " " : ", "}`;
      })
      .join(" ");

    const cashierInfoData: CreateCashierInfosInterface = {
      data: {
        date: receiptValues?.dateSelected!,
        description,
        type: "IN",
        cashier: hasOpenedCashier[0].id!,
        outInfo: null,
        verifyBy: null,
        total_values: values,
        patient: patientData?.id!,
        location: adminData?.location as "DF" | "MG",
        filial: adminData?.filial,
      },
    };

    const creditWallet = receiptValues?.paymentShapes?.find(
      (s) => s.shape === "WALLET_CREDIT"
    );
    let usedVal = 0;
    if (creditWallet) usedVal = creditWallet.price;

    setIsLoading(false);

    return await createPatientPayment(dataUpdate).then(
      async (res) => {
        setLoadingMessage("Atualizando o caixa do Dia!");
        return await generatePatientPaymentInCashier(cashierInfoData).then(
          async (res) => {
            setLoadingMessage("Estamos atualizando informações do paciente...");

            return await handleUpdatePatient(patientData?.id!, {
              data: {
                role: "PATIENT",
                credits: patientData?.attributes?.credits! - usedVal,
              },
            }).then(
              async () => {
                return await handleUpdateHasPayedTreatments(treatmentsIds).then(
                  () => handleConclusion(),
                  (err) => {
                    setIsLoading(false);
                    console.log(err.response);
                  }
                );
              },
              (err) => {
                setIsLoading(false);
                console.log(err.response);
              }
            );
          },
          (err) => console.log(err.response)
        );
      },
      (err) => {
        setIsLoading(false);
        console.log(err.response);
      }
    );
  };

  const handleGetReceiptValues = (receiptValues: any) => {
    setReceiptValues(receiptValues);
    setReceiptPreviewVisible(true);
  };
  const handleGetReceiptCredits = (receiptValues: ReceiptValues) => {
    setReceiptCredits(receiptValues);
    setReceiptCreditsPreview(true);
  };
  const handleCloseReceiptValues = () => {
    setReceiptValues(null);
    setReceiptPreviewVisible(false);
  };
  const handleCloseReceiptCredits = () => {
    setReceiptCredits(null);
    setReceiptCreditsPreview(false);
  };

  const onGetReceiptSingle = (receipt: ReceiptSingle) =>
    setReceiptSingle(receipt);
  const handleCloseReceiptSingle = () => setReceiptSingle(null);

  if (isLoading)
    return (
      <Box position="fixed" top={0} left={0} zIndex={999999}>
        <Loading message={loadingMessage} />
      </Box>
    );
  else
    return (
      <Container>
        <AddPaymentPatientModal
          visible={treatmentsToPay.length > 0}
          closeModal={handleCloseAddPayment}
          treatmentsToPay={treatmentsToPay}
          onPassReceiptValues={handleGetReceiptValues}
        />
        <AddCreditToPatientModal
          visible={addCreditModal}
          closeModal={() => setAddCreditModal(!addCreditModal)}
          onPassReceiptValues={handleGetReceiptCredits}
        />
        {receiptValues !== null && (
          <ReceiptPreview
            visible={receiptPreviewVisible}
            closeModal={handleCloseReceiptValues}
            onSubmit={handleSubmitReceipt}
            receiptValues={receiptValues}
          />
        )}
        {receiptCredits !== null && (
          <ReceiptCreditsPreview
            visible={receiptCreditsPreview}
            closeModal={handleCloseReceiptCredits}
            onSubmit={handleSubmitCredits}
            receiptCredits={receiptCredits}
          />
        )}

        {receiptSingle !== null && (
          <ReceiptSinglePatient
            visible={receiptSingle !== null}
            closeModal={handleCloseReceiptSingle}
            receiptSingleValues={receiptSingle}
          />
        )}

        {patient?.credits === null || patient?.credits === 0 ? null : (
          <Alert
            severity="warning"
            sx={{ width: "100%", mb: 2, bgcolor: "rgba(255, 200, 10, 0.2)" }}
          >
            <Typography variant="subtitle2">
              O paciente possui um crédito de: {parseToBrl(patient?.credits)}
            </Typography>
          </Alert>
        )}

        <HeaderContainer elevation={10}>
          <Typography variant="h5">Histórico Financeiro</Typography>
          <Box display={"flex"} alignItems="center" columnGap={2}>
            <Button
              title={"Adicionar Pagamento"}
              variant="contained"
              onClick={handleGeneratePayment}
              startIcon={<AttachMoneyIcon />}
            >
              Add
            </Button>

            <Button
              title={"Adicionar Créditos"}
              variant="contained"
              onClick={handleAddCredits}
              startIcon={<PaymentsSharpIcon />}
            >
              Fund
            </Button>
          </Box>
        </HeaderContainer>

        {paymentsPatient?.length > 0 && (
          <ReceiptsPatientTable
            onGetValues={onGetReceiptSingle}
            items={paymentsPatient}
          />
        )}
      </Container>
    );
};

const Container = styled(Box)`
  overflow: auto;
  width: 100%;
  padding: 1rem 0.5rem;
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const HeaderContainer = styled(Card)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1rem;
  min-width: 700px;
  max-width: 900px;
`;

const TextId = styled(Typography)`
  @media screen and (max-width: 600px) {
    display: none;
  }
`;

export default PatientFinanceTab;
