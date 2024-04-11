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
import AddBoxIcon from "@mui/icons-material/AddBox";
import PaymentTypesPatient from "../components/payment-types";

interface AddCreditToPatientProps {
  visible: boolean;
  closeModal: any;
  onPassReceiptValues: (receiptValues: ReceiptValues) => void;
}

const AddCreditToPatientModal = (props: AddCreditToPatientProps) => {
  const { closeModal, visible, onPassReceiptValues } = props;
  const [totalValue, setTotalValue] = useState<number>(0);
  const [discount, setDiscount] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [creditAddition, setCreditAddition] = useState(10);
  const [additionCreditVisible, setAdditionCreditVisible] = useState(false);
  const [cashierType, setCashierType] = useState<"Clinico" | "Implantes">(
    "Clinico"
  );
  const [discountVisible, setDiscountVisible] = useState(false);
  const [bankCheckInfos, setBankCheckInfos] = useState<
    BankCheckInformationsInterface[]
  >([]);
  const [paymentShapes, setPaymentShapes] = useState<PaymentShapesInterface[]>(
    []
  );

  const handleAddPaymentShape = () => {
    let defaultValues: PaymentShapesInterface = { price: 0, shape: "" };
    setPaymentShapes((prev) => [...(prev ?? []), defaultValues]);
  };
  const handleDiscountValidation = (e: any) => {
    const reg = new RegExp("[0-9]");
    if (reg.test(e.target.value)) {
      setDiscount(e.target.value);
    }
  };
  const handleCreditValidation = (e: any) => {
    const reg = new RegExp("[0-9]");
    if (reg.test(e.target.value)) {
      setCreditAddition(e.target.value);
    }
  };
  const handleUpdateCheckInformations = (v: BankCheckInformationsInterface[]) =>
    setBankCheckInfos(v);

  const handleViewPayment = () => {
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
      bankCheckInfos: parsedBankCheckInfos ?? [],
      totalValue,
      discount: discount === "" ? 0 : parseInt(discount),
      cashierType: cashierType === "Clinico" ? "clinic" : "implant",
      description,
    };

    onPassReceiptValues(dataUpdate);
  };

  const onChangePaymentShape = useCallback(
    (paymentShape: PaymentShapesInterface[]) => {
      const creditValues = paymentShape.filter(
        (item) => item.shape === "CREDIT_CARD"
      );
      const hasCashOrPixPayment =
        paymentShapes.filter((item) => item.shape === "CASH").length > 0 ||
        paymentShapes.filter((item) => item.shape === "PIX").length > 0;

      // if (hasCashOrPixPayment) setDiscountVisible(true);
      // if (!hasCashOrPixPayment) setDiscountVisible(false);

      if (creditValues.length > 0) setAdditionCreditVisible(true);
      else setAdditionCreditVisible(false);

      setPaymentShapes(paymentShape);

      let values = paymentShape.map((shape) => {
        if (shape.shape === "CREDIT_CARD") {
          const diff = (creditAddition / 100) * shape.price;
          return shape.price - diff;
        } else return shape.price;
      });

      let reduced = values.reduce((acc, curr) => acc + curr, 0);

      setTotalValue(reduced);
    },
    [totalValue, creditAddition]
  );

  const hasCheckPayment =
    paymentShapes.filter((v) => v.shape === "BANK_CHECK").length > 0;
  const getTotal = totalValue.toLocaleString("pt-br", {
    style: "currency",
    currency: "BRL",
  });

  useEffect(() => {
    if (paymentShapes.length === 0) setDiscount("");
    if (!hasCheckPayment) setBankCheckInfos([]);
  }, [paymentShapes]);

  useEffect(() => {
    onChangePaymentShape(paymentShapes);
  }, [creditAddition, onChangePaymentShape]);

  return (
    <CModal
      visible={visible}
      closeModal={closeModal}
      styles={{ height: "90vh", width: "90vw", overflow: "auto" }}
    >
      <Box
        display={"flex"}
        alignItems={"center"}
        flexDirection={"column"}
        sx={{ position: "relative" }}
        pt={1}
      >
        <Typography variant="subtitle1">Adicionar Créditos</Typography>

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
              <Button variant="contained" onClick={() => setCreditAddition(10)}>
                Resetar
              </Button>
            </Stack>
          </Paper>
        )}

        <Paper sx={{ width: "100%", my: 2, p: 2 }} elevation={10}>
          <Typography variant="subtitle1">Escolha o tipo de Caixa</Typography>
          <Autocomplete
            fullWidth
            value={cashierType}
            options={["Clinico", "Implantes"]}
            onChange={(e, v: any) => setCashierType(v!)}
            renderInput={(props) => <TextField {...props} label="Caixa" />}
          />
        </Paper>

        <TextField
          title="Descrição do Crédito"
          label="Descrição"
          value={description}
          onChange={({ target }) => setDescription(target.value)}
          fullWidth
        />

        {paymentShapes.length > 0 ? (
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

export default AddCreditToPatientModal;
