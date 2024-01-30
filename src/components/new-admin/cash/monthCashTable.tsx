import {
  Box,
  Card,
  Checkbox,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  styled,
} from "@mui/material";
import { Scrollbar } from "src/components/new-admin/comps/scrollbar";

export const MonthCashTable = (props: any) => {
  const { items = [], selected = [] } = props;

  const dateFormatted = (date: string) => {
    let [year, month, day] = date.split("-");
    return `${day}/${month}/${year}`;
  };

  return (
    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: 1000 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Data</TableCell>
                <TableCell>Nome</TableCell>
                <TableCell>Descrição</TableCell>
                <TableCell>Entrada A Vista</TableCell>
                <TableCell>Entrada Débito</TableCell>
                <TableCell>Entrada Crédito</TableCell>
                <TableCell>Entrada Pix</TableCell>
                <TableCell>Saida</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((cashier: any, index: number) => {
                return (
                  <TableRow key={index}>
                    <TableCell>
                      <StyledTable>{dateFormatted(cashier.date)}</StyledTable>
                    </TableCell>
                    <StyledTable>
                      <Stack alignItems="center" direction="row" spacing={2}>
                        <Typography variant="subtitle2">
                          {cashier.name}
                        </Typography>
                      </Stack>
                    </StyledTable>
                    <StyledTable>{cashier.description}</StyledTable>
                    <StyledTable>R$ {cashier.cashIn.toFixed(2)}</StyledTable>
                    <StyledTable>R$ {cashier.cardIn.toFixed(2)}</StyledTable>
                    <StyledTable>R$ {cashier.creditIn.toFixed(2)}</StyledTable>
                    <StyledTable>R$ {cashier.pix.toFixed(2)}</StyledTable>
                    <StyledTable>R$ {cashier.out.toFixed(2)}</StyledTable>
                    {/* <TableCell sx={getRoleColor(cashier)}>
                      {getPatientRole(cashier.role)}
                    </TableCell> */}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
    </Card>
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
