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
import { parseToothRegion } from "@/services/services";
import { ToothsInterface } from "types/odontogram";
import AddPaymentShape from "../components/add-payment-shape";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import AddBoxIcon from "@mui/icons-material/AddBox";
import PaymentTypesPatient from "../components/payment-types";
import { parseToBrl } from "./receipt-preview";
import Calendar from "react-calendar";

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
  const [dateSelected, setDateSelected] = useState(new Date());
  const [dateSelectedModal, setDateSelectedModal] = useState(false);
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
  const handleChangeDate = (e: any) => {
    setDateSelected(e);
    setDateSelectedModal(false);
    return;
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
      totalValue: totalValueReceipt,
      discount: discount === "" ? 0 : parseInt(discount),
      cashierType: cashierType === "Clinico" ? "clinic" : "implant",
      description,
      dateSelected,
    };

    onPassReceiptValues(dataUpdate);
  };

  const totalValueReceipt = useMemo(() => {
    const creditValues = paymentShapes.filter(
      (item) => item.shape === "CREDIT_CARD"
    );

    const some = paymentShapes.reduce((acc, curr) => acc + curr.price, 0);

    if (creditValues.length > 0) {
      const mapAdditionalValues = creditValues.map(
        (item) => item.creditAdditionalValue ?? 0
      );
      const creditAdditionalReduced = mapAdditionalValues.reduce(
        (prev, curr) => prev + curr,
        0
      );
      const total = some + creditAdditionalReduced;

      return total;
    }
    return some;
  }, [paymentShapes]);

  const onChangePaymentShape = useCallback(
    (paymentShape: PaymentShapesInterface[]) => {
      const creditValues = paymentShape.filter(
        (item) => item.shape === "CREDIT_CARD"
      );

      setPaymentShapes(paymentShape);

      if (creditValues.length > 0) {
        const mapAdditionalValues = creditValues.map(
          (item) => item.creditAdditionalValue ?? 0
        );
        const creditAdditionalReduced = mapAdditionalValues.reduce(
          (prev, curr) => prev + curr,
          0
        );
        const total = totalValue + creditAdditionalReduced;
        setTotalValue(total);
        return;
      }

      let values = paymentShape.map((shape) => {
        return shape.price;
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
        <Typography variant="subtitle1">Adicionar Créditos</Typography>

        <h3>Total: {parseToBrl(totalValueReceipt)}</h3>

        <AddPaymentShape
          paymentShapes={paymentShapes}
          handleAddPaymentShape={handleAddPaymentShape}
          onChangePaymentShape={onChangePaymentShape}
          onChangeBankCheckInfos={handleUpdateCheckInformations}
          fundCredits={[]}
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
          <Typography variant="subtitle1">Escolha o tipo de Caixa</Typography>
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
              renderInput={(props) => <TextField {...props} label="Caixa" />}
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
