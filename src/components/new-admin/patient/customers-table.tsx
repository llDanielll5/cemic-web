import { useState } from "react";
import {
  Avatar,
  Box,
  Card,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { useRecoilValue } from "recoil";
import { MoreVert } from "@mui/icons-material";
import { getInitials } from "@/services/get-initials";
import { cpfMask, phoneMask } from "@/services/services";
import { SeverityPill } from "../comps/severity-pill";
import UserData from "@/atoms/userData";
import PropTypes from "prop-types";

interface CustomerTableProps {
  items: any[];
  onEdit: (patient: PatientInterface) => void;
  onClick: (patientCardId: string) => void;
  onBudgetForward: (patient: StrapiData<PatientInterface>) => void;
}

export const CustomersTable = ({
  items = [],
  onClick,
  onEdit,
  onBudgetForward,
}: CustomerTableProps) => {
  const adminData = useRecoilValue(UserData);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedPatient, setSelectedPatient] =
    useState<StrapiData<PatientInterface> | null>(null);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(
    null
  );

  const handleOpenMenu = (
    event: React.MouseEvent<HTMLElement>,
    patient: StrapiData<PatientInterface>
  ) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedPatient(patient);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedPatientId(null);
    setSelectedPatient(null);
  };

  const handleEdit = () => {
    console.log("Editar paciente:", selectedPatientId);
    handleCloseMenu();
  };

  const handleDelete = () => {
    console.log("Excluir paciente:", selectedPatientId);
    handleCloseMenu();
  };

  const handleBudget = () => {
    onBudgetForward(selectedPatient as StrapiData<PatientInterface>);
    handleCloseMenu();
  };

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

  const patientLocationColor = {
    DF: "primary",
    MG: "secondary",
  };
  const patientLocationName = {
    DF: "Brasília",
    MG: "Minas Gerais",
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
                {adminData?.userType === "SUPERADMIN" && (
                  <TableCell>Cidade</TableCell>
                )}
                {adminData?.userType === "SUPERADMIN" && (
                  <TableCell>Ações</TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {items?.map((patient: any) => {
                let attr = patient?.attributes;
                const location: any = attr?.location;

                return (
                  <TableRow
                    hover
                    key={patient?.id}
                    onClick={() => onClick(patient?.attributes?.cardId)}
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
                    <TableCell>
                      <SeverityPill
                        color={patientLocationColor[location as "MG" | "DF"]}
                      >
                        {patientLocationName[location as "MG" | "DF"]}
                      </SeverityPill>
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Ações com Paciente">
                        <IconButton onClick={(e) => handleOpenMenu(e, patient)}>
                          <MoreVert />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleCloseMenu}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
          >
            <Stack minWidth={400} borderRadius={2}>
              <MenuItem onClick={handleBudget}>
                Encaminhar P/ Orçamento
              </MenuItem>
              <Divider sx={{ bgcolor: "black", borderColor: "#ccc" }} />
              <MenuItem onClick={handleEdit}>Editar</MenuItem>
              <Divider sx={{ bgcolor: "black", borderColor: "#ccc" }} />
              <MenuItem onClick={handleDelete}>Excluir</MenuItem>
            </Stack>
          </Menu>
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
