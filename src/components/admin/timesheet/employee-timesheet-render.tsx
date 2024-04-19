import React from "react";
import CheckboxButton from "@/components/checkboxButton";
import {
  Box,
  Button,
  Card,
  Divider,
  Stack,
  Typography,
  colors,
} from "@mui/material";
import Man4Icon from "@mui/icons-material/Man4";
import InsertInvitationIcon from "@mui/icons-material/InsertInvitation";

const EmployeeTimesheetRender = (props: {
  refetch: () => void;
  data: {
    startHour?: string;
    endHour?: string;
    startLunch?: string;
    endLunch?: string;
  };
}) => {
  const { data } = props;

  const handleAddTime = async () => {};

  return (
    <>
      <Stack
        direction={"row"}
        alignItems="center"
        justifyContent="center"
        columnGap={"10%"}
      >
        <Button variant="contained" startIcon={<Man4Icon />}>
          Adicionar Falta
        </Button>
        {/* <Button variant="contained" startIcon={<InsertInvitationIcon />}>
          Escolher Dia
        </Button> */}
      </Stack>

      <Divider sx={{ mt: 3 }} />
      <Box
        p={4}
        my={2}
        display={"flex"}
        flexDirection={"column"}
        alignItems={"center"}
        justifyContent="center"
        rowGap={2}
        borderRadius={2}
        width={"90%"}
        mx={"auto"}
      >
        <CheckboxButton
          hour={data?.startHour ?? undefined}
          defaultCheck={false}
          modalMessage="Tem certeza que deseja iniciar o dia?"
          text="Início de Trabalho"
          type="startHour"
        />
        <CheckboxButton
          hour={data?.startLunch ?? undefined}
          defaultCheck={false}
          modalMessage="Tem certeza que deseja iniciar o dia?"
          text="Início Almoço"
          disabled
          type="startLunch"
        />
        <CheckboxButton
          hour={data?.endLunch ?? undefined}
          defaultCheck={false}
          modalMessage="Tem certeza que deseja iniciar o dia?"
          text="Saída Almoço"
          disabled
          type="endLunch"
        />
        <CheckboxButton
          hour={data?.endHour ?? undefined}
          defaultCheck={false}
          modalMessage="Tem certeza que deseja iniciar o dia?"
          text="Saída Trabalho"
          disabled
          type="endHour"
        />
      </Box>

      <Divider />

      <Stack
        direction={"row"}
        alignItems="center"
        columnGap={2}
        justifyContent="center"
        mt={2}
      >
        <Card elevation={7} sx={{ bgcolor: colors.lightBlue[200], p: 2 }}>
          <Typography fontWeight="bold" variant="subtitle2">
            Horas Trabalhadas Dia:
          </Typography>
        </Card>
        <Card elevation={7} sx={{ bgcolor: colors.lightGreen[200], p: 2 }}>
          <Typography fontWeight="bold" variant="subtitle2">
            Horas Trabalhadas Mês:
          </Typography>
        </Card>
      </Stack>
    </>
  );
};

export default EmployeeTimesheetRender;
