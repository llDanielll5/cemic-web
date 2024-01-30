import React, { useCallback, useEffect, useState } from "react";
import { Box, TextField, Typography, styled } from "@mui/material";
import { useRouter } from "next/router";
import { formatISO } from "date-fns";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/services/firebase";
import { MonthCashTable } from "@/components/new-admin/cash/monthCashTable";
import CashierValues from "@/components/new-admin/cash/values";
import { getCreditDiscount } from "@/services/services";

const refCashiers = collection(db, "cashiers");

const AnnualCashierReport = (props: any) => {
  const router = useRouter();
  const cashierType: any = router?.query?.type;
  const dateSelected: any = router?.query?.date;

  const [filter, setFilter] = useState("");
  const [readed, setReaded] = useState(false);
  const year = dateSelected?.split?.("-")?.[0];
  const [cashiers, setCashiers] = useState<any | null>(null);
  const [yearValues, setYearValues] = useState({
    totalCard: 0,
    totalCredit: 0,
    totalCash: 0,
    totalPix: 0,
    totalOut: 0,
  });

  const handleGetYearValue = useCallback(async () => {
    if (!year) return;

    let beginYear = formatISO(new Date(year, 0, 1)).substring(0, 10);
    let endYear = formatISO(new Date(year, 11 + 1, 0)).substring(0, 10);
    const q = query(
      refCashiers,
      where("date", ">=", beginYear),
      where("date", "<=", endYear),
      where("type", "==", cashierType)
    );

    const snapshotYear = await getDocs(q);
    if (snapshotYear.docs.length === 0) return;

    let yearCash: any[] = [];
    let yearCard: any[] = [];
    let yearCredit: any[] = [];
    let yearPix: any[] = [];
    let yearOut: any[] = [];

    snapshotYear.forEach((docs: any) => {
      yearCash.push(docs.data().totalCash);
      yearCard.push(docs.data().totalCard);
      yearCredit.push(docs.data().totalCredit);
      yearPix.push(docs.data().totalPix);
      yearOut.push(docs.data().totalOut);
    });

    let totalCash = 0;
    let totalCard = 0;
    let totalCredit = 0;
    let totalPix = 0;
    let totalOut = 0;

    totalCash = yearCash.reduce((prev, curr) => {
      return prev + curr;
    }, 0);
    totalCard = yearCard.reduce((prev, curr) => {
      return prev + curr;
    }, 0);
    totalCredit = yearCredit.reduce((prev, curr) => {
      return prev + curr;
    }, 0);
    totalPix = yearPix.reduce((prev, curr) => {
      return prev + curr;
    }, 0);
    totalOut = yearOut.reduce((prev, curr) => {
      return prev + curr;
    }, 0);

    setYearValues((prev) => ({
      totalCard,
      totalCash,
      totalCredit,
      totalOut,
      totalPix,
    }));

    setReaded(true);
    return;
  }, [year]);

  const getYearTotal = () => {
    const { totalCard, totalCash, totalCredit, totalPix, totalOut } =
      yearValues;
    let total = 0;

    let creditDiscounted = parseFloat(getCreditDiscount(totalCredit));

    total = totalCard + totalCash + totalPix + creditDiscounted;
    if (totalOut === 0) return total;
    else {
      total = total - totalOut;
      return total;
    }
  };

  useEffect(() => {
    if (!readed) handleGetYearValue();
  }, [handleGetYearValue, readed]);

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
        <Typography variant="h4">Relatório do ano de {year}</Typography>
      </Box>

      <CashierValues
        cash={yearValues?.totalCash}
        debit={yearValues?.totalCard}
        credit={yearValues?.totalCredit}
        pix={yearValues?.totalPix}
        out={yearValues?.totalOut}
        total={getYearTotal()}
      />
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

export default AnnualCashierReport;
