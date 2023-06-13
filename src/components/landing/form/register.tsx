import React, { useState } from "react";
import { Box, Typography, InputAdornment, IconButton } from "@mui/material";
import { StyledButton } from "@/components/dynamicAdminBody/receipts";
import { StyledTextField } from "@/components/patient/profile";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

interface RegisterLandingFormProps {
  setName: any;
  handleCPF: any;
  setEmail: any;
  setPassword: any;
  handleSubmit: any;
  name: any;
  cpf: any;
  email: any;
  password: any;
}

const RegisterLandingForm = (props: RegisterLandingFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const {
    cpf,
    email,
    handleCPF,
    handleSubmit,
    name,
    password,
    setEmail,
    setName,
    setPassword,
  } = props;

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  return (
    <Box display="flex" flexDirection={"column"} rowGap={2}>
      <h3 style={{ margin: "0 0 8px 0", textAlign: "center" }}>
        Cadastre-se no Projeto agora!
      </h3>
      <StyledTextField
        label="Nome Completo*"
        onChange={(e) => setName(e.target.value)}
        value={name}
      />
      <StyledTextField
        label="CPF*"
        onChange={(e) => handleCPF(e.target.value)}
        inputProps={{ maxLength: 14 }}
        value={cpf}
      />
      <StyledTextField
        label="Email*"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <StyledTextField
        label="Senha*"
        type={showPassword ? "text" : "password"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
              >
                {showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <Box>
        <StyledButton onClick={handleSubmit}>Cadastrar</StyledButton>
      </Box>
      <Typography mt={1} variant="small">
        Campos com * são obrigatórios
      </Typography>
    </Box>
  );
};

export default RegisterLandingForm;
