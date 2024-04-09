/* eslint-disable react-hooks/exhaustive-deps */
import Head from "next/head";
import UserData from "@/atoms/userData";
import {
  endOfMonth,
  formatISO,
  startOfMonth,
  subDays,
  subHours,
} from "date-fns";
import { Box, Container, Fab, Unstable_Grid2 as Grid } from "@mui/material";
import { DashboardLayout } from "src/layouts/dashboard/layout";
import { OverviewBudget } from "src/components/new-admin/overview/overview-budget";
import { OverviewLatestOrders } from "src/components/new-admin/overview/overview-latest-orders";
import { OverviewLatestProducts } from "src/components/new-admin/overview/overview-latest-products";
import { OverviewSales } from "src/components/new-admin/overview/overview-sales";
import { OverviewTasksProgress } from "src/components/new-admin/overview/overview-tasks-progress";
import { OverviewTotalCustomers } from "src/components/new-admin/overview/overview-total-customers";
import { OverviewTotalProfit } from "src/components/new-admin/overview/overview-total-profit";
import { OverviewTraffic } from "src/components/new-admin/overview/overview-traffic";
import { useRecoilValue } from "recoil";
import { useCallback, useEffect, useState } from "react";
import { parseToBrl } from "@/components/admin/patient/modals/receipt-preview";
import { handleGetMonthCashiers } from "@/axios/admin/cashiers";
import { getCreditDiscount } from "@/services/services";
import {
  handleGetCountPatientsByDate,
  handleGetPatients,
} from "@/axios/admin/patients";

const now = new Date();

