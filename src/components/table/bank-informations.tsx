import { Scrollbar } from "src/components/new-admin/comps/scrollbar";
import { parseToBrl } from "../admin/patient/modals/receipt-preview";
import {
  Box,
  Card,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  styled,
} from "@mui/material";
import { parseDateIso } from "@/services/services";

export const BankInformationsTable = (props: { items: any[] }) => {
  const { items = [] } = props;

  return (
    <Paper elevation={10}>
      <Box minWidth={700}>
        <Table sx={{ borderRadius: "1rem" }}>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Nº Serie</TableCell>
              <TableCell>Nº Cheque</TableCell>
              <TableCell>Valor</TableCell>
              <TableCell>Data Compensação</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((check: any, index: number) => {
              return (
                <TableRow key={index}>
                  <StyledTable>
                    <Typography textAlign="center" variant="body2">
                      {check.name}
                    </Typography>
                  </StyledTable>
                  <StyledTable>
                    <Typography textAlign="center" variant="body2">
                      {check.serie_number}
                    </Typography>
                  </StyledTable>
                  <StyledTable>
                    <Typography textAlign="center" variant="body2">
                      {check.bank_check_number}
                    </Typography>
                  </StyledTable>
                  <StyledTable>
                    <Typography textAlign="center" variant="body2">
                      {parseToBrl(check.price)}
                    </Typography>
                  </StyledTable>
                  <StyledTable>
                    <Typography textAlign="center" variant="body2">
                      {parseDateIso(check?.date_compensation)}
                    </Typography>
                  </StyledTable>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>
    </Paper>
  );
};

const StyledTable = styled(TableCell)`
  border-left: 1px solid #d5d5d5;
  border-right: 1px solid #d5d5d5;
  :first-child {
    border-left: none;
  }
  :last-child {
    border-right: none;
  }
`;
