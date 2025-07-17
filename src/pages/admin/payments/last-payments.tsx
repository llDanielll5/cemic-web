// pages/admin/payments.tsx

import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { DashboardLayout } from "@/layouts/dashboard/layout";
import { useRecoilValue } from "recoil";
import { SeverityPill } from "@/components/new-admin/comps/severity-pill";
import UserData from "@/atoms/userData";
import {
  Button,
  Container,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  CircularProgress,
  TextField,
  MenuItem,
  Card,
  Typography,
} from "@mui/material";
import { parseToBrl } from "@/components/admin/patient/modals/receipt-preview";
import {
  patientLocationColor,
  patientLocationName,
} from "@/components/new-admin/overview/overview-latest-orders";
import { Refresh } from "@mui/icons-material";
import { handleGetLastPayments } from "@/axios/admin/cashiers";

const cashierType: Record<string, string> = {
  clinic: "primary",
  implant: "info",
};
const cashierName: Record<string, string> = {
  clinic: "Clínico",
  implant: "Implante",
};

const LastPaymentsPage = () => {
  const adminData = useRecoilValue(UserData);

  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<"asc" | "desc">("desc");
  const [date, setDate] = useState(""); // formato: yyyy-mm-dd

  const pageSize = 10;

  const loadPayments = async (newPage = 1, append = false) => {
    setLoading(true);
    try {
      const { data } = await handleGetLastPayments(undefined, {
        page: newPage,
        pageSize,
        sort,
        date,
      });

      const newPayments = data?.data || [];
      setPayments((prev) => (append ? [...prev, ...newPayments] : newPayments));
      setPage(newPage);
    } catch (error) {
      console.error("Erro ao buscar pagamentos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayments();
  }, [sort, date]);

  const sumAllValues = (values: any) => {
    return (
      values["bank_check"] +
      values["cash"] +
      values["credit"] +
      values["debit"] +
      values["pix"] +
      values["transfer"]
    );
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4">Últimos Pagamentos</Typography>
      <Card elevation={10} sx={{ px: 2, py: 1, m: 4 }}>
        <Stack direction="row" spacing={2}>
          <TextField
            type="date"
            label="Filtrar por Data"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            size="small"
            InputLabelProps={{
              shrink: true, // força o label a ficar acima
            }}
          />

          <TextField
            select
            label="Ordenar por Data"
            value={sort}
            onChange={(e) => setSort(e.target.value as "asc" | "desc")}
            size="small"
          >
            <MenuItem value="desc">Mais Recentes</MenuItem>
            <MenuItem value="asc">Mais Antigos</MenuItem>
          </TextField>
        </Stack>
      </Card>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Caixa</TableCell>
            <TableCell>Paciente</TableCell>
            <TableCell>Data</TableCell>
            <TableCell>Valor R$</TableCell>
            {adminData?.userType === "SUPERADMIN" && (
              <TableCell>Filial</TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {payments.map((payment: any) => {
            const attr = payment.attributes;
            const cashier = attr?.cashier?.data?.attributes?.type;
            const patient = attr?.patient?.data?.attributes?.name;
            const datePayment = format(
              new Date(attr?.date),
              "dd/MM/yyyy HH:mm"
            );
            const location = attr?.patient?.data?.attributes?.location;

            return (
              <TableRow
                hover
                key={payment.id}
                onClick={() => console.log(payment)}
              >
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
                      color={patientLocationColor[location as LOCATION_FILIAL]}
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

      <Stack mt={2} direction="row" justifyContent="center">
        {loading ? (
          <CircularProgress />
        ) : (
          <Button
            variant="contained"
            endIcon={<Refresh />}
            onClick={() => loadPayments(page + 1, true)}
          >
            Carregar Mais
          </Button>
        )}
      </Stack>
    </Container>
  );
};

LastPaymentsPage.getLayout = (page: React.ReactElement) => (
  <DashboardLayout>{page}</DashboardLayout>
);

export default LastPaymentsPage;
