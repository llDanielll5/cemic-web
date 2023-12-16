import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  styled,
  Autocomplete,
  TextField,
} from "@mui/material";
import { StyledButton } from "../receipts";
import Modal from "@/components/modal";
import AddAdminPaymentModal from "./modal";

const months = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];
const years = ["2021", "2022", "2023"];
const buttonStyle = { mx: 0.5, py: 0 };

const currYear = new Date().getFullYear().toString();
const currMonth = new Date().getMonth();

const AdminPayments: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState(currYear);
  const [selectedMonth, setSelectedMonth] = useState(months[currMonth]);
  const [monthIndex, setMonthIndex] = useState(currMonth);
  const [newPaymentModal, setNewPaymentModal] = useState(false);
  const [data, setData] = useState([]);

  let firstDayInMonth = new Date(parseInt(currYear), monthIndex, 1);
  let lastDayInMonht = new Date(parseInt(currYear), monthIndex, 0);

  const getButtonMonth = (v: any) => {
    if (v === selectedMonth)
      return { ...buttonStyle, backgroundColor: "orange", color: "white" };
    else return { ...buttonStyle };
  };
  const changeMonth = (index: number) => {
    setSelectedMonth(months[index]);
    setMonthIndex(index);
  };

  const closePaymentModal = () => {
    setNewPaymentModal(false);
  };

  const paymentsRender = () => {
    if (data.length === 0)
      return <Typography>Não há pagamentos nesse Mês</Typography>;
    else return data.map((v, i) => <Typography key={i}>Teste</Typography>);
  };

  return (
    <Box width="100%">
      <Modal visible={newPaymentModal} closeModal={closePaymentModal}>
        <AddAdminPaymentModal />
      </Modal>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        m={2}
        flexDirection="column"
      >
        <StyledButton sx={{ mb: 2 }} onClick={() => setNewPaymentModal(true)}>
          Gerar Pagamento
        </StyledButton>
        <Typography variant="subtitle1" mb={1}>
          Selecione o Ano:
        </Typography>
        <Autocomplete
          disablePortal
          options={years}
          sx={{ width: "60%", backgroundColor: "white" }}
          value={selectedYear}
          onChange={(e, v) => setSelectedYear(v!)}
          renderInput={(params) => (
            <TextField {...params} label="Selecione o Ano" color="info" />
          )}
        />
      </Box>
      <Center>
        {months.map((v, i) => (
          <StyledButton
            key={i}
            sx={getButtonMonth(v)}
            onClick={() => changeMonth(i)}
          >
            {v}
          </StyledButton>
        ))}
      </Center>

      {paymentsRender()}
    </Box>
  );
};

const Center = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
`;

export default AdminPayments;
