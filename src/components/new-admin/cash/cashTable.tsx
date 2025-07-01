import { Scrollbar } from "src/components/new-admin/comps/scrollbar";
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
import { parseToBrl } from "@/components/admin/patient/modals/receipt-preview";

export const CashTable = (props: {
  onSelect: (idCashierInfo: string) => void;
  items: any[];
}) => {
  const { items = [] } = props;

  const parseType = (type: "IN" | "OUT") => {
    if (type === "IN") return "Entrada";
    else return "Saída";
  };

  return (
    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: 1000 }}>
          <Table>
            <TableHead>
              <TableRow>
                {/* <TableCell padding="checkbox">Paciente</TableCell> */}
                <TableCell>Fluxo</TableCell>
                <TableCell>Paciente/Parceiro</TableCell>
                <TableCell>Descrição</TableCell>
                <TableCell>Entrada A Vista</TableCell>
                <TableCell>Entrada Débito</TableCell>
                <TableCell>Entrada Crédito</TableCell>
                <TableCell>Entrada Pix</TableCell>
                <TableCell>Entrada Cheque</TableCell>
                <TableCell>Entrada DOC/TED</TableCell>
                <TableCell>Saida</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item: any, index: number) => {
                const cashier = item?.attributes;
                return (
                  <TableRow key={index} onClick={() => props.onSelect?.(item)}>
                    {/* <TableCell padding="checkbox">
                      <Checkbox
                        checked={cashier.verifyBy?.data !== null}
                        disabled={cashier.verifyBy?.data !== null}
                        // unselectable={!!cashier.verifyBy?.data?.id && "on"}
                        onChange={(event) => {
                          if (event.target.checked) {
                            props.onSelect?.(item.id);
                          }
                        }}
                      />
                    </TableCell> */}
                    <StyledTable>
                      <Stack alignItems="center" direction="row" spacing={2}>
                        <Typography
                          variant="subtitle2"
                          color={cashier.type === "IN" ? "green" : "red"}
                        >
                          {parseType(cashier.type)}
                        </Typography>
                      </Stack>
                    </StyledTable>
                    <StyledTable align="center">
                      {cashier.patient.data === null
                        ? "Nenhum"
                        : cashier.patient.data.attributes.name}
                    </StyledTable>
                    <StyledTable>{cashier.description}</StyledTable>
                    <StyledTable>
                      {parseToBrl(cashier.total_values.cash)}
                    </StyledTable>
                    <StyledTable>
                      {parseToBrl(cashier.total_values.debit)}
                    </StyledTable>
                    <StyledTable>
                      {parseToBrl(cashier.total_values.credit)}
                    </StyledTable>
                    <StyledTable>
                      {" "}
                      {parseToBrl(cashier.total_values.pix)}
                    </StyledTable>
                    <StyledTable>
                      {parseToBrl(cashier.total_values.bank_check)}
                    </StyledTable>
                    <StyledTable>
                      {parseToBrl(cashier.total_values.transfer)}
                    </StyledTable>
                    <StyledTable>
                      {" "}
                      {parseToBrl(cashier.total_values.out)}
                    </StyledTable>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
        {items.length === 0 && (
          <Box display="flex" justifyContent={"center"} my={2}>
            <Typography variant="h6" pt={2}>
              Não há informações de pagamento nesse Caixa!
            </Typography>
          </Box>
        )}
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
