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
import { SeverityPill } from "../new-admin/comps/severity-pill";
import UserData from "@/atoms/userData";
import PropTypes from "prop-types";

interface ExtendedPatientToBudgetProps extends PatientInterface {
  budgetToPatientId: number;
}

interface CustomerTableProps {
  items: StrapiRelationData<ExtendedPatientToBudgetProps>[];
  onEdit: (patient: PatientInterface) => void;
  onClick: (patientCardId: string) => void;
  onBudgetForward: (patient: StrapiData<ExtendedPatientToBudgetProps>) => void;
}

export const PatientToBudgetTable = ({
  items = [],
  onClick,
  onEdit,
  onBudgetForward,
}: CustomerTableProps) => {
  const adminData = useRecoilValue(UserData);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedPatient, setSelectedPatient] =
    useState<StrapiData<ExtendedPatientToBudgetProps> | null>(null);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(
    null
  );

  const handleOpenMenu = (
    event: React.MouseEvent<HTMLElement>,
    patient: StrapiRelationData<ExtendedPatientToBudgetProps>
  ) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedPatient(patient.data);
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
    onBudgetForward(
      selectedPatient as StrapiData<ExtendedPatientToBudgetProps>
    );
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
                {adminData?.userType === "SUPERADMIN" && (
                  <TableCell>CPF</TableCell>
                )}
                {adminData?.userType === "SUPERADMIN" && (
                  <TableCell>Telefone</TableCell>
                )}
                <TableCell>Status</TableCell>
                {adminData?.userType === "SUPERADMIN" && (
                  <TableCell>Cidade</TableCell>
                )}

                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items?.map((patient) => {
                let attr = patient?.data.attributes;
                const location: any = attr?.location;

                return (
                  <TableRow
                    hover
                    key={patient?.data.id}
                    onClick={() => onClick(attr?.cardId)}
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
                    {adminData?.userType === "SUPERADMIN" && (
                      <TableCell>{cpfMask(attr?.cpf)}</TableCell>
                    )}
                    {adminData?.userType === "SUPERADMIN" && (
                      <TableCell>{phoneMask(attr?.phone)}</TableCell>
                    )}
                    <TableCell sx={getRoleColor(attr)}>
                      {getPatientRole(attr?.role)}
                    </TableCell>
                    {adminData?.userType === "SUPERADMIN" && (
                      <TableCell>
                        <SeverityPill
                          color={patientLocationColor[location as "MG" | "DF"]}
                        >
                          {patientLocationName[location as "MG" | "DF"]}
                        </SeverityPill>
                      </TableCell>
                    )}
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
              <MenuItem onClick={handleBudget}>Devolver para Recepção</MenuItem>
            </Stack>
          </Menu>
        </Box>
      ) : (
        <Box p={2} display="flex" justifyContent="center">
          <Typography variant="h6">Não há pacientes para avaliação!</Typography>
        </Box>
      )}
    </Card>
  );
};

PatientToBudgetTable.propTypes = {
  items: PropTypes.array,
  onClick: PropTypes.func,
};
