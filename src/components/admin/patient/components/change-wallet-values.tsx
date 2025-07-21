import React, { useCallback, useEffect, useState } from "react";
import {
  Button,
  Card,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import CurrencyInput from "@/components/currencyInput";
import { paymentShapeTypeString } from "types/payments";

interface ExtendedPaymentShapesInterface extends PaymentShapesInterface {
  priceString: string;
  creditAdditionalValueString: string;
  fundCreditPayment: PaymentsInterface;
}

interface ChangeWalletValuesProps {
  onChangeFundCredit: (shape: ExtendedPaymentShapesInterface[]) => void;
  stateValue: ExtendedPaymentShapesInterface[];
}

const ChangeWalletValues = ({
  onChangeFundCredit,
  stateValue,
}: ChangeWalletValuesProps) => {
  const [fundCreditPaymentShapes, setFundCreditPaymentShapes] =
    useState<ExtendedPaymentShapesInterface[]>(stateValue);

  const handleSubmit = () => {
    onChangeFundCredit(fundCreditPaymentShapes);
  };

  return (
    <Stack>
      <Typography variant="h6">
        Selecionar parte de Valores da Forma de Pagamento
      </Typography>

      <Card elevation={9} sx={{ p: 1, mt: 2 }}>
        <Stack direction={"column"} gap={1}>
          {fundCreditPaymentShapes.map((fps, ind) => {
            const hasPassedPrice =
              fps.price > fps.fundCreditPayment?.payment_shapes[ind]?.price;
            console.log(fps.fundCreditPayment?.payment_shapes[ind]?.price);
            return (
              <Stack width={"100%"} key={ind} direction={"row"} gap={1}>
                <FormControl fullWidth>
                  <InputLabel id="select-payment-shape">
                    Forma de Pagamento
                  </InputLabel>
                  <Select
                    labelId="select-payment-shape"
                    id="select-payment-shape"
                    value={paymentShapeTypeString[fps.shape]}
                    label="Forma de Pagamento"
                  >
                    <MenuItem value={paymentShapeTypeString[fps.shape]}>
                      {paymentShapeTypeString[fps.shape]}
                    </MenuItem>
                  </Select>
                </FormControl>
                <CurrencyInput
                  label={`Valor ${paymentShapeTypeString[fps.shape]}`}
                  value={fps.priceString}
                  error={Boolean(hasPassedPrice)}
                  helperText={hasPassedPrice && `O valor Passou`}
                  onChange={(formatted, numeric) => {
                    const fundClone = [...fundCreditPaymentShapes];
                    const index = fundCreditPaymentShapes.findIndex(
                      (v, i) => i === ind
                    );
                    fundClone[index].priceString = formatted;
                    fundClone[index].price = numeric;
                    setFundCreditPaymentShapes(fundClone);
                  }}
                  sx={{ width: "100%" }}
                  inputProps={{ maxLength: 10 }}
                />
                <CurrencyInput
                  label="Valor Acréscimo"
                  value={fps.creditAdditionalValueString}
                  onChange={(formatted, numeric) => {
                    console.log({ fundCreditPaymentShapes });

                    const fundClone = [...fundCreditPaymentShapes];
                    const index = fundCreditPaymentShapes.findIndex(
                      (v, i) => i === ind
                    );
                    fundClone[index].creditAdditionalValueString = formatted;
                    fundClone[index].creditAdditionalValue = numeric;
                    setFundCreditPaymentShapes(fundClone);
                  }}
                  sx={{ width: "100%" }}
                  inputProps={{ maxLength: 10 }}
                />
              </Stack>
            );
          })}

          <Button onClick={handleSubmit} variant="contained" fullWidth>
            Utilizar Valores
          </Button>
        </Stack>
      </Card>
    </Stack>
  );
};

export default ChangeWalletValues;
