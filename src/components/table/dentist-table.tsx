import PropTypes from "prop-types";
import {
  Avatar,
  Box,
  Card,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { getInitials } from "@/services/get-initials";
import { cpfMask, phoneMask } from "@/services/services";
import {
  ArrowForward,
  ArrowRight,
  AttachMoney,
  ChevronRight,
  ListAlt,
} from "@mui/icons-material";
import { useRecoilValue } from "recoil";
import UserData from "@/atoms/userData";

interface DentistTableInterface {
  items: { attributes: DentistInterface; id: number }[];
  onClick: (item: DentistUserInterface) => void;
  onGetPaymentDetails: (id: string) => void;
}

export const DentistTable = (props: DentistTableInterface) => {
  const { items = [] } = props;
  const adminData = useRecoilValue(UserData);

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
                <TableCell align="center"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items?.map((dentist, i: number) => {
                let attr = dentist?.attributes;
                let dentistUser = attr?.user as unknown as {
                  data: { attributes: AdminType; id: number };
                };
                let user = dentistUser?.data?.attributes;
                const location: any = user.location;

                return (
                  <TableRow
                    hover
                    key={i}
                    onClick={() =>
                      props.onGetPaymentDetails(String(dentist?.id))
                    }
                    sx={{ cursor: "pointer" }}
                  >
                    <TableCell padding="checkbox"></TableCell>
                    <TableCell>
                      <Stack alignItems="center" direction="row" spacing={2}>
                        <Avatar
                          src={user?.profileImage}
                          sx={{ backgroundColor: "var(--blue)" }}
                        >
                          {getInitials(user?.name)}
                        </Avatar>
                        <Typography variant="subtitle2">
                          {user?.name}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>{cpfMask(user?.cpf)}</TableCell>
                    <TableCell>{phoneMask(user?.phone as string)}</TableCell>
                    <TableCell align="center">
                      <IconButton>
                        <ArrowForward />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      ) : (
        <Box p={2} display="flex" justifyContent="center">
          <Typography variant="h6">Não há dentistas cadastrados!</Typography>
        </Box>
      )}
    </Card>
  );
};
