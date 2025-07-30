import React from "react";
import { parseDateIso } from "@/services/services";
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
import { formatISO } from "date-fns";

interface ReceiptsProps {
  items: StrapiListData<ForwardedTreatmentsInterface>;
  onGetDetails: (idForward: string) => void;
}

export const ForwardPatientTable = (props: ReceiptsProps) => {
  const { items = [], onGetDetails } = props;

  return (
    <Paper elevation={10} sx={{ minWidth: 700, maxWidth: 900, mt: 3 }}>
      <Box>
        <Table sx={{ borderRadius: "1rem" }}>
          <TableHead>
            <TableRow>
              <TableCell>Data Encaminhada</TableCell>
              <TableCell>Horário Encaminhado</TableCell>
              <TableCell>Dentista</TableCell>
              <TableCell>Tratamento</TableCell>
              <TableCell>Detalhes</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map(
              (
                val: StrapiData<ForwardedTreatmentsInterface>,
                index: number
              ) => {
                const forward = val?.attributes;
                let equalsNames: any = {};
                const dentist = val?.attributes
                  ?.dentist as StrapiRelationData<DentistInterface>;
                const dentistUser = dentist?.data?.attributes
                  ?.user as StrapiRelationData<AdminType>;
                const dentistName = dentistUser?.data?.attributes?.name;
                const treatment = (
                  forward.treatment as StrapiRelationData<PatientTreatmentInterface>
                )?.data?.attributes;

                let keys = Object.keys(equalsNames);
                if (index < 6)
                  return (
                    <TableRow key={index}>
                      <StyledTable>
                        <Typography textAlign="center" variant="body2">
                          {new Date(forward.date).toLocaleDateString()}
                        </Typography>
                      </StyledTable>
                      <StyledTable>
                        <Typography textAlign="center" variant="body2">
                          {new Date(forward.date)
                            .toLocaleTimeString()
                            .substring(0, 5)}
                        </Typography>
                      </StyledTable>
                      <StyledTable>
                        <Typography textAlign="center" variant="body2">
                          {dentistName}
                        </Typography>
                      </StyledTable>

                      <StyledTable>
                        <Typography textAlign="center" variant="body2">
                          {treatment?.name}
                        </Typography>
                      </StyledTable>

                      <StyledTable>
                        <Button
                          variant="contained"
                          onClick={() => onGetDetails(String(val.id))}
                        >
                          Ver
                        </Button>
                      </StyledTable>
                    </TableRow>
                  );
              }
            )}
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
