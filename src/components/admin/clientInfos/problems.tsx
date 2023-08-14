import React from "react";
import { Box, styled, Typography } from "@mui/material";
import { StyledButton } from "@/components/dynamicAdminBody/receipts";

interface ClientDocumentsProps {
  client: any;
}

const ClientProblems = (props: ClientDocumentsProps) => {
  return (
    <Box display={"flex"} flexDirection={"column"} width="100%">
      <StyledButton>Adicionar problema</StyledButton>

      <ListTitle variant="bold">Relatórios de problemas</ListTitle>
      <ListBox>
        <Typography variant="body1">Lista vazia</Typography>
      </ListBox>
    </Box>
  );
};

const ListTitle = styled(Typography)`
  margin: 0 auto;
`;
const ListBox = styled(Box)`
  padding: 4px;
  border: 1px solid var(--dark-blue);
  border-radius: 8px;
  margin: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

export default ClientProblems;
