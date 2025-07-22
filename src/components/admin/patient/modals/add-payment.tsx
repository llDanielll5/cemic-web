/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useMemo, useState } from "react";
import CModal from "@/components/modal";
import {
  Autocomplete,
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import {
  BankCheckInformationsInterface,
  PaymentShapesInterface,
  ReceiptValues,
} from "types/payments";
import { getPatientFundCredits } from "@/axios/admin/payments";
import { parseToothRegion } from "@/services/services";
import { ToothsInterface } from "types/odontogram";
import { useRecoilValue } from "recoil";
import { toast } from "react-toastify";
import { formatISO } from "date-fns";
import { parseToBrl } from "./receipt-preview";
import PatientData from "@/atoms/patient";
import Calendar from "react-calendar";
import AddPaymentShape from "../components/add-payment-shape";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import "react-calendar/dist/Calendar.css";

interface AddPaymentPatientModal {
  visible: boolean;
  closeModal: any;
  treatmentsToPay: any[];
  onPassReceiptValues: (receiptValues: ReceiptValues) => void;
}

const AddPaymentPatientModal = (props: AddPaymentPatientModal) => {
  const { closeModal, visible, treatmentsToPay, onPassReceiptValues } = props;
  const patientData = useRecoilValue(PatientData);
  const [totalValue, setTotalValue] = useState<number>(0);
  const [discount, setDiscount] = useState<string>("");
  const [creditAddition, setCreditAddition] = useState(10);
  const [dateSelected, setDateSelected] = useState(new Date());
  const [dateSelectedModal, setDateSelectedModal] = useState(false);
  const [fundCredits, setFundCredits] = useState<
    StrapiData<FundCreditsInterface>[]
  >([]);
  const [cashierType, setCashierType] = useState<"Clinico" | "Implantes">(
    "Clinico"
  );
  const [bankCheckInfos, setBankCheckInfos] = useState<
    BankCheckInformationsInterface[]
  >([]);
  const [treatmentsForPayment, setTreatmentsForPayment] = useState<
    ToothsInterface[]
  >([]);
  const [treatmentsOfPatient, setTreatmentsOfPatient] = useState<
    ToothsInterface[]
  >([]);
  const [paymentShapes, setPaymentShapes] = useState<PaymentShapesInterface[]>(
    []
  );

  const totalValueReceipt = useMemo(() => {
    const payShapesArr = paymentShapes?.map((pShape) => {
      const creditValue = pShape.price + (pShape.creditAdditionalValue || 0);
      if (pShape.shape === "CREDIT_CARD") return creditValue;
      else if (pShape.shape === "WALLET_CREDIT") {
        let fundCreditPaymentShapesSaved =
          (
            (pShape?.fundCredits as StrapiData<FundCreditsInterface>)
              ?.attributes?.payment as StrapiRelationData<PaymentsInterface>
          )?.data?.attributes?.payment_shapes || [];
        if (fundCreditPaymentShapesSaved?.length === 0) return pShape.price;
        let sum: number[] = [];

        if (
          !!pShape.fundCreditPaymentShapes &&
          pShape.fundCreditPaymentShapes?.length > 0
        ) {
          for (const element of pShape.fundCreditPaymentShapes) {
            if (element.shape === "CREDIT_CARD") {
              let val = element.price + (element.creditAdditionalValue || 0);
              sum.push(val);
            } else sum.push(element.price);
          }
        } else {
          for (const element of fundCreditPaymentShapesSaved) {
            if (element.shape === "CREDIT_CARD") {
              let val = element.price + (element.creditAdditionalValue || 0);
              sum.push(val);
            } else sum.push(element.price);
          }
        }

        return sum.reduce((p, c) => p + c, 0);
      } else return pShape.price;
    });

    const value = payShapesArr?.reduce((prev, curr) => prev + curr, 0);
    return {
      string: parseToBrl(value),
      number: value,
    };
  }, [paymentShapes]);

  const onClose = () => {
    setTreatmentsForPayment([]);
    setTreatmentsOfPatient([]);
    setPaymentShapes([]);
    setTotalValue(0);
    setDiscount("");
    closeModal();
  };

  const handleAddToPay = (value: any) => {
    const filter = treatmentsOfPatient.filter((v) => v.id !== value.id);
    setTreatmentsOfPatient(filter);
    const arr: any[] = [];
    arr.push(value);
    setTreatmentsForPayment((prev) => [...(prev ?? []), ...arr]);
    return;
  };
  const handleDeleteToPay = (index: number) => {
    const filter = treatmentsForPayment.filter((v, i) => i !== index);
    const value = treatmentsForPayment.filter((v, i) => i === index);
    setTreatmentsForPayment(filter);
    const arr: any[] = [];
    arr.push(...value);
    setTreatmentsOfPatient((prev) => [...(prev ?? []), ...arr]);
    return;
  };

  const handleDiscountValidation = (e: any) => {
    const reg = new RegExp("[0-9]");
    if (reg.test(e.target.value)) {
      setDiscount(e.target.value);
      getTotalValue(treatmentsForPayment);
    }
  };

  const handleAddPaymentShape = () => {
    let defaultValues: PaymentShapesInterface = { price: 0, shape: "" };
    setPaymentShapes((prev) => [...(prev ?? []), defaultValues]);
  };

  const handleGetPatientFundCredits = async () => {
    const {
      data,
    }: { data: StrapiListRelation<StrapiData<FundCreditsInterface>> } =
      await getPatientFundCredits(String(patientData?.id));

    setFundCredits(data.data);
  };

  const getTotalValue = useCallback(
    (arr: ToothsInterface[]) => {
      const prices: number[] = [];

      arr?.map((v) => prices.push(v.attributes.price));
      let reduced = prices?.reduce((prev, curr) => prev + curr, 0);

      if (Number(discount) > 0) {
        const discountValue = (Number(discount) / 100) * reduced;
        return setTotalValue(reduced - discountValue);
      }

      setTotalValue(reduced);
    },
    [paymentShapes, discount, creditAddition]
  );

  const onChangePaymentShape = useCallback(
    (paymentShape: PaymentShapesInterface[]) => {
      const creditValues = paymentShape.filter(
        (item) => item.shape === "CREDIT_CARD"
      );

      setPaymentShapes(paymentShape);
      if (creditValues.length > 0) getTotalValue(treatmentsForPayment);
    },
    [getTotalValue, treatmentsForPayment]
  );

  const handleUpdateCheckInformations = (v: BankCheckInformationsInterface[]) =>
    setBankCheckInfos(v);

  const handleViewPayment = () => {
    if (!dateSelected)
      return alert("Adicione a data correspondente para o caixa");

    const notPriced = paymentShapes.map((v) => v.price === 0);
    const notShape = paymentShapes.map((v) => v.shape === "");
    const prices = paymentShapes.map((v) => v.price);
    const wallets = paymentShapes.filter((v) => v.shape === "WALLET_CREDIT");
    const walletPrice = wallets.map((v) => v.price);
    const walletReduce = walletPrice.reduce((acc, curr) => acc + curr, 0);
    const pricesReduced = prices.reduce((prev, curr) => prev + curr, 0);
    const totalWalletsPrice = wallets.reduce((total, wallet) => {
      return total + (wallet?.price ?? 0);
    }, 0);

    if (notShape.find((v) => v === true))
      return toast.error(
        "É necessário informar como será pago para todas formas de pagamento."
      );
    if (notPriced.find((v) => v === true))
      return toast.error(
        "É obrigatório informar o valor de todas formas de pagamento!"
      );

    if (creditAddition < 0) {
      return toast.error("Não é possível adicionar acréscimo menor que 0");
    }

    if (pricesReduced < totalValue)
      return toast.error(
        "Os valores digitados não podem ser menor que o valor total!"
      );

    if (Number(discount) > 10) {
      return toast.error("Não é possível lançar com desconto acima de 10%");
    }

    for (let i = 0; i < paymentShapes.length; i++) {
      const w = paymentShapes[i];

      if (
        !!w.fundCredits &&
        w.price + w.fundCredits?.attributes?.used_value >
          (
            w.fundCredits?.attributes.payment as unknown as StrapiRelation<
              StrapiData<PaymentsInterface>
            >
          ).data.attributes.total_value
      ) {
        return toast.error(
          `Crédito do dia ${new Date(
            (
              w.fundCredits?.attributes?.payment as unknown as StrapiRelation<
                StrapiData<PaymentsInterface>
              >
            ).data.attributes.date
          ).toLocaleDateString()} está ultrapassando o valor que o paciente possui de crédito`
        );
      }
    }

    if (bankCheckInfos.length > 0) {
      const priceTotalCheck = paymentShapes.find(
        (v) => v.shape === "BANK_CHECK"
      )?.price;
      const pricesBankCheck = bankCheckInfos.map((v: any) =>
        parseFloat(v.price!.replace(".", "").replace(",", "."))
      );
      const pricesCheckReduced = pricesBankCheck.reduce(
        (prev, curr) => prev + curr,
        0
      );

      if (pricesCheckReduced > priceTotalCheck!)
        return toast.error(
          "Os valores somados de cheques não podem ultrapassar o total"
        );
      if (pricesCheckReduced < priceTotalCheck!)
        return toast.error(
          "Os valores somados de cheques não podem ser inferior ao total"
        );
    }

    const parsedBankCheckInfos: any[] = bankCheckInfos.map((v) => {
      const parseValue = parseFloat(
        v.price!.replace(".", "").replace(",", ".")
      );
      return {
        bank_check_number: v.bank_check_number,
        date_compensation: v.date_compensation,
        name: v.name,
        serie_number: v.serie_number,
        price: parseValue,
      };
    });

    const dataUpdate: any = {
      paymentShapes,
      treatmentsForPayment,
      bankCheckInfos: parsedBankCheckInfos ?? [],
      totalValue: totalValueReceipt.number,
      discount: parseInt(discount),
      cashierType: cashierType === "Clinico" ? "clinic" : "implant",
      creditsUsed: wallets.length > 0 ? walletReduce : null,
      dateSelected,
    };

    onPassReceiptValues(dataUpdate);
  };

  const handleChangeDate = (e: any) => {
    setDateSelected(e);
    setDateSelectedModal(false);
    return;
  };

  const hasCheckPayment =
    paymentShapes.filter((v) => v.shape === "BANK_CHECK").length > 0;

  useEffect(() => {
    handleGetPatientFundCredits();
  }, []);

  useEffect(() => {
    getTotalValue(treatmentsForPayment);
  }, [getTotalValue, treatmentsForPayment, discount]);

  useEffect(() => {
    if (treatmentsToPay.length > 0) setTreatmentsOfPatient(treatmentsToPay);
  }, [treatmentsToPay]);

  useEffect(() => {
    if (paymentShapes.length === 0) setDiscount("");
    if (!hasCheckPayment) setBankCheckInfos([]);
  }, [paymentShapes]);

  return (
    <CModal
      visible={visible}
      closeModal={onClose}
      styles={{ height: "90vh", width: "90vw", overflow: "auto" }}
    >
      <Box
        display={"flex"}
        alignItems={"center"}
        flexDirection={"column"}
        sx={{ position: "relative" }}
        pt={1}
      >
        <CModal
          visible={dateSelectedModal}
          closeModal={() => setDateSelectedModal(false)}
        >
          <Box display="flex" alignItems="center" flexDirection="column">
            <Typography variant="subtitle1" mb={1} textAlign="center">
              Selecione a data desejada:
            </Typography>
            <Calendar onChange={handleChangeDate} value={dateSelected} />
          </Box>
        </CModal>

        <Typography variant="subtitle1">Gerar Pagamento</Typography>

        {treatmentsOfPatient.length > 0 && (
          <Box
            sx={{ background: "#f4f4f4" }}
            p={2}
            borderRadius={2}
            width="100%"
          >
            <Typography variant="subtitle1" color="green" my={1}>
              Escolha os tratamentos que serão pagos:
            </Typography>
            {treatmentsOfPatient.map((v: any, i: number) => (
              <TreatmentsToChoice
                key={i}
                variant="contained"
                onClick={() => handleAddToPay(v)}
              >
                <Typography variant="subtitle1">
                  {parseToothRegion(v?.attributes?.region)} -{" "}
                </Typography>
                <Typography variant="subtitle1">
                  {v?.attributes?.name}
                </Typography>
              </TreatmentsToChoice>
            ))}
          </Box>
        )}

        {treatmentsForPayment.length > 0 && (
          <>
            <Box
              p={2}
              my={2}
              width="100%"
              borderRadius={2}
              sx={{ background: "#f3f3f3" }}
            >
              <Typography variant="subtitle1" my={1} color="orangered">
                Os tratamentos a pagar serão:
              </Typography>
              {treatmentsForPayment?.length > 0 &&
                treatmentsForPayment?.map((v: any, i: number) => (
                  <TreatmentsChoiceds
                    key={i}
                    variant="contained"
                    color={"warning"}
                    onClick={() => handleDeleteToPay(i)}
                  >
                    <Typography variant="subtitle1">
                      {parseToothRegion(v?.attributes?.region)} -{" "}
                    </Typography>
                    <Typography variant="subtitle1">
                      {v?.attributes?.name}
                    </Typography>
                  </TreatmentsChoiceds>
                ))}
            </Box>
            <h3>Total Tratamentos: {parseToBrl(totalValue)}</h3>
            <h3>Total Recibo: {totalValueReceipt.string}</h3>

            <AddPaymentShape
              paymentShapes={paymentShapes}
              fundCredits={fundCredits}
              handleAddPaymentShape={handleAddPaymentShape}
              onChangePaymentShape={onChangePaymentShape}
              onChangeBankCheckInfos={handleUpdateCheckInformations}
            />

            <Paper sx={{ width: "100%", my: 2, p: 2 }} elevation={10}>
              <Typography variant="subtitle1">
                Vai oferecer algum desconto?
              </Typography>
              <Stack direction={"row"} alignItems="center" columnGap={2}>
                <TextField
                  title="Desconto a ser oferecido"
                  type="number"
                  label="Desconto (%)"
                  value={discount}
                  onChange={handleDiscountValidation}
                  fullWidth
                />
                <Button variant="contained" onClick={() => setDiscount("")}>
                  Resetar
                </Button>
              </Stack>
            </Paper>

            <Paper sx={{ width: "100%", my: 2, p: 2 }} elevation={10}>
              <Typography variant="subtitle1">
                Escolha o tipo de Caixa
              </Typography>
              <Stack
                direction={"row"}
                alignItems="center"
                justifyContent="space-between"
                columnGap={2}
              >
                <Autocomplete
                  fullWidth
                  value={cashierType}
                  options={["Clinico", "Implantes"]}
                  onChange={(e, v: any) => setCashierType(v!)}
                  renderInput={(props) => (
                    <TextField {...props} label="Caixa" />
                  )}
                />
                <Button
                  variant="contained"
                  sx={{ width: "35%" }}
                  onClick={() => setDateSelectedModal(true)}
                >
                  Selecionar Data
                </Button>
              </Stack>
            </Paper>

            <Typography variant="h6">
              Data Selecionada:{" "}
              {formatISO(dateSelected).substring(0, 10) ===
              formatISO(new Date()).substring(0, 10)
                ? "Hoje"
                : dateSelected.toLocaleDateString()}
            </Typography>
          </>
        )}

        {treatmentsForPayment.length > 0 && paymentShapes.length > 0 ? (
          <Button
            variant="contained"
            onClick={handleViewPayment}
            fullWidth
            sx={{ my: 3 }}
            endIcon={<ReceiptLongIcon />}
          >
            Visualizar Recibo
          </Button>
        ) : null}
      </Box>
    </CModal>
  );
};

const TreatmentsToChoice = styled(Button)`
  display: flex;
  align-items: center;
  column-gap: 4px;
  width: 100%;
  padding: 4px;
  color: white;
  margin-bottom: 8px;
  :hover {
    opacity: 0.8;
  }
`;
const TreatmentsChoiceds = styled(Button)`
  display: flex;
  align-items: center;
  column-gap: 4px;
  width: 100%;
  padding: 4px;
  margin-bottom: 8px;
`;

export default AddPaymentPatientModal;
