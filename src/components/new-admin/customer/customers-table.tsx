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
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import { Scrollbar } from "src/components/new-admin/comps/scrollbar";
import { getInitials } from "@/services/get-initials";
import { cpfMask, phoneMask } from "@/services/services";

export const CustomersTable = (props: any) => {
  const {
    count = 0,
    items = [],

    onPageChange = () => {},
    onRowsPerPageChange,

    page = 0,
    rowsPerPage = 0,
    selected = [],
  } = props;

  const getRoleColor = (customer: any) => {
    if (customer.role === "patient")
      return {
        color: "green",
        fontWeight: "bold",
      };
    else if (customer.role === "pre-register")
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
    if (role === "patient") return "Paciente";
    if (role === "pre-register") return "Pré-Registro";
    if (role === "selected") return "Selecionado";
  };

  return (
    <Card>
      <Scrollbar>
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
              {items.map((customer: any) => {
                const isSelected = selected.includes(customer.id);
                // const createdAt = format(customer.createdAt, "dd/MM/yyyy");

                return (
                  <TableRow
                    hover
                    key={customer.id}
                    onClick={() => props.onClick(customer)}
                    sx={{ cursor: "pointer" }}
                  >
                    <TableCell padding="checkbox"></TableCell>
                    <TableCell>
                      <Stack alignItems="center" direction="row" spacing={2}>
                        <Avatar src={customer.avatar}>
                          {getInitials(customer.name)}
                        </Avatar>
                        <Typography variant="subtitle2">
                          {customer.name}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>{cpfMask(customer.cpf)}</TableCell>
                    <TableCell>{phoneMask(customer.phone)}</TableCell>
                    <TableCell sx={getRoleColor(customer)}>
                      {getPatientRole(customer.role)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
      <TablePagination
        component="div"
        count={count}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

CustomersTable.propTypes = {
  count: PropTypes.number,
  items: PropTypes.array,
  onDeselectAll: PropTypes.func,
  onDeselectOne: PropTypes.func,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  onSelectAll: PropTypes.func,
  onSelectOne: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  selected: PropTypes.array,
};
