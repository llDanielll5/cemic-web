import PropTypes from "prop-types";
import {
  Avatar,
  Box,
  Card,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Scrollbar } from "src/components/new-admin/comps/scrollbar";
import { getInitials } from "@/services/get-initials";
import { cpfMask, phoneMask } from "@/services/services";

export const CustomersTable = (props: any) => {
  const { items = [] } = props;

  const getRoleColor = (customer: any) => {
    if (customer.role === "PATIENT")
      return {
        color: "green",
        fontWeight: "bold",
      };
    else if (customer.role === "PRE-REGISTER")
      return {
        color: "var(--red)",
        fontWeight: "bold",
      };
    else
      return {
        color: "gold",
        fontWeight: "bold",
      };
  };
  const getPatientRole = (role: string) => {
    if (role === "PATIENT") return "Paciente";
    if (role === "PRE-REGISTER") return "Pré-Registro";
    if (role === "SELECTED") return "Selecionado";
  };

  return (
    <Card>
      {items.length > 0 ? (
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox"></TableCell>
                <TableCell>Nome</TableCell>
                <TableCell>CPF</TableCell>
                <TableCell>Telefone</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items?.map((patient: any) => {
                let attr = patient?.attributes;

                return (
                  <TableRow
                    hover
                    key={patient?.id}
                    onClick={() => props.onClick(patient?.attributes?.cardId)}
                    sx={{ cursor: "pointer" }}
                  >
                    <TableCell padding="checkbox"></TableCell>
                    <TableCell>
                      <Stack alignItems="center" direction="row" spacing={2}>
                        <Avatar src={attr?.profileImage}>
                          {getInitials(attr?.name)}
                        </Avatar>
                        <Typography variant="subtitle2">
                          {attr?.name}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>{cpfMask(attr?.cpf)}</TableCell>
                    <TableCell>{phoneMask(attr?.phone)}</TableCell>
                    <TableCell sx={getRoleColor(attr)}>
                      {getPatientRole(attr?.role)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      ) : (
        <Box p={2} display="flex" justifyContent="center">
          <Typography variant="h6">Não há pacientes cadastrados!</Typography>
        </Box>
      )}
    </Card>
  );
};

CustomersTable.propTypes = {
  items: PropTypes.array,
  onClick: PropTypes.func,
};
