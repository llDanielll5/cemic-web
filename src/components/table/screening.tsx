import * as React from "react";
import * as S from "./styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import {
  Box,
  Button,
  Card,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useRecoilValue } from "recoil";
import UserData from "@/atoms/userData";
import { cpfMask, phoneMask } from "@/services/services";
import SimpleBar from "simplebar-react";

interface TableProps {
  data: any[];
  onEdit: (e: any) => void;
  onDelete: (e: any) => void;
  onSeeTreatments: (e: any) => void;
  messageNothing?: string;
}

export default function ScreeningTable(props: TableProps) {
  const { data, onDelete, onEdit, messageNothing, onSeeTreatments } = props;
  const userData: any = useRecoilValue(UserData);

  return (
    <Card>
      <SimpleBar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>CPF</TableCell>
                <TableCell>Compareceu?</TableCell>
                <TableCell>Plano de Tratamento</TableCell>
                {userData?.userType === "ADMIN" && (
                  <TableCell>Editar</TableCell>
                )}
                {userData?.userType === "ADMIN" && (
                  <TableCell>Deletar</TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.map((val: any) => {
                let id = val?.id;
                let attr = val?.attributes;
                let isMissed = attr?.isMissed;
                let patient = attr?.patient?.data?.attributes;
                let treatPlan = attr?.treatmentPlan;
                let getMissed =
                  isMissed === null ? "Sem registro" : isMissed ? "NÃO" : "SIM";

                return (
                  <TableRow hover key={id}>
                    <TableCell>
                      <Typography variant="subtitle2">
                        {patient?.name}
                      </Typography>
                    </TableCell>
                    <TableCell>{cpfMask(patient?.cpf)}</TableCell>
                    <TableCell>{getMissed}</TableCell>
                    <TableCell>
                      <Button
                        variant="text"
                        onClick={() => onSeeTreatments(treatPlan)}
                      >
                        Ver Tratamentos
                      </Button>
                    </TableCell>
                    {userData?.userType === "ADMIN" && (
                      <TableCell>
                        <IconButton onClick={() => onEdit(id)}>
                          <EditIcon />
                        </IconButton>
                      </TableCell>
                    )}
                    {userData?.userType === "ADMIN" && (
                      <TableCell>
                        <IconButton onClick={() => onDelete(id)}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {data?.length === 0 && (
            <Box
              display="flex"
              width="100%"
              alignItems="center"
              justifyContent="center"
              mt={2}
            >
              <Typography variant="h6">{messageNothing}</Typography>
            </Box>
          )}
        </Box>
      </SimpleBar>
    </Card>
  );
}
