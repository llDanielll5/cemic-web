/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { parcelado } from "data";
import { PaymentShapeTypes, paymentShapeTypeString } from "types/payments";
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
  Autocomplete,
  Stack,
  Card,
} from "@mui/material";
import CurrencyInput, { formatCurrencyBRL } from "@/components/currencyInput";
import BasicDialogModal from "@/components/modal/basic-dialog-modal";
import RenderBankCheckInfos from "./renderBankCheckInfos";
import PatientData from "@/atoms/patient";
import { useRecoilValue } from "recoil";
import { parseToBrl } from "../modals/receipt-preview";
import { toast } from "react-toastify";
import ChangeWalletValues from "./change-wallet-values";

interface PaymentTypesProps {
  index: number;
  fundCredits: StrapiData<FundCreditsInterface>[];
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

interface ExtendedPaymentShapesInterface extends PaymentShapesInterface {
  priceString: string;
  creditAdditionalValueString: string;
  fundCreditPayment: PaymentsInterface;
}

const PaymentTypesPatient = (props: PaymentTypesProps) => {
  const {
    onChangeShape,
    index,
    fundCredits,
    onRemoveShape,
    onChangeBankCheckInformations,
  } = props;
  const patientData = useRecoilValue(PatientData);
  const [paymentShapeString, setPaymentShapeString] = useState("");
  const [price, setPrice] = useState("0,00");
  const [modal, setModal] = useState(false);
  const [priceFloat, setPriceFloat] = useState(0);
  const [splitTimes, setSplitTimes] = useState<string | null>(null);
  const [paymentShape, setPaymentShape] = useState<PaymentShapeTypes>("");
  const [creditAdditional, setCreditAdditional] = useState(0);
  const [changeWalletValueModal, setChangeWalletValueModal] = useState(false);
  const [selectedFundCredits, setSelectedFundCredits] =
    useState<StrapiData<FundCreditsInterface> | null>(null);
  const [fundCreditPaymentShapes, setFundCreditPaymentShapes] = useState<
    ExtendedPaymentShapesInterface[]
  >([]);
  const [creditAdditionalValue, setCreditAdditionalValue] = useState({
    string: "",
    number: 0,
  });
  const handleCloseModal = () => setModal(false);

  const handleCreditValidation = (e: any) => {
    const reg = new RegExp("[0-9]");
    if (reg.test(e.target.value)) {
      setCreditAdditional(e.target.value);
    }
  };

  const updateSplitBankCheck = (e: any) => setSplitTimes(e.target.value);
  const handleChange = (event: SelectChangeEvent) => {
    if (event.target.value === "Fundos de Crédito") {
      // console.log(patientData?.attributes);
      // if (
      //   patientData?.attributes?.credits === null ||
      //   patientData?.attributes?.credits === 0
      // ) {
      //   return toast.error("Paciente não possui créditos!");
      // }
    }

    const value: any = event.target.value;
    const filter: any = _mock.filter((v) => v.title === value);
    if (value === "Cartão de Crédito" || value === "Cheque")
      setSplitTimes("1x");

    setPaymentShapeString(value);
    setPaymentShape(filter[0].shape);
  };

  useEffect(() => {
    let parseSplit = splitTimes?.replaceAll("x", "");
    let splitToFloat = parseFloat?.(parseSplit ?? "");
    onChangeShape({
      shape: paymentShape,
      price: priceFloat,
      split_times: splitTimes === null ? null : splitToFloat,
      creditAdditional,
      fundCredits: selectedFundCredits,
      creditAdditionalValue: creditAdditionalValue.number,
      fundCreditPaymentShapes: fundCreditPaymentShapes,
    });
  }, [
    paymentShape,
    price,
    splitTimes,
    creditAdditional,
    creditAdditionalValue,
    fundCreditPaymentShapes,
  ]);

  return (
    <>
      <Container>
        <FormControl sx={{ width: "30%" }}>
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

        <BasicDialogModal
          maxWidth="md"
          open={changeWalletValueModal}
          onClose={() => setChangeWalletValueModal(!changeWalletValueModal)}
        >
          <ChangeWalletValues
            onChangeFundCredit={(shape) => {
              setFundCreditPaymentShapes(shape);
              setChangeWalletValueModal(!changeWalletValueModal);
            }}
            stateValue={fundCreditPaymentShapes}
          />
        </BasicDialogModal>

        {paymentShape === "WALLET_CREDIT" && (
          <Autocomplete
            options={fundCredits}
            sx={{ width: "30%" }}
            isOptionEqualToValue={(option, value) => option?.id === value?.id}
            getOptionLabel={(option) => {
              const payment = option.attributes
                .payment as unknown as StrapiRelation<
                StrapiData<PaymentsInterface>
              >;
              const strapiPayment = payment.data.attributes;
              const fundCredit = option.attributes;
              const totalValue =
                fundCredit.max_used_value - fundCredit.used_value;

              return `${new Date(
                strapiPayment.date as Date
              ).toLocaleDateString()} => Crédito de ${parseToBrl(
                totalValue || 0
              )}`;
            }}
            onChange={(e, v) => {
              if (v === null) return;
              const strapiPayment = v?.attributes
                .payment as unknown as StrapiRelation<
                StrapiData<PaymentsInterface>
              >;
              const walletPaymentShapes =
                strapiPayment.data.attributes.payment_shapes;
              const hasCreditCard =
                strapiPayment.data.attributes.payment_shapes.filter(
                  (k) => k.shape === "CREDIT_CARD"
                ).length > 0;

              const paymentShapesValues =
                strapiPayment.data.attributes.payment_shapes.map(
                  (k) => k.price
                );
              const reducedPaymentShapes = paymentShapesValues.reduce(
                (prev, curr) => prev + curr,
                0
              );
              const paymentDetails = strapiPayment.data.attributes;
              setFundCreditPaymentShapes(
                walletPaymentShapes.map((i) => {
                  return {
                    ...i,
                    priceString: parseToBrl(i.price),
                    creditAdditionalValueString: parseToBrl(
                      i.creditAdditionalValue
                    ),
                    fundCreditPayment: paymentDetails,
                  };
                }) as ExtendedPaymentShapesInterface[]
              );

              const totalValue = hasCreditCard
                ? reducedPaymentShapes
                : strapiPayment.data.attributes.total_value;
              const value = totalValue - v?.attributes?.used_value || 0;
              const stringValue = formatCurrencyBRL(value);
              setSelectedFundCredits(v);
              setPriceFloat(value);
              setPrice(stringValue as string);
            }}
            renderInput={(props) => (
              <TextField
                {...props}
                label="Pagamentos Parciais antigos"
                title="Selecione um ou vários pagamentos anteriores do paciente"
              />
            )}
          />
        )}

        {paymentShape !== "WALLET_CREDIT" && (
          <CurrencyInput
            label="Preço"
            value={price}
            onChange={(formatted, numeric) => {
              setPrice(formatted);
              setPriceFloat(numeric);
            }}
            sx={{ width: "30%" }}
            inputProps={{ maxLength: 10 }}
          />
        )}
        {paymentShape === "WALLET_CREDIT" && (
          <Button
            variant="contained"
            sx={{ width: "max-content" }}
            onClick={() => setChangeWalletValueModal(true)}
          >
            Mudar Valores do Crédito
          </Button>
        )}

        {paymentShape === "CREDIT_CARD" && (
          <CurrencyInput
            label="Valor Acréscimo"
            value={creditAdditionalValue.string}
            onChange={(formatted, numeric) => {
              setCreditAdditionalValue({ string: formatted, number: numeric });
            }}
            sx={{ width: "30%" }}
            inputProps={{ maxLength: 10 }}
          />
        )}

        {paymentShape === "CREDIT_CARD" || paymentShape === "BANK_CHECK" ? (
          <FormControl sx={{ width: "20%" }}>
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

        {paymentShape === "CREDIT_CARD" && (
          <TextField
            title="Acréscimo de Crédito"
            type="number"
            label="Acréscimo (%)"
            value={creditAdditional}
            onChange={handleCreditValidation}
            sx={{ width: "15%" }}
          />
        )}

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
