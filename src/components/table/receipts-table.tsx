import { parseToBrl } from "../admin/patient/modals/receipt-preview";
import { parseDateIso } from "@/services/services";
import { useRecoilValue } from "recoil";
import {
  Box,
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  styled,
} from "@mui/material";
import UserData from "@/atoms/userData";
import CreateIcon from "@mui/icons-material/Create";
import { AdminInfosInterface } from "types/admin";
import { PaymentShapesInterface } from "types/payments";
import { ToothsInterface } from "types/odontogram";
import { Delete, Visibility } from "@mui/icons-material";
import {
  deleteCashierInfo,
  getCashierInfo,
  updateCashierValues,
} from "@/axios/admin/cashiers";
import {
  CashierInfosInterface,
  CashierInterface,
  TotalValues,
} from "types/cashier";
import { deletePatientPayment } from "@/axios/admin/payments";
import { toast } from "react-toastify";
import { handleUpdatePatient } from "@/axios/admin/patients";
import PatientData from "@/atoms/patient";

export interface ReceiptSingle {
  id: string;
  attributes: {
    adminInfos: AdminInfosInterface;
    date: string;
    discount?: number;
    payment_shapes: PaymentShapesInterface[];
    total_value?: number;
    treatments?: { data: ToothsInterface[] };
    updatedAt?: string;
    description?: string;
  };
}

interface ReceiptsProps {
  items: any[];
  onGetValues: (values: ReceiptSingle) => void;
  onEditValues?: () => void;
  onDeleteValues?: () => void;
}

export const ReceiptsPatientTable = (props: ReceiptsProps) => {
  const { items = [], onGetValues, onEditValues, onDeleteValues } = props;
  const adminData = useRecoilValue(UserData);
  const patientData = useRecoilValue(PatientData);

  const hasAdmin =
    adminData?.userType === "ADMIN" || adminData?.userType === "SUPERADMIN";

  const handleGetToDeletePayment = async (val: {
    id: number;
    attributes: PaymentsInterface;
  }) => {
    try {
      const paymentId = String(val?.id!);
      const cashierInfoId = String(val?.attributes?.cashier_info?.data?.id);

      const { data: axiosData } = await getCashierInfo(cashierInfoId);
      const {
        data: cashierInfoData,
      }: { data: { attributes: CashierInfosInterface; id: number } } =
        axiosData;
      type PaymentMethod =
        | "bank_check"
        | "cash"
        | "credit"
        | "debit"
        | "out"
        | "pix"
        | "transfer";
      type PaymentValues = Record<PaymentMethod, number>;

      const cashier_infos = cashierInfoData?.attributes;
      const cashierId = (
        cashier_infos.cashier as unknown as Record<"data", CashierInterface>
      )?.data?.id;
      const totalValuesToRemove: PaymentValues = cashier_infos?.total_values;
      const cashierTotalValues: PaymentValues = (
        cashier_infos?.cashier as unknown as Record<"data", CashierInterface>
      )?.data?.attributes?.total_values;

      const finalValues: PaymentValues = {} as PaymentValues;

      (Object.keys(cashierTotalValues) as PaymentMethod[]).forEach((method) => {
        finalValues[method] =
          cashierTotalValues[method] - totalValuesToRemove[method];
      });

      if (!!val?.attributes?.hasFundCredit) {
        await handleUpdatePatient(patientData?.id!, {
          data: {
            credits:
              patientData?.attributes?.credits! - val?.attributes?.total_value,
          },
        });
      }
      Promise.all([
        await deleteCashierInfo(cashierInfoId),
        await deletePatientPayment(paymentId),
        await updateCashierValues(cashierId, { total_values: finalValues }),
      ]);
      toast.success("Dados de recibo removidos com sucesso!");
      onDeleteValues?.();
    } catch (error) {
      console.log(error);
      toast.error("Erro ao deletar o pagamento!");
    }
  };

  return (
    <Paper elevation={10} sx={{ minWidth: 700, maxWidth: 900, mt: 3 }}>
      <Box>
        <Table sx={{ borderRadius: "1rem" }}>
          <TableHead>
            <TableRow>
              <TableCell>Data Pagamento</TableCell>
              <TableCell>Valor Pago</TableCell>
              <TableCell>Ver</TableCell>
              {hasAdmin && (
                <>
                  <TableCell>Editar </TableCell>
                  <TableCell>Excluir </TableCell>
                </>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((val: any, index: number) => {
              const receipt = val?.attributes;
              return (
                <TableRow key={index}>
                  <StyledTable>
                    <Typography textAlign="center" variant="body2">
                      {parseDateIso(receipt.date.substring(0, 10))}
                    </Typography>
                  </StyledTable>
                  <StyledTable>
                    <Typography textAlign="center" variant="body2">
                      {parseToBrl(receipt.total_value)}
                    </Typography>
                  </StyledTable>
                  <StyledTable align="center">
                    <IconButton onClick={() => onGetValues(val)}>
                      <Visibility color="primary" />
                    </IconButton>
                  </StyledTable>
                  {hasAdmin && (
                    <>
                      <StyledTable align="center">
                        <IconButton>
                          <CreateIcon color="primary" />
                        </IconButton>
                      </StyledTable>
                      <StyledTable align="center">
                        <IconButton
                          onClick={() => handleGetToDeletePayment(val)}
                        >
                          <Delete color="primary" />
                        </IconButton>
                      </StyledTable>
                    </>
                  )}
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
