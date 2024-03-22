import { forwardRef, useState } from "react";
import Head from "next/head";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { Layout as AuthLayout } from "src/layouts/auth/layout";
import { useFormik } from "formik";
import * as Yup from "yup";
import { IMaskInput as IMask } from "react-imask";
import { nameCapitalized } from "@/services/services";
import Loading from "@/components/loading";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Box,
  Button,
  InputAdornment,
  Link,
  MenuItem,
  Stack,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import CModal from "@/components/modal";
import { handleRegister } from "@/axios/auth";
import { useRecoilState } from "recoil";
import UserData from "@/atoms/userData";

const roleValues = [
  {
    value: "ADMIN",
    label: "Administrador",
  },
  {
    value: "EMPLOYEE",
    label: "Funcionário",
  },
  {
    value: "DENTIST",
    label: "Dentista",
  },
  {
    value: "PROSTHETIC",
    label: "Protético",
  },
];

interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

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

const RegisterPage = () => {
  const router = useRouter();
  const [userData, setUserData] = useRecoilState(UserData);
  const [code, setCode] = useState("");
  const [chances, setChances] = useState(3);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPartnerModal, setConfirmPartnerModal] = useState(true);

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      name: "",
      password: "",
      phone: "",
      cpf: "",
      rg: "",
      dateBorn: "",
      role: "",
      submit: null,
    },
    validationSchema: Yup.object({
      username: Yup.string().required(),
      email: Yup.string()
        .email("Digite um email válido")
        .max(255)
        .required("Email é obrigatório"),
      name: Yup.string().max(255).required("Nome é obrigatório"),
      password: Yup.string().max(255).required("Senha é obrigatória"),
      cpf: Yup.string()
        .min(14, "CPF deve conter no mínimo 11 digitos")
        .required("CPF é obrigatório"),
      phone: Yup.string()
        .min(15, "Telefone deve conter o número mínimo de caracteres")
        .required("Telefone obrigatório"),
      rg: Yup.string().required("RG obrigatório."),
      role: Yup.string().required(
        "Você deve informar qual sua função na CEMIC."
      ),
    }),
    onSubmit: async (values, helpers) => {
      const { cpf, email, name, phone, rg, password, role, username } = values;
      const phoneReplaced = phone!
        .replace("(", "")
        .replace(")", "")
        .replace("-", "")
        .replace(" ", "");
      const cpfReplaced = cpf!
        .replace(".", "")
        .replace("-", "")
        .replace(".", "");
      const completeName = nameCapitalized(name);
      setIsLoading(true);
      setLoadingMessage("Verificando informações digitadas.");

      const data = {
        username,
        cpf: cpfReplaced,
        email,
        name: completeName,
        phone: phoneReplaced,
        rg: rg.toString(),
        password,
        role,
      };

      try {
        return await handleRegister(data)
          .then(() => {
            setIsLoading(false);
            return router.push("/auth/login");
          })
          .catch((error) => {
            if (error.response) console.log(error.response.data.error.details);
            console.log(error.response);
            setIsLoading(false);
            return alert("Erroooooo");
          });
      } catch (err: any) {
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }
    },
  });

  const handleTogglePasswordVisible = (e: any) =>
    setPasswordVisible(!passwordVisible);

  const handleVerify = () => {
    if (code === process.env.ADMIN_PASSWORD)
      return setConfirmPartnerModal(false);
    else {
      setChances((prev) => prev - 1);
      if (chances === 0) {
        router.push("/auth/login");
      } else
        return alert(`Código incorreto. Você tem mais ${chances} chance(s)`);
    }
  };
  const handlePressVerify = ({ key }: any) => {
    if (key === "Enter") return handleVerify();
  };

  return (
    <>
      <Head>
        <title>Registrar sua conta na CEMIC!</title>
      </Head>
      {isLoading && <Loading message={loadingMessage} />}
      <CModal visible={confirmPartnerModal} closeModal={() => {}}>
        <Typography variant="subtitle1">
          Digite o código de administrador:
        </Typography>
        <TextField
          onChange={(e) => setCode(e.target.value)}
          label="Código de Parceiro"
          value={code}
          onKeyDown={handlePressVerify}
          type={"password"}
          fullWidth
          sx={{ mt: 2 }}
        />
        <Button
          fullWidth
          size="large"
          sx={{ mt: 3 }}
          type="submit"
          variant="contained"
          onClick={handleVerify}
        >
          Verificar código
        </Button>
      </CModal>
      <Container>
        <InnerContainer>
          <div>
            <Stack spacing={1} sx={{ mb: 3 }}>
              <Typography variant="h4">Registrar</Typography>
              <Typography color="text.secondary" variant="body2">
                Já possui uma conta? &nbsp;
                <Link
                  component={NextLink}
                  href="/auth/login"
                  underline="hover"
                  variant="subtitle2"
                >
                  Entrar
                </Link>
              </Typography>
            </Stack>
            <form noValidate onSubmit={formik.handleSubmit}>
              <Stack spacing={3}>
                <TextField
                  error={!!(formik.touched.username && formik.errors.username)}
                  fullWidth
                  helperText={formik.touched.username && formik.errors.username}
                  label="Nickname*"
                  name="username"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.username}
                />
                <TextField
                  error={!!(formik.touched.name && formik.errors.name)}
                  fullWidth
                  helperText={formik.touched.name && formik.errors.name}
                  label="Nome Completo*"
                  name="name"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.name}
                />
                <TextField
                  error={!!(formik.touched.email && formik.errors.email)}
                  fullWidth
                  helperText={formik.touched.email && formik.errors.email}
                  label="Email*"
                  name="email"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="email"
                  value={formik.values.email}
                />
                <Box display="flex" columnGap={2}>
                  <TextField
                    label="Telefone*"
                    name="phone"
                    error={!!(formik.touched.phone && formik.errors.phone)}
                    onChange={formik.handleChange}
                    value={formik.values.phone}
                    inputProps={{ maxLength: 15 }}
                    InputProps={{ inputComponent: TextPhoneCustom as any }}
                    fullWidth
                    helperText={formik.touched.phone && formik.errors.phone}
                    onBlur={formik.handleBlur}
                  />
                  <TextField
                    label="CPF*"
                    name="cpf"
                    error={!!(formik.touched.cpf && formik.errors.cpf)}
                    InputProps={{ inputComponent: TextCPFCustom as any }}
                    inputProps={{ maxLength: 14 }}
                    onChange={formik.handleChange}
                    value={formik.values.cpf}
                    fullWidth
                    helperText={formik.touched.cpf && formik.errors.cpf}
                    onBlur={formik.handleBlur}
                  />
                </Box>
                <Box display="flex" columnGap={2}>
                  <TextField
                    label="RG*"
                    name="rg"
                    error={!!(formik.touched.rg && formik.errors.rg)}
                    onChange={formik.handleChange}
                    value={formik.values.rg}
                    fullWidth
                    helperText={formik.touched.rg && formik.errors.rg}
                    onBlur={formik.handleBlur}
                    type="number"
                  />
                  <TextField
                    error={
                      !!(formik.touched.password && formik.errors.password)
                    }
                    fullWidth
                    helperText={
                      formik.touched.password && formik.errors.password
                    }
                    label="Senha de acesso*"
                    name="password"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type={!passwordVisible ? "password" : "text"}
                    value={formik.values.password}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          {!passwordVisible ? (
                            <VisibilityIcon
                              onClick={handleTogglePasswordVisible}
                              sx={{ cursor: "pointer" }}
                            />
                          ) : (
                            <VisibilityOffIcon
                              onClick={handleTogglePasswordVisible}
                              sx={{ cursor: "pointer" }}
                            />
                          )}
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
                <TextField
                  label="O que você é na CEMIC?*"
                  name="role"
                  error={!!(formik.touched.role && formik.errors.role)}
                  select
                  onChange={formik.handleChange}
                  value={formik.values.role}
                  fullWidth
                  helperText={formik.touched.role && formik.errors.role}
                  onBlur={formik.handleBlur}
                >
                  {roleValues.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Stack>
              {formik.errors.submit && (
                <Typography color="error" sx={{ mt: 3 }} variant="body2">
                  {formik.errors.submit}
                </Typography>
              )}
              <Button
                fullWidth
                size="large"
                sx={{ mt: 3 }}
                type="submit"
                variant="contained"
              >
                Continue
              </Button>
            </form>
          </div>
        </InnerContainer>
      </Container>
    </>
  );
};

RegisterPage.getLayout = (page: any) => <AuthLayout>{page}</AuthLayout>;

const Container = styled(Box)`
  flex: 1 1 auto;
  align-items: center;
  display: flex;
  justify-content: center;
`;
const InnerContainer = styled(Box)`
  max-width: 550px;
  padding: 100px 24px;
  width: 100%;
`;

export default RegisterPage;
