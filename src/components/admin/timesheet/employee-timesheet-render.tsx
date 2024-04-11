import React from "react";
import CheckboxButton from "@/components/checkboxButton";
import { Box, Button, Divider, Stack } from "@mui/material";
import Man4Icon from "@mui/icons-material/Man4";
import InsertInvitationIcon from "@mui/icons-material/InsertInvitation";

// import { Container } from './styles';

const EmployeeTimesheetRender: React.FC = () => {
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
          hour="11:00"
          defaultCheck={false}
          onChangeChecked={(checked) => console.log(checked)}
          modalMessage="Tem certeza que deseja iniciar o dia?"
          text="Início de Trabalho"
        />
        <CheckboxButton
          defaultCheck={false}
          onChangeChecked={(checked) => console.log(checked)}
          modalMessage="Tem certeza que deseja iniciar o dia?"
          text="Início Almoço"
        />
        <CheckboxButton
          defaultCheck={false}
          onChangeChecked={(checked) => console.log(checked)}
          modalMessage="Tem certeza que deseja iniciar o dia?"
          text="Saída Almoço"
        />
        <CheckboxButton
          defaultCheck={false}
          onChangeChecked={(checked) => console.log(checked)}
          modalMessage="Tem certeza que deseja iniciar o dia?"
          text="Saída Trabalho"
        />
      </Box>

      <Divider />
    </>
  );
};

export default EmployeeTimesheetRender;
