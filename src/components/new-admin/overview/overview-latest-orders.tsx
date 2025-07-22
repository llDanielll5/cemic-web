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
import { useRouter } from "next/router";
import UserData from "@/atoms/userData";

const cashierType = {
  clinic: "primary",
  implant: "info",
};
const cashierName = {
  clinic: "Clínico",
  implant: "Implante",
};
export const patientLocationColor: Record<LOCATION_FILIAL, string> = {
  DF: "primary",
  MG: "secondary",
};
export const patientLocationName: Record<LOCATION_FILIAL, string> = {
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
              const patient =
                attr?.patient as StrapiRelationData<PatientInterface>;
              const payment = attr?.attributes
                ?.payment as StrapiRelationData<PaymentsInterface>;
              const paymentAttr = payment?.data?.attributes;
              const patientAttr = patient?.data?.attributes;
              const datePayment = format(
                new Date(attr?.date),
                "dd/MM/yyyy HH:mm"
              );
              const location =
                order?.attributes?.patient?.data?.attributes?.location;
              console.log({ payment });

              return (
                <TableRow
                  hover
                  key={order.id}
                  onClick={() =>
                    push(
                      `/admin/patients/${patientAttr?.cardId}/docs/receipt?payment_id=${payment?.data?.id}`
                    )
                  }
                >
                  <TableCell>
                    <SeverityPill color={cashierType[cashier]}>
                      {cashierName[cashier]}
                    </SeverityPill>
                  </TableCell>
                  <TableCell>{patientAttr?.name}</TableCell>
                  <TableCell>{datePayment}</TableCell>
                  <TableCell>
                    {parseToBrl(sumAllValues(attr?.total_values))}
                  </TableCell>
                  {adminData?.userType === "SUPERADMIN" && (
                    <TableCell>
                      <SeverityPill
                        color={
                          patientLocationColor[location as LOCATION_FILIAL]
                        }
                      >
                        {patientLocationName[location as LOCATION_FILIAL]}
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
