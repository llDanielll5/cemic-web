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
import {
  deletePatientFundCredit,
  deletePatientPayment,
  deletePatientUsedFundCredit,
  updatePatientFundCredit,
  updatePatientUsedFundCredit,
} from "@/axios/admin/payments";
import { toast } from "react-toastify";
import { handleUpdatePatient } from "@/axios/admin/patients";
import PatientData from "@/atoms/patient";

export type ReceiptSingle = StrapiRelation<PaymentsInterface>;

interface ReceiptsProps {
  items: any[];
  onGetValues: (values: StrapiData<PaymentsInterface>) => void;
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
      let totalValuesToRemove: PaymentValues = cashier_infos?.total_values;
      let cashierTotalValues: PaymentValues = (
        cashier_infos?.cashier as unknown as Record<"data", CashierInterface>
      )?.data?.attributes?.total_values;

      let finalValues: PaymentValues = {} as PaymentValues;

      (Object.keys(cashierTotalValues) as PaymentMethod[]).forEach((method) => {
        finalValues[method] =
          cashierTotalValues[method] - totalValuesToRemove[method];
      });

      const credits =
        patientData?.attributes?.credits! - val?.attributes?.total_value;

      type FundCreditsDataType = StrapiListRelationData<FundCreditsInterface>;
      const fundUseds = val?.attributes?.fund_useds as FundCreditsDataType;

      if (
        !val?.attributes?.hasFundCredit &&
        (fundUseds as FundCreditsDataType)?.data.length > 0
      ) {
        for (let i = 0; i < fundUseds.data.length; i++) {
          const element = fundUseds.data[i];
          const fundCreditPaymentUsed = element.attributes
            .fund_credit_payment_useds as StrapiListRelationData<FundCreditPaymentUsedInterface>;
          for (let j = 0; j < fundCreditPaymentUsed.data.length; j++) {
            const fUsed = fundCreditPaymentUsed.data[j];
            const fUsedValue = fUsed.attributes.used_value;
            const calculate = element.attributes.used_value - fUsedValue;
            Promise.all([
              await updatePatientFundCredit(String(element.id), {
                used_value: calculate,
                status: calculate === 0 ? "CREATED" : "PARTIAL_USED",
                hasUsed: !(calculate < element.attributes.max_used_value),
              }),
              await deletePatientUsedFundCredit(String(fUsed.id)),
            ]);
          }
        }
      }
      if (!!val?.attributes?.hasFundCredit) {
        const fundCredit = val?.attributes
          ?.fund_credit as unknown as StrapiRelationData<FundCreditsInterface>;
        Promise.all([
          await handleUpdatePatient(patientData?.id!, { data: { credits } }),
          await deletePatientFundCredit(String(fundCredit?.data.id)),
        ]);
      }
      Promise.all([
        await deleteCashierInfo(cashierInfoId),
        await deletePatientPayment(paymentId),
        await updateCashierValues(cashierId, { total_values: finalValues }),
      ]);
      toast.success("Recibo do paciente excluído com sucesso!");
      onDeleteValues?.();
    } catch (error: any) {
      console.log(error);
      toast.error(
        error?.response?.message ??
          error?.response ??
          "Erro ao deletar o pagamento!"
      );
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
            {items.map((val: StrapiData<PaymentsInterface>, index: number) => {
              const receipt = val?.attributes;
              const haveWalletCredit =
                receipt.payment_shapes.filter(
                  (k) => k.shape === "WALLET_CREDIT"
                ).length > 0;

              const notWalletValues = receipt.payment_shapes.filter(
                (k) => k.shape !== "WALLET_CREDIT"
              );

              const paymentShapesValues = notWalletValues.map(
                (k) => k.price + (k.creditAdditionalValue || (0 as number))
              );
              const reducedPaymentShapes = paymentShapesValues.reduce(
                (prev, curr) => prev + curr,
                0
              );

              const totalValue = haveWalletCredit
                ? reducedPaymentShapes
                : receipt.total_value;

              return (
                <TableRow key={index}>
                  <StyledTable>
                    <Typography textAlign="center" variant="body2">
                      {parseDateIso(
                        (receipt.date as unknown as string).substring(0, 10)
                      )}
                    </Typography>
                  </StyledTable>
                  <StyledTable>
                    <Typography textAlign="center" variant="body2">
                      {parseToBrl(totalValue)}
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