const AdminPage = () => {
  const adminData: any = useRecoilValue(UserData);
  const [budget, setBudget] = useState(null);
  const [totalMonth, setTotalMonth] = useState(0);
  const [totalLastMonth, setTotalLastMonth] = useState(0);
  const [monthDifference, setMonthDifference] = useState(0);
  const [newPatients, setNewPatients] = useState(0);
  const [lastMonthNewPatients, setLastMonthNewPatients] = useState(0);

  const [monthValues, setMonthValues] = useState({
    totalDebit: 0,
    totalCredit: 0,
    totalCash: 0,
    totalPix: 0,
    totalOut: 0,
    totalBankCheck: 0,
    totalTransfer: 0,
  });
  const [lastMonthValues, setLastMonthValues] = useState({
    totalDebit: 0,
    totalCredit: 0,
    totalCash: 0,
    totalPix: 0,
    totalOut: 0,
    totalBankCheck: 0,
    totalTransfer: 0,
  });

  const salesGraph = [
    {
      name: "Esse ano",
      data: [18, 16, 5, 8, 3, 14, 14, 16, 17, 19, 18, 20],
    },
    {
      name: "Último ano",
      data: [12, 11, 4, 6, 2, 9, 9, 10, 11, 12, 13, 13],
    },
  ];

  const handleGetMonthValue = async (date: Date) => {
    const startDate = formatISO(startOfMonth(date)).substring(0, 10);
    const endDate = formatISO(endOfMonth(date)).substring(0, 10);

    const { data: result } = await handleGetMonthCashiers(startDate, endDate);
    const { data: monthCashArr } = result;

    if (monthCashArr.length === 0) return;

    let monthCash: any[] = monthCashArr.map(
      (v: any) => v.attributes.total_values.cash
    );
    let monthDebit: any[] = monthCashArr.map(
      (v: any) => v.attributes.total_values.debit
    );
    let monthCredit: any[] = monthCashArr.map(
      (v: any) => v.attributes.total_values.credit
    );
    let monthPix: any[] = monthCashArr.map(
      (v: any) => v.attributes.total_values.pix
    );
    let monthBankCheck: any[] = monthCashArr.map(
      (v: any) => v.attributes.total_values.bank_check
    );
    let monthTransfer: any[] = monthCashArr.map(
      (v: any) => v.attributes.total_values.transfer
    );
    let monthOut: any[] = monthCashArr.map(
      (v: any) => v.attributes.total_values.out
    );

    let totalCash = 0;
    let totalDebit = 0;
    let totalCredit = 0;
    let totalPix = 0;
    let totalOut = 0;
    let totalBankCheck = 0;
    let totalTransfer = 0;

    totalCash = monthCash.reduce((prev, curr) => {
      return prev + curr;
    }, 0);
    totalDebit = monthDebit.reduce((prev, curr) => {
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
    totalBankCheck = monthBankCheck.reduce((prev, curr) => {
      return prev + curr;
    }, 0);
    totalTransfer = monthTransfer.reduce((prev, curr) => {
      return prev + curr;
    }, 0);

    if (date !== now) {
      setLastMonthValues({
        totalDebit,
        totalCash,
        totalCredit,
        totalOut,
        totalPix,
        totalBankCheck,
        totalTransfer,
      });
    } else
      setMonthValues({
        totalDebit,
        totalCash,
        totalCredit,
        totalOut,
        totalPix,
        totalBankCheck,
        totalTransfer,
      });

    /* OBTEM O VALOR SOMADO DE TODOS OS CAIXAS DIÁRIOS */
    return;
  };

  const handleGetAllPatients = async (date: Date) => {
    const startDate = formatISO(startOfMonth(date)).substring(0, 10);
    const endDate = formatISO(endOfMonth(date)).substring(0, 10);

    return await handleGetCountPatientsByDate(startDate, endDate).then(
      (res) => {
        if (date !== now) {
          setLastMonthNewPatients(res.data.meta.pagination.total);
        } else setNewPatients(res.data.meta.pagination.total);
      },
      (err) => console.log(err.response)
    );
  };

  const getMonthTotal = useCallback(
    (type: "last" | "current") => {
      const getCurrMonthValues =
        type === "current" ? monthValues : lastMonthValues;

      const {
        totalDebit,
        totalCash,
        totalCredit,
        totalPix,
        totalOut,
        totalBankCheck,
        totalTransfer,
      } = getCurrMonthValues;

      let total = 0;
      let creditDiscounted = getCreditDiscount(totalCredit);

      total =
        totalDebit +
        totalCash +
        totalPix +
        creditDiscounted +
        totalBankCheck +
        totalTransfer;

      if (totalOut === 0) {
        if (type === "current") {
          setTotalMonth(total);
        } else setTotalLastMonth(total);
      } else {
        total = total - totalOut;
        if (type === "current") {
          return setTotalMonth(total);
        } else setTotalLastMonth(total);
      }
    },
    [monthValues, lastMonthValues]
  );
  function percDiff(etalon: number, example: number) {
    return +Math.abs((etalon / example) * 100).toFixed(2);
  }

  const getDifferenceMonthValues = () => {
    const difference = totalMonth - totalLastMonth;
    const percentageDifference = Math.floor(
      (difference / totalLastMonth) * 100
    );

    if (difference < 0) {
      let diff = 0;
      let val = parseFloat(percentageDifference.toFixed(0));

      diff = -val;
      setMonthDifference(diff);
    } else setMonthDifference(parseFloat(percentageDifference.toFixed(0)));
  };

  useEffect(() => {
    getMonthTotal("current");
    getMonthTotal("last");
  }, [getMonthTotal]);

  useEffect(() => {
    handleGetMonthValue(now);
    handleGetMonthValue(new Date(now.getFullYear(), now.getMonth() - 1, 1));
    handleGetAllPatients(now);
    handleGetAllPatients(new Date(now.getFullYear(), now.getMonth() - 1, 1));
  }, []);

  useEffect(() => {
    getDifferenceMonthValues();
  }, [totalMonth, totalLastMonth]);

  return (
    <>
      <Head>
        <title>Início · CEMIC</title>
      </Head>

      <Box component="main" sx={{ flexGrow: 1, py: 8 }}>
        <Container maxWidth="xl">
          <Grid container spacing={3}>
            {adminData?.userType === "ADMIN" ||
            adminData?.userType === "SUPERADMIN" ? (
              <>
                <Grid xs={12} sm={6} lg={6}>
                  <OverviewBudget
                    difference={monthDifference ?? 0}
                    positive={monthDifference > totalLastMonth}
                    sx={{ height: "100%" }}
                    value={parseToBrl(totalMonth)}
                  />
                </Grid>
                <Grid xs={12} sm={6} lg={6}>
                  <OverviewTotalCustomers
                    difference={newPatients - lastMonthNewPatients}
                    positive={newPatients > lastMonthNewPatients}
                    sx={{ height: "100%" }}
                    value={newPatients.toString()}
                  />
                </Grid>
              </>
            ) : null}

            {/* <Grid xs={12} sm={6} lg={3}>
              <OverviewTasksProgress sx={{ height: "100%" }} value={75.5} />
            </Grid>
            <Grid xs={12} sm={6} lg={3}>
              <OverviewTotalProfit sx={{ height: "100%" }} value="$15k" />
            </Grid> */}
            <Grid xs={12} lg={8}>
              <OverviewSales chartSeries={salesGraph} sx={{ height: "100%" }} />
            </Grid>
            <Grid xs={12} md={6} lg={4}>
              <OverviewTraffic
                chartSeries={[63, 15, 22]}
                labels={["Desktop", "Tablet", "Phone"]}
                sx={{ height: "100%" }}
              />
            </Grid>
            <Grid xs={12} md={6} lg={4}>
              <OverviewLatestOrders
                orders={[
                  {
                    id: "f69f88012978187a6c12897f",
                    ref: "DEV1049",
                    amount: 30.5,
                    customer: {
                      name: "Ekaterina Tankova",
                    },
                    createdAt: 1555016400000,
                    status: "pending",
                  },
                ]}
                sx={{ height: "100%" }}
              />
            </Grid>
            {/* <Grid xs={12} md={6} lg={4}>
              <OverviewLatestProducts
                products={[
                  {
                    id: "5ece2c077e39da27658aa8a9",
                    image: "/assets/products/product-1.png",
                    name: "Healthcare Erbology",
                    updatedAt: subHours(now, 6).getTime(),
                  },
                ]}
                sx={{ height: "100%" }}
              />
            </Grid> */}
          </Grid>
        </Container>
      </Box>
    </>
  );
};

AdminPage.getLayout = (page: any) => <DashboardLayout>{page}</DashboardLayout>;

export default AdminPage;
