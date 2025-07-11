import React, { useCallback, useEffect, useState } from "react";
import Loading from "@/components/loading";
import PatientData from "@/atoms/patient";
import UserData from "@/atoms/userData";
import { toast } from "react-toastify";
import { useRecoilValue } from "recoil";
import { AdminInfosInterface } from "types/admin";
import {
  createPatientFundCredit,
  createPatientPayment,
  updateFundCreditsUsedValues,
} from "@/axios/admin/payments";
import { handleGetTreatmentsToPay } from "@/axios/admin/odontogram";
import { CreateCashierInfosInterface } from "types/cashier";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import AddPaymentPatientModal from "../modals/add-payment";
import ReceiptPreview, { parseToBrl } from "../modals/receipt-preview";
import ReceiptCreditsPreview from "../modals/receipt-credits-preview";
import PaymentsSharpIcon from "@mui/icons-material/PaymentsSharp";
import AddCreditToPatientModal from "../modals/add-credits";
import ReceiptSinglePatient from "../modals/receipt-single";
import {
  handleGetPatientCredits,
  handleUpdateHasPayedTreatments,
  handleUpdatePatient,
} from "@/axios/admin/patients";
import {
  Box,
  Typography,
  styled,
  Button,
  Card,
  Alert,
  Stack,
} from "@mui/material";
import {
  BankCheckInformationsInterface,
  PaymentShapesInterface,
  ReceiptValues,
} from "types/payments";
import { ReceiptsPatientTable } from "@/components/table/receipts-table";
import {
  generatePatientPaymentInCashier,
  handleGetCashierOpened,
  updateCashierInfoValues,
} from "@/axios/admin/cashiers";
import { someArrValues } from "@/utils";
import { formatISO } from "date-fns";
import { ToothsInterface } from "types/odontogram";

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
    location?: LOCATION_FILIAL;
    hasFundCredit?: boolean;
    hasFundPayed?: boolean;
    fund_useds?: number[];
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
  const [receiptSingle, setReceiptSingle] =
    useState<StrapiData<PaymentsInterface> | null>(null);
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
      return toast.error("Não há tratamentos sem pagamento deste paciente!");
    setTreatmentsToPay(notPayeds);
  };
  const handleAddCredits = async () => {
    setAddCreditModal(true);
  };

  const getSomeValues: (arr: any[]) => number = (arr: any[]) => {
    if (arr.length > 0) return someArrValues(arr);
    return 0;
  };

  const handleSubmitCredits = async () => {
    setIsLoading(true);
    setLoadingMessage("Adicionando Fundos de Crédito para o paciente!");
    const adminInfos = { created: adminData?.id, createTimestamp: new Date() };
    const creditDate: Date = receiptCredits.dateSelected;
    const dataUpdate: { data: PaymentsInterface } = {
      data: {
        adminInfos,
        date: creditDate,
        patient: patientData?.id,
        total_value: receiptCredits!.totalValue!,
        discount: Number.isNaN(receiptCredits?.discount)
          ? 0
          : receiptCredits?.discount,
        description: receiptCredits.description,
        payment_shapes: receiptCredits?.paymentShapes!,
        bank_check_infos: receiptCredits?.bankCheckInfos ?? [],
        hasFundCredit: true,
        hasFundPayed: false,
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
    const isoDate = formatISO(new Date(creditDate)).substring(0, 10);

    const { data: resData } = await handleGetCashierOpened(
      isoDate,
      cashierType,
      adminData?.filial!
    );
    setLoadingMessage("Estamos verificando o Caixa do Dia!");
    const { data: hasOpenedCashier } = resData;

    if (hasOpenedCashier.length === 0) {
      setIsLoading(false);
      toast.error("Não há caixa aberto ou já possui caixa fechado de hoje!");
      return;
    }

    let cashValues: number[] = [];
    let creditValues: number[] = [];
    let debitValues: number[] = [];
    let pixValues: number[] = [];
    let bankCheckValues: number[] = [];
    let transferValues: number[] = [];
    let creditAdditionalValues: number[] = [];

    receiptCredits?.paymentShapes?.forEach((v: PaymentShapesInterface) => {
      if (v.shape === "CASH") cashValues.push(v.price);
      if (v.shape === "BANK_CHECK") bankCheckValues.push(v.price);
      if (v.shape === "DEBIT_CARD") debitValues.push(v.price);
      if (v.shape === "TRANSFER") transferValues.push(v.price);
      if (v.shape === "PIX") pixValues.push(v.price);
      if (v.shape === "CREDIT_CARD") {
        creditValues.push(v.price);
        creditAdditionalValues.push(v.creditAdditionalValue || (0 as number));
      }
    });

    const values = {
      bank_check: getSomeValues(bankCheckValues),
      transfer: getSomeValues(transferValues),
      credit:
        getSomeValues(creditValues) + getSomeValues(creditAdditionalValues),
      debit: getSomeValues(debitValues),
      cash: getSomeValues(cashValues),
      pix: getSomeValues(pixValues),
      out: 0,
    };

    const cashierInfoData: CreateCashierInfosInterface = {
      date: new Date(),
      description: receiptCredits.description,
      type: "IN",
      cashier: hasOpenedCashier[0].id!,
      outInfo: null,
      verifyBy: null,
      total_values: values,
      patient: patientData?.id!,
    };

    if (receiptValues?.dateSelected! > new Date())
      return toast.error("A data selecionada não pode ser futura.");

    try {
      const {
        data: paymentData,
      }: { data: StrapiRelation<StrapiData<PaymentsInterface>> } =
        await createPatientPayment(dataUpdate);
      setLoadingMessage("Atualizando o caixa do Dia!");

      const {
        data: cashierInfoAxiosData,
      }: { data: StrapiRelation<StrapiData<CashierInfosInterface>> } =
        await generatePatientPaymentInCashier(cashierInfoData);
      setLoadingMessage("Estamos atualizando informações do paciente...");

      const { data } = await handleGetPatientCredits(patientData?.id!);
      const oldCredits = data.data?.attributes?.credits;
      const cashierInfoId = cashierInfoAxiosData.data.id;
      const paymentId = paymentData?.data?.id;

      await updateCashierInfoValues(String(cashierInfoId), {
        payment: paymentId,
      });

      await handleUpdatePatient(patientData?.id!, {
        data: { credits: oldCredits + receiptCredits!.totalValue },
      });

      await createPatientFundCredit({
        payment: paymentId,
        status: "CREATED",
        patient: patientData?.id as string,
        used_value: 0,
        hasUsed: false,
        max_used_value: (
          receiptCredits?.paymentShapes as PaymentShapesInterface[]
        )
          ?.map((i) => i.price)
          .reduce((p, c) => p + c, 0),
      });

      handleConclusion();
    } catch (err: any) {
      toast.error(
        err?.response?.message ??
          err?.response ??
          "Erro ao criar Fundo de Crédito para o paciente!"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getPatientCredits = useCallback(() => {
    const fundCredits: StrapiData<PaymentsInterface>[] =
      (patient?.payments?.data).filter(
        (filt: StrapiData<Omit<PaymentsInterface, "fund_credit">>) =>
          filt.attributes.hasFundCredit
      );

    if (fundCredits.length === 0) return 0;

    const fundCreditsArr = fundCredits.map((v) => {
      const fundCredit = v?.attributes
        ?.fund_credit as unknown as StrapiRelation<
        StrapiData<FundCreditsInterface>
      >;
      const haveCreditCard =
        v?.attributes?.payment_shapes.filter((k) => k.shape === "CREDIT_CARD")
          .length > 0;

      const paymentShapesValues = v?.attributes?.payment_shapes.map(
        (k) => k.price
      );
      const reducedPaymentShapes = paymentShapesValues.reduce(
        (prev, curr) => prev + curr,
        0
      );

      const paymentTotalValue = haveCreditCard
        ? reducedPaymentShapes
        : v.attributes.total_value;
      const fundCreditUsed = fundCredit?.data?.attributes?.used_value;

      return paymentTotalValue - fundCreditUsed || 0; //TODO_ REMOVER ESSE 0
    });

    const value = fundCreditsArr.reduce((prev, curr) => prev + curr, 0);

    return value;
  }, [patient?.payments]);

  const handleSubmitReceipt = async () => {
    if (receiptValues === null) return;

    const walletCreditsArr = receiptValues?.paymentShapes?.filter(
      (p) => p.shape === "WALLET_CREDIT"
    );
    const walletsIds = walletCreditsArr?.map(
      (item) => item.fundCredits?.id as number
    );
    const hasWalletCredit = walletCreditsArr?.length! > 0;

    const walletsFundCredits = walletCreditsArr?.map(
      (item) => item.fundCredits as StrapiData<FundCreditsInterface>
    );

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
        hasFundCredit: false,
        hasFundPayed: false,
        ...(hasWalletCredit ? { fund_useds: walletsIds } : {}),
      },
    };

    const handleConclusion = () => {
      handleCloseReceiptValues();
      handleCloseAddPayment();
      setReceiptValues(null);
      onUpdatePatient();
      setIsLoading(false);
      toast.success("Sucesso ao gerar pagamento do paciente");
    };

    const cashierType: CASHIER_TYPE = receiptValues!.cashierType;
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
      toast.error("Não há caixa aberto ou já possui caixa fechado de hoje!");
      return;
    }

    let cashValues: any[] = [];
    let creditValues: any[] = [];
    let creditAdditionalValues: number[] = [];
    let debitValues: any[] = [];
    let pixValues: any[] = [];
    let bankCheckValues: any[] = [];
    let transferValues: any[] = [];

    receiptValues?.paymentShapes?.forEach((v) => {
      if (v.shape === "CASH") cashValues.push(v.price);
      if (v.shape === "BANK_CHECK") bankCheckValues.push(v.price);
      if (v.shape === "DEBIT_CARD") debitValues.push(v.price);
      if (v.shape === "TRANSFER") transferValues.push(v.price);
      if (v.shape === "PIX") pixValues.push(v.price);
      if (v.shape === "CREDIT_CARD") {
        creditValues.push(v.price);
        creditAdditionalValues.push(v.creditAdditionalValue || (0 as number));
      }
    });

    const values = {
      credit:
        getSomeValues(creditValues) + getSomeValues(creditAdditionalValues),
      bank_check: getSomeValues(bankCheckValues),
      transfer: getSomeValues(transferValues),
      debit: getSomeValues(debitValues),
      cash: getSomeValues(cashValues),
      pix: getSomeValues(pixValues),
      out: 0,
    };

    let equalsNames: any = {};

    receiptValues?.treatmentsForPayment.map((item: ToothsInterface) => {
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

    const creditWallet = receiptValues?.paymentShapes?.find(
      (s) => s.shape === "WALLET_CREDIT"
    );
    let usedVal = 0;
    if (creditWallet) usedVal = creditWallet?.price!;

    try {
      const { data: paymentData } = await createPatientPayment(dataUpdate);

      const paymentId = paymentData.data.id;
      await updateFundCreditsUsedValues({
        fund_credits: walletsIds,
        paymentId,
        fundCredits: walletsFundCredits,
        paymentShapes: walletCreditsArr,
        patient: patientData?.id!,
      });

      setLoadingMessage("Atualizando o caixa do Dia!");
      const cashierInfoData: CreateCashierInfosInterface = {
        date: receiptValues?.dateSelected!,
        description,
        type: "IN",
        cashier: hasOpenedCashier[0].id!,
        outInfo: null,
        verifyBy: null,
        total_values: values,
        patient: patientData?.id!,
        location: adminData?.location as LOCATION_FILIAL,
        filial: adminData?.filial,
        payment: paymentId,
      };

      await generatePatientPaymentInCashier(cashierInfoData);
      setLoadingMessage("Estamos atualizando informações do paciente...");
      await handleUpdatePatient(patientData?.id!, {
        role: "PATIENT",
        credits: patientData?.attributes?.credits! - usedVal,
      });

      if (creditWallet) await handleUpdateHasPayedTreatments(treatmentsIds);

      handleConclusion();
    } catch (error: any) {
      console.log(error.response ?? error);
      toast.error("Erro ao gerar recibo do paciente!");
    } finally {
      setIsLoading(false);
    }
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

  const onGetReceiptSingle = (receipt: StrapiData<PaymentsInterface>) => {
    setReceiptSingle(receipt);
  };
  const handleCloseReceiptSingle = () => setReceiptSingle(null);

  useEffect(() => {
    const val = getPatientCredits();
  }, [getPatientCredits]);

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

        {patient?.credits === null || getPatientCredits() === 0 ? null : (
          <Alert
            severity="warning"
            sx={{ width: "100%", mb: 2, bgcolor: "rgba(255, 200, 10, 0.2)" }}
          >
            <Typography variant="subtitle2">
              O paciente possui um crédito de:{" "}
              {getPatientCredits() > 0
                ? parseToBrl(getPatientCredits())
                : parseToBrl(patient?.credits)}
            </Typography>
          </Alert>
        )}

        <HeaderContainer elevation={10}>
          <Typography variant="h5">Histórico Financeiro</Typography>
          <Stack
            direction={{ md: "row", xs: "column" }}
            alignItems="center"
            gap={2}
          >
            <Button
              title={"Adicionar Pagamento"}
              variant="contained"
              onClick={handleGeneratePayment}
              startIcon={<AttachMoneyIcon />}
            >
              Pagamento Total
            </Button>

            <Button
              title={"Adicionar Créditos"}
              variant="contained"
              onClick={handleAddCredits}
              startIcon={<PaymentsSharpIcon />}
            >
              Pagamento Parcial
            </Button>
          </Stack>
        </HeaderContainer>

        {paymentsPatient?.length > 0 && (
          <ReceiptsPatientTable
            onGetValues={onGetReceiptSingle}
            items={paymentsPatient}
            onDeleteValues={onUpdatePatient}
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
