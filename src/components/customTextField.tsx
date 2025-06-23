import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
  IconButton,
  InputAdornment,
  TextField,
  TextFieldProps,
} from "@mui/material";
import { useField } from "formik";
import { forwardRef, useState } from "react";
import { IMaskInput as IMask } from "react-imask";

interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

export const TextCurrencyBRLCustom = forwardRef<HTMLInputElement, CustomProps>(
  function TextCurrencyBRLCustom(props, ref) {
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
        definitions={{
          "#": /[1-9]/,
        }}
        inputRef={ref}
        onAccept={(value: any) =>
          onChange({ target: { name: props.name, value } })
        }
      />
    );
  }
);

export const TextPhoneCustom = forwardRef<HTMLInputElement, CustomProps>(
  function TextPhoneCustom(props, ref) {
    const { onChange, ...other } = props;
    return (
      <IMask
        {...other}
        mask={"(00) 00000-0000"}
        definitions={{
          "#": /[1-9]/,
        }}
        inputRef={ref}
        onAccept={(value: any) =>
          onChange({ target: { name: props.name, value } })
        }
      />
    );
  }
);

export const TextCepCustom = forwardRef<HTMLInputElement, CustomProps>(
  function TextCepCustom(props, ref) {
    const { onChange, ...other } = props;
    return (
      <IMask
        {...other}
        mask={"00000-000"}
        definitions={{
          "#": /[1-9]/,
        }}
        inputRef={ref}
        onAccept={(value: any) =>
          onChange({ target: { name: props.name, value } })
        }
      />
    );
  }
);

export const TextCNPJCustom = forwardRef<HTMLInputElement, CustomProps>(
  function TextCNPJCustom(props, ref) {
    const { onChange, ...other } = props;
    return (
      <IMask
        {...other}
        mask={"00.000.000/0000-00"}
        definitions={{
          "#": /[1-9]/,
        }}
        inputRef={ref}
        onAccept={(value: any) =>
          onChange({ target: { name: props.name, value } })
        }
      />
    );
  }
);

export const TextHourCustom = forwardRef<HTMLInputElement, CustomProps>(
  function TextPhoneCustom(props, ref) {
    const { onChange, ...other } = props;
    return (
      <IMask
        {...other}
        mask={"00:00"}
        definitions={{
          "#": /[1-9]/,
        }}
        inputRef={ref}
        onAccept={(value: any) =>
          onChange({ target: { name: props.name, value } })
        }
      />
    );
  }
);

export const TextHourMinutesCustom = forwardRef<HTMLInputElement, CustomProps>(
  function TextPhoneCustom(props, ref) {
    const { onChange, ...other } = props;
    return (
      <IMask
        {...other}
        mask={"00:00:00"}
        definitions={{
          "#": /[1-9]/,
        }}
        inputRef={ref}
        onAccept={(value: any) =>
          onChange({ target: { name: props.name, value } })
        }
      />
    );
  }
);

export const TextCPFCustom = forwardRef<HTMLInputElement, CustomProps>(
  function TextCPFCustom(props, ref) {
    const { onChange, ...other } = props;
    return (
      <IMask
        {...other}
        mask={"000.000.000-00"}
        definitions={{
          "#": /[1-9]/,
        }}
        inputRef={ref}
        onAccept={(value: any) =>
          onChange({ target: { name: props.name, value } })
        }
      />
    );
  }
);
export const TextCardNumberMask = forwardRef<HTMLInputElement, CustomProps>(
  function TextCardNumberMask(props, ref) {
    const { onChange, ...other } = props;
    return (
      <IMask
        {...other}
        mask={"0000 0000 0000 0000"}
        definitions={{
          "#": /[1-9]/,
        }}
        inputRef={ref}
        onAccept={(value: any) =>
          onChange({ target: { name: props.name, value } })
        }
      />
    );
  }
);
export const TextCVVMask = forwardRef<HTMLInputElement, CustomProps>(
  function TextCVVMask(props, ref) {
    const { onChange, ...other } = props;
    return (
      <IMask
        {...other}
        mask={"000"}
        definitions={{
          "#": /[1-9]/,
        }}
        inputRef={ref}
        onAccept={(value: any) =>
          onChange({ target: { name: props.name, value } })
        }
      />
    );
  }
);
export const TextCardValidation = forwardRef<HTMLInputElement, CustomProps>(
  function TextCardValidation(props, ref) {
    const { onChange, ...other } = props;
    return (
      <IMask
        {...other}
        mask={"00/0000"}
        definitions={{
          "#": /[1-9]/,
        }}
        inputRef={ref}
        onAccept={(value: any) =>
          onChange({ target: { name: props.name, value } })
        }
      />
    );
  }
);

type CustomTextFieldProps = TextFieldProps & {
  name: string; // Obrigatório para identificar o campo no Formik
  hasPassword?: boolean;
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

const CustomTextField: React.FC<CustomTextFieldProps> = ({
  name,
  ...props
}) => {
  const [field, meta] = useField(name);
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  return (
    <TextField
      {...field}
      {...props}
      fullWidth
      type={
        props.hasPassword ? (showPassword ? "text" : "password") : props.type
      }
      error={Boolean(meta.touched && meta.error)}
      helperText={meta.touched && meta.error}
      InputProps={
        props.mask
          ? props.mask === "cnpj"
            ? { inputComponent: TextCNPJCustom as any }
            : props.mask === "cep"
            ? { inputComponent: TextCepCustom as any }
            : props.mask === "cpf"
            ? { inputComponent: TextCPFCustom as any }
            : props.mask === "phone"
            ? { inputComponent: TextPhoneCustom as any }
            : props.mask === "hour"
            ? { inputComponent: TextHourCustom as any }
            : props.mask === "currency"
            ? { inputComponent: TextCurrencyBRLCustom as any }
            : props.mask === "cvv"
            ? { inputComponent: TextCVVMask as any }
            : props.mask === "cardNumber"
            ? { inputComponent: TextCardNumberMask as any }
            : props.mask === "cardValidation"
            ? { inputComponent: TextCardValidation as any }
            : props.mask === "hourMinutes"
            ? { inputComponent: TextHourMinutesCustom as any }
            : undefined
          : props.hasPassword
          ? {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                  >
                    {!showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }
          : undefined
      }
    />
  );
};

export default CustomTextField;
