import React from "react";
import {
  Card,
  Checkbox,
  FormControlLabel,
  Unstable_Grid2 as Grid,
  Stack,
  Typography,
} from "@mui/material";

const SettingsPermissions: React.FC = () => {
  return (
    <Grid xs={12} sm={6} md={4}>
      <Card elevation={5} sx={{ p: 2 }}>
        <Stack spacing={1}>
          <Typography variant="h6">Pacientes</Typography>
          <Stack>
            <FormControlLabel
              control={<Checkbox defaultChecked />}
              label="Habilitar"
            />
            <FormControlLabel
              control={<Checkbox defaultChecked />}
              label="Ler"
            />
            <FormControlLabel control={<Checkbox />} label="Alterar" />
            <FormControlLabel
              control={<Checkbox defaultChecked />}
              label="Ler e Alterar"
            />
          </Stack>
        </Stack>
      </Card>
    </Grid>
  );
};

export default SettingsPermissions;
