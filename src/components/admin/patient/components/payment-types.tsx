/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { maskValue } from "@/services/services";
import { parcelado } from "data";
import {
  BankCheckInformationsInterface,
  PaymentShapeTypes,
} from "types/payments";
import {
  Box,
  styled,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  MenuItem,
  TextField,
  Paper,
  Typography,
  Button,
} from "@mui/material";
import RenderBankCheckInfos from "./renderBankCheckInfos";
import { useRecoilValue } from "recoil";
import PatientData from "@/atoms/patient";

interface PaymentTypesProps {
  index: number;
  onChangeShape: (v: any) => void;
  onRemoveShape: (i: number) => void;
  onChangeBankCheckInformations: (v: any) => void;
}

const _mock = [
  { title: "Cartão de Crédito", shape: "CREDIT_CARD" },
  { title: "Cartão de Débito", shape: "DEBIT_CARD" },
  { title: "Dinheiro", shape: "CASH" },
  { title: "Pix", shape: "PIX" },
  { title: "Cheque", shape: "BANK_CHECK" },
  { title: "Transferência Bancária", shape: "TRANSFER" },
  { title: "Fundos de Crédito", shape: "WALLET_CREDIT" },
];

const PaymentTypesPatient = (props: PaymentTypesProps) => {
  const { onChangeShape, index, onRemoveShape, onChangeBankCheckInformations } =
    props;
  const patientData = useRecoilValue(PatientData);
  const [paymentShapeString, setPaymentShapeString] = useState("");
  const [price, setPrice] = useState("0,00");
  const [splitTimes, setSplitTimes] = useState<string | null>(null);
  const [paymentShape, setPaymentShape] = useState<PaymentShapeTypes>("");
  const [modal, setModal] = useState(false);
  const handleCloseModal = () => setModal(false);

  const updateSplitBankCheck = (e: any) => setSplitTimes(e.target.value);
  const handleChange = (event: SelectChangeEvent) => {
    if (event.target.value === "Fundos de Crédito") {
      if (
        patientData?.attributes?.credits === null ||
        patientData?.attributes?.credits === 0
      ) {
        return alert("Paciente não possui créditos!");
      }
    }

    const value: any = event.target.value;
    const filter: any = _mock.filter((v) => v.title === value);
    if (value === "Cartão de Crédito" || value === "Cheque")
      setSplitTimes("1x");

    setPaymentShapeString(value);
    setPaymentShape(filter[0].shape);
  };

  useEffect(() => {
    let priceNum = parseFloat(price.replace(".", "").replace(",", "."));
    let parseSplit = splitTimes?.replaceAll("x", "");
    let splitToFloat = parseFloat?.(parseSplit ?? "");
    onChangeShape({
      shape: paymentShape,
      price: priceNum,
      split_times: splitTimes === null ? null : splitToFloat,
    });
  }, [paymentShape, price, splitTimes]);

  return (
    <>
      <Container>
        <FormControl fullWidth>
          <InputLabel id="select-payment-shape">Forma de Pagamento</InputLabel>
          <Select
            labelId="select-payment-shape"
            id="select-payment-shape"
            value={paymentShapeString}
            label="Forma de Pagamento"
            onChange={handleChange}
          >
            {_mock.map((v, i) => (
              <MenuItem key={i} value={v.title}>
                {v.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Preço"
          value={price}
          onChange={(e) => setPrice(maskValue(e.target.value))}
          sx={{ width: "100%" }}
          inputProps={{ maxLength: 10 }}
        />

        {paymentShape === "CREDIT_CARD" || paymentShape === "BANK_CHECK" ? (
          <FormControl sx={{ width: "40%" }}>
            <InputLabel id="split_times">Parcelas</InputLabel>
            <Select
              title={"Em quantas vezes quer dividir?"}
              labelId="split_times"
              id="split_times"
              value={splitTimes}
              label="Parcelas"
              onChange={updateSplitBankCheck}
            >
              {parcelado.map((v, i) => (
                <MenuItem key={i} value={v}>
                  {v}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ) : null}

        <IconButton onClick={() => onRemoveShape(index)}>
          <DeleteIcon color="error" />
        </IconButton>
      </Container>

      {paymentShape === "BANK_CHECK" && (
        <BankCheckContainer elevation={10}>
          <Typography variant="h6" textAlign="center">
            Informações dos Cheques
          </Typography>

          <Button onClick={() => setModal(true)} fullWidth color="warning">
            Editar Cheques
          </Button>
          <RenderBankCheckInfos
            onChangeCheckInformations={onChangeBankCheckInformations}
            paymentShape={paymentShape}
            splitTimes={splitTimes ?? ""}
            closeModal={handleCloseModal}
            visible={modal}
          />
        </BankCheckContainer>
      )}
    </>
  );
};

const Container = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  column-gap: 0.5rem;
  margin: 0.5rem 0;
`;

const BankCheckContainer = styled(Paper)`
  border: 2px solid #f5f5f5;
  width: 100%;
  border-radius: 1rem;
  padding: 1rem 2rem;
`;

export default PaymentTypesPatient;
