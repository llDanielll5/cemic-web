import { parseToBrl } from "../admin/patient/modals/receipt-preview";
import { parseDateIso } from "@/services/services";
import { useRecoilValue } from "recoil";
import {
  Box,
  Button,
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
import AddIcon from "@mui/icons-material/Add";
import { AdminInfosInterface } from "types/admin";
import { PaymentShapesInterface } from "types/payments";
import { ToothsInterface } from "types/odontogram";

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
}

export const ReceiptsPatientTable = (props: ReceiptsProps) => {
  const { items = [], onGetValues, onEditValues } = props;
  const adminData: any = useRecoilValue(UserData);

  return (
    <Paper elevation={10} sx={{ minWidth: 700, maxWidth: 900, mt: 3 }}>
      <Box>
        <Table sx={{ borderRadius: "1rem" }}>
          <TableHead>
            <TableRow>
              <TableCell>Data Pagamento</TableCell>
              <TableCell>Valor Pago</TableCell>
              <TableCell>Ver Detalhes</TableCell>
              {adminData?.userType === "ADMIN" && (
                <TableCell>Editar Pagamento</TableCell>
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
                  <StyledTable>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={() => onGetValues(val)}
                    >
                      Detalhes
                    </Button>
                  </StyledTable>
                  <StyledTable>
                    <Button variant="contained" startIcon={<CreateIcon />}>
                      Editar
                    </Button>
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
