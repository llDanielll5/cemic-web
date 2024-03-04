import React from "react";
import { parseToBrl } from "../admin/patient/modals/receipt-preview";
import { parseDateIso } from "@/services/services";
import { useRecoilValue } from "recoil";
import UserData from "@/atoms/userData";
import CreateIcon from "@mui/icons-material/Create";
import AddIcon from "@mui/icons-material/Add";
import { AdminInfosInterface } from "types/admin";
import { PaymentShapesInterface } from "types/payments";
import { ToothsInterface } from "types/odontogram";
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
import { handleGetTreatments } from "@/axios/admin/treatments";
import { formatISO } from "date-fns";

interface ReceiptsProps {
  items: any[];
  onGetDetails: (idForward: string) => void;
}

export const FinishedsTreatmentsPatientTable = (props: ReceiptsProps) => {
  const { items = [], onGetDetails } = props;

  return (
    <Paper elevation={10} sx={{ minWidth: 700, maxWidth: 900, mt: 3 }}>
      <Box>
        <Table sx={{ borderRadius: "1rem" }}>
          <TableHead>
            <TableRow>
              <TableCell>Data</TableCell>
              <TableCell>Horário</TableCell>
              <TableCell>Dentista</TableCell>
              <TableCell>Detalhes</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((val: any, index: number) => {
              const schedule = val?.attributes;
              let equalsNames: any = {};
              const treatments = schedule.treatments.data;

              const date = new Date(schedule.date);

              if (index < 6)
                return (
                  <TableRow key={index}>
                    <StyledTable>
                      <Typography textAlign="center" variant="body2">
                        {parseDateIso(formatISO(date).substring(0, 10))}
                      </Typography>
                    </StyledTable>
                    <StyledTable>
                      <Typography textAlign="center" variant="body2">
                        {formatISO(date).substring(11, 16)}
                      </Typography>
                    </StyledTable>
                    <StyledTable>
                      <Typography textAlign="center" variant="body2">
                        {schedule.dentist.data.attributes.name}
                      </Typography>
                    </StyledTable>

                    <StyledTable>
                      <Button
                        variant="contained"
                        fullWidth
                        onClick={() => onGetDetails(val.id)}
                      >
                        Ver
                      </Button>
                    </StyledTable>
                  </TableRow>
                );
            })}
          </TableBody>
        </Table>
      </Box>

      {items.length > 5 && (
        <Box
          display="flex"
          alignItems="flex-end"
          flexDirection="row-reverse"
          p={2}
        >
          <Button variant="contained">Ver Mais...</Button>
        </Box>
      )}
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
