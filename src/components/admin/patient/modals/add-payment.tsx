import React, { useCallback, useEffect, useState } from "react";
import CModal from "@/components/modal";
import {
  Box,
  Button,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import {
  BankCheckInformationsInterface,
  PaymentShapesInterface,
} from "types/payments";
import { parseToothRegion } from "@/services/services";
import { ToothsInterface } from "types/odontogram";
import AddPaymentShape from "../components/add-payment-shape";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import AddBoxIcon from "@mui/icons-material/AddBox";
import PaymentTypesPatient from "../components/payment-types";

interface AddPaymentPatientModal {
  visible: boolean;
  closeModal: any;
  treatmentsToPay: any[];
}

const AddPaymentPatientModal = (props: AddPaymentPatientModal) => {
  const { closeModal, visible, treatmentsToPay } = props;
  const [totalValue, setTotalValue] = useState<number>(0);
  const [discount, setDiscount] = useState<string>("");
  const [discountVisible, setDiscountVisible] = useState(false);
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
  const handleAddPaymentShape = () => {
    let defaultValues: PaymentShapesInterface = { price: 0, shape: "" };
    setPaymentShapes((prev) => [...(prev ?? []), defaultValues]);
  };

  const getTotalValue = useCallback(
    (arr: ToothsInterface[]) => {
      const prices: number[] = [];
      arr?.map((v) => prices.push(v.price));
      let reduced = prices?.reduce((prev, curr) => prev + curr, 0);

      const creditValues = paymentShapes.filter(
        (item) => item.shape === "CREDIT_CARD"
      );

      if (creditValues.length > 0) {
        const mapValues = creditValues.map((v) => v.price);
        const reduceCreditValues = mapValues.reduce(
          (prev, curr) => prev + curr,
          0
        );
        const percentPrices = (reduced * 10) / 100;
        let percentCredit = (reduceCreditValues * 10) / 100;

        if (percentCredit > percentPrices) {
          percentCredit = percentPrices;
        }

        setTotalValue(reduced + percentCredit);

        if (parseInt(discount) > 0 || parseInt(discount) < 9) {
          var valueDiscount = (reduced * parseInt(discount)) / 100;
          setTotalValue(reduced - valueDiscount + percentCredit);
        }
      } else if (parseInt(discount) > 0 || parseInt(discount) < 9) {
        var valueDiscount = (reduced * parseInt(discount)) / 100;
        setTotalValue(reduced - valueDiscount);
      } else setTotalValue(reduced);
    },
    [paymentShapes, discount]
  );

  const onChangePaymentShape = useCallback(
    (paymentShape: PaymentShapesInterface[]) => {
      const creditValues = paymentShape.filter(
        (item) => item.shape === "CREDIT_CARD"
      );
      const hasCashOrPixPayment =
        paymentShapes.filter((item) => item.shape === "CASH").length > 0 ||
        paymentShapes.filter((item) => item.shape === "PIX").length > 0;

      if (hasCashOrPixPayment) setDiscountVisible(true);
      if (!hasCashOrPixPayment) setDiscountVisible(false);

      setPaymentShapes(paymentShape);
      if (creditValues.length > 0) getTotalValue(treatmentsForPayment);
    },
    [getTotalValue, treatmentsForPayment]
  );

  const handleUpdateCheckInformations = (
    v: BankCheckInformationsInterface[]
  ) => {
    setBankCheckInfos(v);
  };

  const handleViewPayment = () => {
    const notPriced = paymentShapes.map((v) => v.price === 0);
    const notShape = paymentShapes.map((v) => v.shape === "");
    const prices = paymentShapes.map((v) => v.price);
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

    if (bankCheckInfos.length > 0) {
      const pricesBankCheck = bankCheckInfos.map((v: any) =>
        parseFloat(v.price!.replace(".", "").replace(",", "."))
      );
      const pricesCheckReduced = pricesBankCheck.reduce(
        (prev, curr) => prev + curr,
        0
      );

      if (pricesCheckReduced > totalValue)
        return alert(
          "Os valores somados de cheques não podem ultrapassar o total"
        );
      if (pricesCheckReduced < totalValue)
        return alert(
          "Os valores somados de cheques não podem ser inferior ao total"
        );
    }

    const parsedBankCheckInfos = bankCheckInfos.map((v) => {
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

    console.log({
      paymentShapes,
      treatmentsForPayment,
      bankCheckInfos: parsedBankCheckInfos,
    });
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
                  {parseToothRegion(v?.region)} -{" "}
                </Typography>
                <Typography variant="subtitle1">{v?.name}</Typography>
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
                      {parseToothRegion(v?.region)} -{" "}
                    </Typography>
                    <Typography variant="subtitle1">{v?.name}</Typography>
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

            {discountVisible ? (
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
            ) : null}
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

const CreditDivide = styled(Box)`
  display: flex;
  align-items: center;
  column-gap: 8px;
  width: 50%;
  .dropdown {
    width: 40%;
  }
`;

const ButtonCredit = styled(IconButton)`
  background-color: var(--dark-blue);
  color: white;
  font-weight: bold;
  border-radius: 8px;
  :hover {
    background-color: var(--red);
  }
`;

export default AddPaymentPatientModal;
