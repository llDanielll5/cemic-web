import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  TextFieldProps,
} from "@mui/material";
import { useField } from "formik";
import { forwardRef, useState } from "react";
import { IMaskInput as IMask } from "react-imask";

// ---------- Máscaras ----------
interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

const masks = {
  currency: forwardRef<HTMLInputElement, CustomProps>(function Mask(
    props,
    ref
  ) {
    const { onChange, ...other } = props;
    return (
      <IMask
        {...other}
        mask="R$ num"
        blocks={{
          num: {
            mask: Number,
            thousandsSeparator: ".",
            radix: ",",
            scale: 2,
            padFractionalZeros: true,
            normalizeZeros: true,
          },
        }}
        inputRef={ref}
        onAccept={(value: any) =>
          onChange({ target: { name: props.name, value } })
        }
      />
    );
  }),
  phone: forwardRef<HTMLInputElement, CustomProps>(function Mask(props, ref) {
    const { onChange, ...other } = props;
    return (
      <IMask
        {...other}
        mask="(00) 00000-0000"
        inputRef={ref}
        onAccept={(value: any) =>
          onChange({ target: { name: props.name, value } })
        }
      />
    );
  }),
  cep: forwardRef<HTMLInputElement, CustomProps>(function Mask(props, ref) {
    const { onChange, ...other } = props;
    return (
      <IMask
        {...other}
        mask="00000-000"
        inputRef={ref}
        onAccept={(value: any) =>
          onChange({ target: { name: props.name, value } })
        }
      />
    );
  }),
  cpf: forwardRef<HTMLInputElement, CustomProps>(function Mask(props, ref) {
    const { onChange, ...other } = props;
    return (
      <IMask
        {...other}
        mask="000.000.000-00"
        inputRef={ref}
        onAccept={(value: any) =>
          onChange({ target: { name: props.name, value } })
        }
      />
    );
  }),
  hour: forwardRef<HTMLInputElement, CustomProps>(function Mask(props, ref) {
    const { onChange, ...other } = props;
    return (
      <IMask
        {...other}
        mask="00:00"
        inputRef={ref}
        onAccept={(value: any) =>
          onChange({ target: { name: props.name, value } })
        }
      />
    );
  }),
  hourMinutes: forwardRef<HTMLInputElement, CustomProps>(function Mask(
    props,
    ref
  ) {
    const { onChange, ...other } = props;
    return (
      <IMask
        {...other}
        mask="00:00:00"
        inputRef={ref}
        onAccept={(value: any) =>
          onChange({ target: { name: props.name, value } })
        }
      />
    );
  }),
  cnpj: forwardRef<HTMLInputElement, CustomProps>(function Mask(props, ref) {
    const { onChange, ...other } = props;
    return (
      <IMask
        {...other}
        mask="00.000.000/0000-00"
        inputRef={ref}
        onAccept={(value: any) =>
          onChange({ target: { name: props.name, value } })
        }
      />
    );
  }),
  cardNumber: forwardRef<HTMLInputElement, CustomProps>(function Mask(
    props,
    ref
  ) {
    const { onChange, ...other } = props;
    return (
      <IMask
        {...other}
        mask="0000 0000 0000 0000"
        inputRef={ref}
        onAccept={(value: any) =>
          onChange({ target: { name: props.name, value } })
        }
      />
    );
  }),
  cvv: forwardRef<HTMLInputElement, CustomProps>(function Mask(props, ref) {
    const { onChange, ...other } = props;
    return (
      <IMask
        {...other}
        mask="000"
        inputRef={ref}
        onAccept={(value: any) =>
          onChange({ target: { name: props.name, value } })
        }
      />
    );
  }),
  cardValidation: forwardRef<HTMLInputElement, CustomProps>(function Mask(
    props,
    ref
  ) {
    const { onChange, ...other } = props;
    return (
      <IMask
        {...other}
        mask="00/0000"
        inputRef={ref}
        onAccept={(value: any) =>
          onChange({ target: { name: props.name, value } })
        }
      />
    );
  }),
};

// ---------- Tipagem ----------
type CustomTextFieldProps = TextFieldProps & {
  name: string;
  hasPassword?: boolean;
  croUfAddon?: boolean;
  mask?:
    | "cnpj"
    | "cep"
    | "cpf"
    | "phone"
    | "hour"
    | "hourMinutes"
    | "currency"
    | "cvv"
    | "cardNumber"
    | "cardValidation";
};

// ---------- Componente Principal ----------
const CustomTextField: React.FC<CustomTextFieldProps> = ({
  name,
  croUfAddon,
  mask,
  hasPassword,
  ...props
}) => {
  const [field, meta] = useField(name);
  const [showPassword, setShowPassword] = useState(false);
  const [croUf, setCroUf] = useState("DF");

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const handleCroChange = (e: any) => {
    const rawCro = field.value.split("-")[0] || "";
    const newCro = `${rawCro}-${e.target.value}`;
    setCroUf(e.target.value);
    field.onChange({ target: { name, value: newCro } });
  };

  const handleCroNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const onlyNumber = e.target.value.replace(/\D/g, "");
    field.onChange({ target: { name, value: `${onlyNumber}-${croUf}` } });
  };

  const ufList = [
    "AC",
    "AL",
    "AP",
    "AM",
    "BA",
    "CE",
    "DF",
    "ES",
    "GO",
    "MA",
    "MT",
    "MS",
    "MG",
    "PA",
    "PB",
    "PR",
    "PE",
    "PI",
    "RJ",
    "RN",
    "RS",
    "RO",
    "RR",
    "SC",
    "SP",
    "SE",
    "TO",
  ];

  const inputProps =
    mask && masks[mask]
      ? { inputComponent: masks[mask] as any }
      : hasPassword
      ? {
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={handleClickShowPassword}>
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }
      : croUfAddon
      ? {
          endAdornment: (
            <InputAdornment position="end">
              <Select
                value={croUf}
                onChange={handleCroChange}
                size="small"
                variant="standard"
                disableUnderline
              >
                {ufList.map((uf) => (
                  <MenuItem key={uf} value={uf}>
                    {uf}
                  </MenuItem>
                ))}
              </Select>
            </InputAdornment>
          ),
        }
      : undefined;

  return (
    <TextField
      {...field}
      {...props}
      fullWidth
      type={hasPassword ? (showPassword ? "text" : "password") : props.type}
      error={Boolean(meta.touched && meta.error)}
      helperText={meta.touched && meta.error}
      value={field.value}
      onChange={croUfAddon ? handleCroNumberChange : field.onChange}
      InputProps={inputProps}
    />
  );
};

export default CustomTextField;
