import React, { useEffect, useState } from "react";
import { useOnSnapshotQuery } from "@/hooks/useOnSnapshotQuery";
import PreviewIcon from "@mui/icons-material/Preview";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { collection, getDocs, query, where } from "firebase/firestore";
import { maskValue, parseDateBr } from "@/services/services";
import { db } from "@/services/firebase";
import SearchIcon from "@mui/icons-material/Search";
import { useRouter } from "next/router";
import Link from "next/link";

import {
  Box,
  styled,
  Typography,
  IconButton,
  Button,
  TextField,
} from "@mui/material";

interface ReceiptPageProps {}

const receiptRef = collection(db, "receipts");
const arrowIconStyle = { fontSize: "24px" };

const ReceiptPageAdmin = (props: ReceiptPageProps) => {
  const router = useRouter();
  const [dataReceipts, setDataReceipts] = useState<any[]>([]);
  const [dateSelected, setDateSelected] = useState(new Date());
  const [currentDay, setCurrentDay] = useState<number>(new Date().getDate());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const startDay = new Date(currentYear, currentMonth, currentDay, 0, 0, 0);
  const tomorrow = new Date(currentYear, currentMonth, currentDay + 1, 0, 0);
  const lastDayOfMonth = new Date(currentYear, currentMonth, 0).getDate();
  const date = new Date(currentYear, currentMonth, currentDay);
  const [findInput, setFindInput] = useState<string>("");
  const dateBr = date.toLocaleDateString();

  const q = query(
    receiptRef,
    where("timestamp", ">=", startDay),
    where("timestamp", "<", tomorrow)
  );
  const deps = [currentYear, currentMonth, currentDay];
  const snapReceipts: any = useOnSnapshotQuery("receipts", q, deps);

  useEffect(() => {
    setDataReceipts(snapReceipts);
  }, [snapReceipts]);

  const previousMonth = () => {
    if (currentMonth === 0) {
      setCurrentDay(0);
      setCurrentMonth(11);
      setCurrentYear((prev) => prev - 1);
      return;
    }
    setCurrentMonth((prev) => prev - 1);
    setCurrentDay(lastDayOfMonth + 1);
    return;
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((prev) => prev + 1);
      return;
    }
    setCurrentMonth((prev) => prev + 1);
    setCurrentDay(0);
    return;
  };

  //   const onChangeDate = (e: Date) => {
  //     setDateSelected(e);
  //     setCurrentYear(e.getFullYear());
  //     setCurrentMonth(e.getMonth());
  //     setCurrentDay(e.getDate());
  //     setCalendarVisible(false);
  //     return;
  //   };

  const handleNextDay = () => {
    if (currentDay === lastDayOfMonth - 1) nextMonth();
    setCurrentDay((prev) => prev + 1);
  };

  const handlePreviousDay = () => {
    if (currentDay === 1) previousMonth();
    setCurrentDay((prev) => prev - 1);
  };

  const handleFilterReceipts = async () => {
    const ref = collection(db, "receipts");
    const q = query(ref, where("patientId", "==", findInput));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.docs.length > 0) {
      const arr: any[] = [];
      querySnapshot.forEach((doc) => {
        arr.push(doc.data());
      });
      setDataReceipts(arr);
    } else {
      return alert("Nenhum recibo do paciente encontrado!");
    }
  };

  const handleKeyEnterPressed = ({ key }: any) => {
    if (key === "Enter") return handleFilterReceipts();
  };

  return (
    <Box width={"100%"} display="flex" flexDirection="column">
      <StyledButton endIcon={<RequestQuoteIcon />} sx={{ margin: "16px 0" }}>
        Gerar Recibo
      </StyledButton>

      <BoxWhite>
        <ButtonDays onClick={handlePreviousDay}>
          <ChevronLeftIcon sx={arrowIconStyle} />
        </ButtonDays>
        <Box>
          <Typography variant="semibold">{parseDateBr(dateBr)}</Typography>
        </Box>
        <ButtonDays onClick={handleNextDay}>
          <ChevronRightIcon sx={arrowIconStyle} />
        </ButtonDays>
      </BoxWhite>

      <Box
        my={2}
        display="flex"
        alignItems="center"
        justifyContent="center"
        columnGap={2}
        width="100%"
      >
        <Box width={"50%"}>
          <TextInput
            variant="outlined"
            color="secondary"
            label="Buscar por ID de paciente"
            title="Buscar por ID de paciente"
            onChange={(e) => setFindInput(e.target.value)}
            inputProps={{ maxLength: 11 }}
            value={findInput}
            onKeyDown={handleKeyEnterPressed}
            type="text"
          />
        </Box>
        <StyledButton onClick={handleFilterReceipts} endIcon={<SearchIcon />}>
          Buscar
        </StyledButton>
      </Box>

      <Typography variant="bold" alignSelf="center" textAlign="center">
        Todos Recibos
      </Typography>

      <FlatListBox>
        <ListSingle>
          <Typography variant="semibold">ID do Recibo</Typography>
          <Typography variant="semibold">Valor</Typography>
          <Typography variant="semibold">Ver detalhes</Typography>
        </ListSingle>
        {dataReceipts?.map((v, i) => (
          <ListSingle key={i} sx={{ borderBottom: "1px solid #bbb" }}>
            <Typography variant="body2">{v?.id}</Typography>
            <Typography variant="body2">{maskValue(v?.totalStr)}</Typography>
            <Link passHref href={`admin/receipt/${v?.id}`} target="_blank">
              <StyledButton startIcon={<PreviewIcon />}>Ver</StyledButton>
            </Link>
          </ListSingle>
        ))}
      </FlatListBox>
    </Box>
  );
};

export const StyledButton = styled(Button)`
  background-color: var(--dark-blue);
  color: white;
  transition: 0.4s;
  border-radius: 8px;
  align-self: center;
  padding: 2px 16px;
  margin: 8px 0;
  :hover {
    background-color: var(--dark-blue);
    color: white;
    opacity: 0.5;
  }
`;

const ButtonDays = styled(IconButton)`
  background-color: var(--dark-blue);
  color: white;
  border-radius: 8px;
  padding: 0;
  cursor: pointer;
  transition: 0.4s;
  :hover {
    opacity: 0.8;
    background-color: var(--dark-blue);
  }
`;

const BoxWhite = styled(Box)`
  display: flex;
  align-items: center;
  column-gap: 8px;
  background-color: white;
  margin: 0 auto;
  padding: 4px;
  border-radius: 8px;
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.06);
`;

const TextInput = styled(TextField)`
  width: 100%;
  background-color: white;
`;

const FlatListBox = styled(Box)`
  margin: 8px;
  padding: 8px;
  border-radius: 8px;
  background-color: white;
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.06);
`;

const ListSingle = styled(Box)`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export default ReceiptPageAdmin;
