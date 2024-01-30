import React, { useCallback, useEffect, useState } from "react";
import { Box, TextField, Typography, styled } from "@mui/material";
import { useRouter } from "next/router";
import { formatISO } from "date-fns";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/services/firebase";
import { MonthCashTable } from "@/components/new-admin/cash/monthCashTable";

const refCashiers = collection(db, "cashiers");
const refInformations = collection(db, "cashiers_informations");

const MonthCashierReport = (props: any) => {
  const router = useRouter();
  const dateSelected: any = router.asPath;
  const cashierType: any = router?.query?.type;

  const [filter, setFilter] = useState("");
  const [readed, setReaded] = useState(false);
  const [year, month, day] = dateSelected
    .split("/")[3]
    .substring(0, 10)
    .split("-");
  const [cashiers, setCashiers] = useState<any[]>([]);
  const [data, setData] = useState<any[]>([]);
  const [dynamicData, setDynamicData] = useState<any[]>([]);
  const [monthValues, setMonthValues] = useState({
    totalCard: 0,
    totalCredit: 0,
    totalCash: 0,
    totalPix: 0,
    totalOut: 0,
  });

  const getCreditDiscount = (creditVal: number) => {
    let discount = (creditVal * 10) / 100;
    let discounted = creditVal - discount;
    return discounted.toFixed(2);
  };

  const handleGetMonthReport = async () => {
    if (!month) return;
    const selectedMonth = parseInt(month) - 1;
    if (!year || !selectedMonth) return;
    let beginMonth = formatISO(new Date(year, selectedMonth, 1)).substring(
      0,
      10
    );
    let endMonth = formatISO(new Date(year, selectedMonth + 1, 0)).substring(
      0,
      10
    );
    const q = query(
      refCashiers,
      where("date", ">=", beginMonth),
      where("date", "<=", endMonth),
      where("type", "==", cashierType)
    );
    const snapshot = await getDocs(q);

    if (snapshot.docs.length === 0) return alert("Sem caixas este Mês!");

    let arr: any[] = [];
    snapshot.forEach((docs) => {
      arr.push(docs.data().id);
    });

    return setCashiers(arr);
  };

  const handleGetMonthInformations = async () => {
    if (!month) return;
    const selectedMonth = parseInt(month) - 1;
    if (!year || !selectedMonth) return;
    let beginMonth = formatISO(new Date(year, selectedMonth, 1)).substring(
      0,
      10
    );
    let endMonth = formatISO(new Date(year, selectedMonth + 1, 0)).substring(
      0,
      10
    );
    if (cashiers.length === 0) return;

    const q = query(
      refInformations,
      where("type", "==", cashierType),
      where("date", ">=", beginMonth),
      where("date", "<=", endMonth)
    );
    const snapshot = await getDocs(q);

    if (snapshot.docs.length === 0)
      return alert("Sem informações de caixas este mês");

    let arr: any[] = [];
    snapshot.forEach((docs) => {
      arr.push(docs.data());
    });

    setReaded(true);
    setData(arr);
    setDynamicData(arr);
    return;
  };

  const handleGetMonthValue = async () => {
    if (!month) return;
    const selectedMonth = parseInt(month) - 1;
    let beginMonth = formatISO(new Date(year, selectedMonth, 1)).substring(
      0,
      10
    );
    let endMonth = formatISO(new Date(year, selectedMonth + 1, 0)).substring(
      0,
      10
    );
    if (!year || !selectedMonth) return;
    if (cashiers.length > 30) return alert("Caixa com 31 dias");
    if (cashiers.length === 0) return;

    const qMonthValues = query(
      refCashiers,
      where("date", ">=", beginMonth),
      where("date", "<=", endMonth),
      where("type", "==", cashierType)
    );
    const snapshotMonth = await getDocs(qMonthValues);

    if (snapshotMonth.docs.length === 0) return;

    let monthCash: any[] = [];
    let monthCard: any[] = [];
    let monthCredit: any[] = [];
    let monthPix: any[] = [];
    let monthOut: any[] = [];

    snapshotMonth.forEach((docs: any) => {
      monthCash.push(docs.data().totalCash);
      monthCard.push(docs.data().totalCard);
      monthCredit.push(docs.data().totalCredit);
      monthPix.push(docs.data().totalPix);
      monthOut.push(docs.data().totalOut);
    });

    let totalCash = 0;
    let totalCard = 0;
    let totalCredit = 0;
    let totalPix = 0;
    let totalOut = 0;

    totalCash = monthCash.reduce((prev, curr) => {
      return prev + curr;
    }, 0);
    totalCard = monthCard.reduce((prev, curr) => {
      return prev + curr;
    }, 0);
    totalCredit = monthCredit.reduce((prev, curr) => {
      return prev + curr;
    }, 0);
    totalPix = monthPix.reduce((prev, curr) => {
      return prev + curr;
    }, 0);
    totalOut = monthOut.reduce((prev, curr) => {
      return prev + curr;
    }, 0);

    setMonthValues((prev) => ({
      totalCard,
      totalCash,
      totalCredit,
      totalOut,
      totalPix,
    }));

    return;
  };

  const getMonthTotal = () => {
    const { totalCard, totalCash, totalCredit, totalPix, totalOut } =
      monthValues;
    let total = 0;

    let creditDiscounted = parseFloat(getCreditDiscount(totalCredit));

    total = totalCard + totalCash + totalPix + creditDiscounted;
    if (totalOut === 0) return total;
    else {
      total = total - totalOut;
      return total;
    }
  };

  const filterByName = useCallback(() => {
    if (data.length === 0) return;
    if (filter.length === 0) setDynamicData(data);
    if (filter.length > 0) {
      let filtered = data.filter((e, i) => {
        let name = e.name.toLowerCase();
        return name.indexOf(filter) !== -1;
      });
      setDynamicData(filtered);
    }
  }, [data, filter]);

  useEffect(() => {
    if (!month) return;
    const selectedMonth = parseInt(month) - 1;
    if (!year || !selectedMonth) return;
    handleGetMonthReport();
  }, [year, month]);

  useEffect(() => {
    if (cashiers.length > 0 && !readed) {
      handleGetMonthInformations();
      handleGetMonthValue();
    }
  }, [cashiers, readed]);

  useEffect(() => {
    filterByName();
  }, [filterByName]);

  return (
    <Container>
      <Box display="flex" justifyContent="flex-start">
        <Box />
        <Box width="100%" justifyContent="flex-end" display="flex">
          <TextField
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            label="Filtro por nome"
          />
        </Box>
      </Box>
      <Box display="flex" justifyContent="space-between">
        <Typography variant="h4">
          Relatório da data {month}/{year}
        </Typography>
      </Box>
      <Box
        display="grid"
        flexDirection={"column"}
        border={"1.4px solid #f5f5f5"}
        sx={{ backgroundColor: "#f5f5f5" }}
        columnGap={1}
        rowGap={2}
        borderRadius={4}
        px={4}
        py={2}
        mt={2}
      >
        <Typography variant="h6" textAlign={"center"} color="goldenrod">
          Movimentação do Mês
        </Typography>
        <Box
          display={"flex"}
          flexDirection={"row"}
          justifyContent={"space-between"}
          width="100%"
        >
          <Typography variant="subtitle2">
            Dinheiro: <b> R$ {monthValues?.totalCash.toFixed(2)}</b>
          </Typography>
          <Typography variant="subtitle2">
            Débito: <b> R$ {monthValues?.totalCard.toFixed(2)}</b>
          </Typography>
          <Typography variant="subtitle2">
            Crédito:{" "}
            <b>
              {" "}
              R$ {monthValues?.totalCredit.toFixed(2)}{" "}
              {`(R$ ${getCreditDiscount(monthValues?.totalCredit)})`}
            </b>
          </Typography>
        </Box>

        <Box display="flex" justifyContent={"space-between"} width="100%">
          <Typography variant="subtitle2">
            Pix: <b> R$ {monthValues?.totalPix.toFixed(2)}</b>
          </Typography>
          <Typography variant="subtitle2" color="red">
            Saída: <b> R$ {monthValues?.totalOut.toFixed(2)}</b>
          </Typography>
          <Typography
            variant="subtitle2"
            color="black"
            sx={{
              backgroundColor: "white",
              padding: ".5rem 1rem",
              borderRadius: 2,
              border: "1.5px solid #e4e4e4",
            }}
          >
            Total: <b> R$ {getMonthTotal()}</b>
          </Typography>
        </Box>
      </Box>
      <MapContainer>
        <MonthCashTable items={dynamicData} />
      </MapContainer>
    </Container>
  );
};

const Container = styled(Box)`
  display: flex;
  flex-direction: column;
  row-gap: 1rem;
  padding: 2rem;
`;

const MapContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 1rem;
`;

export default MonthCashierReport;
