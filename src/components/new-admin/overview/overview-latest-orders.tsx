//@ts-nocheck
import { format } from "date-fns";
import PropTypes from "prop-types";
import ArrowRightIcon from "@heroicons/react/24/solid/ArrowRightIcon";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardHeader,
  Divider,
  styled,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { Scrollbar } from "src/components/new-admin/comps/scrollbar";
import { SeverityPill } from "src/components/new-admin/comps/severity-pill";
import { parseToBrl } from "@/components/admin/patient/modals/receipt-preview";
import { useRecoilValue } from "recoil";
import UserData from "@/atoms/userData";
import { useRouter } from "next/router";

const cashierType = {
  clinic: "primary",
  implant: "info",
};
const cashierName = {
  clinic: "Clínico",
  implant: "Implante",
};
const patientLocationColor = {
  DF: "primary",
  MG: "secondary",
};
const patientLocationName = {
  DF: "Brasília",
  MG: "Minas Gerais",
};

export const OverviewLatestOrders = (props: any) => {
  const { orders = [], sx } = props;
  const { push } = useRouter();
  const adminData = useRecoilValue(UserData);

  const sumAllValues = (values: any) => {
    let total =
      values["bank_check"] +
      values["cash"] +
      values["credit"] +
      values["debit"] +
      values["pix"] +
      values["transfer"];

    return +total;
  };

  return (
    <CardContainer sx={sx}>
      <CardHeader title="Últimos Pagamentos" />

      <Box sx={{ minWidth: 800 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Caixa</TableCell>
              <TableCell>Paciente</TableCell>
              <TableCell sortDirection="desc">Data</TableCell>
              <TableCell>Valor R$</TableCell>
              {adminData?.userType === "SUPERADMIN" && (
                <TableCell>Filial</TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order: any) => {
              const attr = order.attributes;
              const cashier = attr?.cashier?.data?.attributes?.type;
              const patient = attr?.patient?.data?.attributes?.name;
              const datePayment = format(
                new Date(attr?.date),
                "dd/MM/yyyy HH:mm"
              );
              return (
                <TableRow hover key={order.id}>
                  <TableCell>
                    <SeverityPill color={cashierType[cashier]}>
                      {cashierName[cashier]}
                    </SeverityPill>
                  </TableCell>
                  <TableCell>{patient}</TableCell>
                  <TableCell>{datePayment}</TableCell>
                  <TableCell>
                    {parseToBrl(sumAllValues(attr?.total_values))}
                  </TableCell>
                  {adminData?.userType === "SUPERADMIN" && (
                    <TableCell>
                      <SeverityPill
                        color={
                          patientLocationColor[
                            order?.attributes?.location as "MG" | "DF"
                          ]
                        }
                      >
                        {
                          patientLocationName[
                            order?.attributes?.location as "MG" | "DF"
                          ]
                        }
                      </SeverityPill>
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>

      <Divider />
      <CardActions>
        <Button
          color="inherit"
          onClick={() => push("/admin/payments/last-payments")}
          endIcon={
            <SvgIcon fontSize="small">
              <ArrowRightIcon />
            </SvgIcon>
          }
          size="small"
          variant="text"
        >
          Ver Todos
        </Button>
      </CardActions>
    </CardContainer>
  );
};

const CardContainer = styled(Card)`
  overflow: auto;
`;

OverviewLatestOrders.prototype = {
  orders: PropTypes.array,
  sx: PropTypes.object,
};
