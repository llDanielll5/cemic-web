import React from "react";
import { TextField, InputAdornment, TextFieldProps } from "@mui/material";

export function formatCurrencyBRL(value: number | string) {
  const numeric =
    typeof value === "string"
      ? parseFloat(value.replace(/\D/g, "")) / 100
      : value;

  if (isNaN(numeric)) return "";

  return numeric.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }); // <--- sem 'currency' style
}

export function unmaskCurrencyBRL(value: string) {
  const numeric = value.replace(/\D/g, "");
  return parseFloat(numeric) / 100;
}

type CurrencyInputProps = {
  label?: string;
  value?: string;
  onChange?: (formattedValue: string, numericValue: number) => void;
} & Omit<TextFieldProps, "onChange" | "value">;

const CurrencyInput: React.FC<CurrencyInputProps> = ({
  label = "Valor",
  value = "",
  onChange,
  ...rest
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const numeric = unmaskCurrencyBRL(raw);
    const formatted = formatCurrencyBRL(numeric);
    if (onChange) onChange(formatted, numeric);
  };

  return (
    <TextField
      label={label}
      value={value}
      onChange={handleChange}
      InputProps={{
        startAdornment: <InputAdornment position="start">R$</InputAdornment>,
        ...rest.InputProps,
      }}
      {...rest}
    />
  );
};

export default CurrencyInput;
