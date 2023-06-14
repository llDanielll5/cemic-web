import React, { useState } from "react";
import { Box, Typography, InputAdornment, IconButton } from "@mui/material";
import { StyledTextField } from "@/components/patient/profile";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { StyledButton } from "@/components/dynamicAdminBody/receipts";
import { useRouter } from "next/router";
import { handleLogin } from "@/services/requests/auth";

interface LoginFormLandingProps {
  email: any;
  password: any;
  setEmail: any;
  setPassword: any;
  setIsLoading: any;
}

const LoginFormLanding = (props: LoginFormLandingProps) => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const { email, password, setEmail, setPassword, setIsLoading } = props;

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleSubmit = async () => {
    if (email === "" && password === "") return alert("Preencha os campos!");
    setIsLoading(true);
    return await handleLogin({ email, password })
      .then(async (res) => {
        if (res === null || res === undefined) {
          return;
        } else if (res?.role === "admin") {
          const rout = await router.push("/admin");
          if (rout) setIsLoading(false);
        } else if (res?.role === "patient") {
          const rout = await router.push("/patient");
          if (rout) setIsLoading(false);
        } else if (res?.role === "pre-register") {
          const rout = await router.push({
            pathname: `/pre-register/${res?.id}`,
          });
          if (rout) setIsLoading(false);
        } else if (res?.role === "selected") {
          const rout = await router.push({
            pathname: `/selected/${res?.id}`,
          });
          if (rout) setIsLoading(false);
        } else if (res?.role === "professional") {
          const rout = await router.push("/professional");
          if (rout) setIsLoading(false);
        } else if (res?.role === "employee") {
          const rout = await router.push("/admin");
          if (rout) setIsLoading(false);
        } else router.push("/");
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <Box display="flex" flexDirection={"column"} rowGap={2}>
      <h3 style={{ margin: "0 0 8px 0", textAlign: "center" }}>
        Entrar com sua conta!
      </h3>

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
        <StyledButton onClick={handleSubmit}>Entrar</StyledButton>
      </Box>
      <Typography mt={1} variant="small">
        Campos com * são obrigatórios
      </Typography>
    </Box>
  );
};

export default LoginFormLanding;
