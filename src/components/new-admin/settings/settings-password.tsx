import { useCallback, useState } from "react";
import {
  Alert,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Snackbar,
  Stack,
  TextField,
} from "@mui/material";
import { changePasswordOption } from "@/axios/auth";

export const SettingsPassword = () => {
  const [surface, setSurface] = useState(false);
  const [surfaceMsg, setSurfaceMsg] = useState("");
  const [surfaceColor, setSurfaceColor] = useState<
    "success" | "error" | "warning"
  >("success");
  const [values, setValues] = useState({
    currentPassword: "",
    password: "",
    passwordConfirmation: "",
  });

  const handleChange = useCallback((event: any) => {
    setValues((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  }, []);

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    return await changePasswordOption(values).then(
      (res) => {
        setSurface(true);
        setSurfaceMsg("Senha alterada com sucesso!");
        setSurfaceColor("success");
        setValues({
          password: "",
          currentPassword: "",
          passwordConfirmation: "",
        });
      },
      (err) => {
        setSurface(true);
        setSurfaceColor("error");
        setSurfaceMsg(
          "Não foi possível alterar sua senha! Err:" + err.error.message
        );
      }
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      <Snackbar
        open={surface}
        message={surfaceMsg}
        anchorOrigin={{ horizontal: "right", vertical: "top" }}
        autoHideDuration={2000}
        onClose={() => setSurface(!surface)}
      >
        <Alert
          onClose={() => setSurface(!surface)}
          severity={surfaceColor}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {surfaceMsg}
        </Alert>
      </Snackbar>
      <Card>
        <CardHeader subheader="Alterar sua Senha" title="Segurança" />
        <Divider />
        <CardContent>
          <Stack spacing={3} sx={{ maxWidth: 400 }}>
            <TextField
              fullWidth
              label="Senha Atual"
              name="currentPassword"
              onChange={handleChange}
              type="password"
              value={values.currentPassword}
            />
            <TextField
              fullWidth
              label="Senha"
              name="password"
              onChange={handleChange}
              type="password"
              value={values.password}
            />
            <TextField
              fullWidth
              label="Confirmar Senha"
              name="passwordConfirmation"
              onChange={handleChange}
              type="password"
              value={values.passwordConfirmation}
            />
          </Stack>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: "flex-end" }}>
          <Button variant="contained" type="submit">
            Alterar
          </Button>
        </CardActions>
      </Card>
    </form>
  );
};
