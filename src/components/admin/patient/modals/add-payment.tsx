/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useState } from "react";
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
import { parseToothRegion } from "@/services/services";
import { ToothsInterface } from "types/odontogram";
import AddPaymentShape from "../components/add-payment-shape";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import PaymentTypesPatient from "../components/payment-types";
import { useRecoilValue } from "recoil";
import PatientData from "@/atoms/patient";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { formatISO } from "date-fns";

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
  const [additionCreditVisible, setAdditionCreditVisible] = useState(false);
  const [cashierType, setCashierType] = useState<"Clinico" | "Implantes">(
    "Clinico"
  );
  // const [discountVisible, setDiscountVisible] = useState(false);
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

  const getTotal = totalValue.toLocaleString("pt-br", {
    style: "currency",
    currency: "BRL",
  });

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
  const handleCreditValidation = (e: any) => {
    const reg = new RegExp("[0-9]");
    if (reg.test(e.target.value)) {
      setCreditAddition(e.target.value);
      getTotalValue(treatmentsForPayment);
    }
  };
  const handleAddPaymentShape = () => {
    let defaultValues: PaymentShapesInterface = { price: 0, shape: "" };
    setPaymentShapes((prev) => [...(prev ?? []), defaultValues]);
  };

  const getTotalValue = useCallback(
    (arr: ToothsInterface[]) => {
      const prices: number[] = [];

      arr?.map((v) => prices.push(v.attributes.price));
      let reduced = prices?.reduce((prev, curr) => prev + curr, 0);

      const creditValues = paymentShapes.filter(
        (item) => item.shape === "CREDIT_CARD"
      );

      if (creditValues.length > 0) {
        if (paymentShapes.length > 1) {
          let otherValues = paymentShapes.filter(
            (item) => item.shape !== "CREDIT_CARD"
          );
          const mapOther = otherValues.map((v) => v.price);
          const reduceOther = mapOther.reduce((prev, curr) => prev + curr, 0);

          const mapValues = creditValues.map((v) => v.price);
          const reduceCreditValues = mapValues.reduce(
            (prev, curr) => prev + curr,
            0
          );

          let rest = reduced - reduceOther;

          const percentPrices = (rest * creditAddition) / 100;
          let percentCredit = (reduceCreditValues * creditAddition) / 100;

          if (percentCredit > percentPrices) {
            percentCredit = percentPrices;
          }

          setTotalValue(reduced + percentCredit);
        } else {
          const mapValues = creditValues.map((v) => v.price);
          const reduceCreditValues = mapValues.reduce(
            (prev, curr) => prev + curr,
            0
          );
          const percentPrices = (reduced * creditAddition) / 100;
          let percentCredit = (reduceCreditValues * creditAddition) / 100;

          if (percentCredit > percentPrices) {
            percentCredit = percentPrices;
          }

          setTotalValue(reduced + percentCredit);
          if (parseInt(discount) > 0 || parseInt(discount) < 9) {
            var valueDiscount = (reduced * parseInt(discount)) / 100;
            setTotalValue(reduced - valueDiscount + percentCredit);
          }
        }
      } else if (parseInt(discount) > 0 || parseInt(discount) < 9) {
        var valueDiscount = (reduced * parseInt(discount)) / 100;
        setTotalValue(reduced - valueDiscount);
      } else setTotalValue(reduced);
    },
    [paymentShapes, discount, creditAddition]
  );

  const onChangePaymentShape = useCallback(
    (paymentShape: PaymentShapesInterface[]) => {
      const creditValues = paymentShape.filter(
        (item) => item.shape === "CREDIT_CARD"
      );
      const hasCashOrPixPayment =
        paymentShapes.filter((item) => item.shape === "CASH").length > 0 ||
        paymentShapes.filter((item) => item.shape === "PIX").length > 0 ||
        paymentShapes.filter((item) => item.shape === "DEBIT_CARD").length > 0;
      // aqui se instalava a lógica de somente adicionar desconto em pagamento a vista
      // if (hasCashOrPixPayment) setDiscountVisible(true);
      // if (!hasCashOrPixPayment) setDiscountVisible(false);

      if (creditValues.length > 0) setAdditionCreditVisible(true);
      else setAdditionCreditVisible(false);

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

    if (notShape.find((v) => v === true))
      return alert(
        "É necessário informar como será pago para todas formas de pagamento."
      );
    if (notPriced.find((v) => v === true))
      return alert(
        "É obrigatório informar o valor de todas formas de pagamento!"
      );

    if (pricesReduced > totalValue)
      return alert("O valor digitado não pode ultrapassar o valor total!");
    if (pricesReduced < totalValue)
      return alert(
        "Os valores digitados não podem ser menor que o valor total!"
      );
    if (parseInt(discount) < 0 || parseInt(discount) > 9)
      return alert("Desconto não liberado!");
    if (creditAddition > 10) {
      return alert("Não é possível adicionar acréscimo acima de 10%");
    }
    if (creditAddition < 0) {
      return alert("Não é possível adicionar acréscimo menor que 0");
    }

    if (wallets.length > 1) {
      return alert(
        "Não é possível adicionar duas formas de pagamento de fundo de carteira, adicione somente 1 com o valor até o limite da carteira!"
      );
    }
    if (walletReduce > patientData?.attributes?.credits!)
      return alert("Valor acima do fundo de crédito do paciente!");

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
        return alert(
          "Os valores somados de cheques não podem ultrapassar o total"
        );
      if (pricesCheckReduced < priceTotalCheck!)
        return alert(
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
      totalValue,
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
    if (discount !== "") getTotalValue(treatmentsForPayment);
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
              sx={{ background: "#f3f3f3" }}
              width="100%"
              my={2}
              borderRadius={2}
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
            <h3>Total: {getTotal}</h3>

            <AddPaymentShape
              paymentShapes={paymentShapes}
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

            {additionCreditVisible && (
              <Paper sx={{ width: "100%", my: 2, p: 2 }} elevation={10}>
                <Typography variant="subtitle1">
                  Qual o valor de Acréscimo?
                </Typography>
                <Stack direction={"row"} alignItems="center" columnGap={2}>
                  <TextField
                    title="Acréscimo de Crédito"
                    type="number"
                    label="Acréscimo (%)"
                    value={creditAddition}
                    onChange={handleCreditValidation}
                    fullWidth
                  />
                  <Button
                    variant="contained"
                    onClick={() => setCreditAddition(10)}
                  >
                    Resetar
                  </Button>
                </Stack>
              </Paper>
            )}

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
