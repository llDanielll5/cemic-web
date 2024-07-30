/* eslint-disable react-hooks/exhaustive-deps */
import Head from "next/head";
import UserData from "@/atoms/userData";
import { endOfMonth, formatISO, startOfMonth } from "date-fns";
import {
  Box,
  Container,
  Fab,
  Unstable_Grid2 as Grid,
  Skeleton,
  Typography,
} from "@mui/material";
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
import {
  handleGetLastPayments,
  handleGetMonthCashiers,
} from "@/axios/admin/cashiers";
import { getCreditDiscount } from "@/services/services";
import { handleGetCountPatientsByDate } from "@/axios/admin/patients";
import { getTrafficDevice } from "@/axios/admin/dashboard";
import { TotalChats } from "@/components/admin/dashboard/_components/total-chats";
import { TotalSchedules } from "@/components/admin/dashboard/_components/total-schedules";
import axios from "axios";
import { getCookie } from "cookies-next";

const now = new Date();

interface TotalYearGainInterface {
  brasilia: {
    [t: string]: number;
  };
  uberlandia: {
    [t: string]: number;
  };
}

const AdminPage = () => {
  const adminData = useRecoilValue(UserData);
  const [budget, setBudget] = useState(null);
  const [totalMonth, setTotalMonth] = useState(0);
  const [totalLastMonth, setTotalLastMonth] = useState(0);
  const [monthDifference, setMonthDifference] = useState(0);
  const [newPatients, setNewPatients] = useState(0);
  const [lastMonthNewPatients, setLastMonthNewPatients] = useState(0);
  const [lastPayments, setLastPayments] = useState([]);
  const [totalGainYear, setTotalGainYear] =
    useState<TotalYearGainInterface | null>(null);

  console.log(totalGainYear);

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

  // TRAFFICS GRAPHS
  const [traffics, setTraffics] = useState({
    ios: 0,
    android: 0,
    web: 0,
    total: 0,
    scheduleds: 0,
  });

  const getDevicesTraffic = useCallback(async () => {
    return await getTrafficDevice().then(
      ({ android, ios, web, total, scheduleds }) =>
        setTraffics({
          ios: parseFloat(((ios / total) * 100).toFixed(2)),
          android: parseFloat(((android / total) * 100).toFixed(2)),
          web: parseFloat(((web / total) * 100).toFixed(2)),
          total,
          scheduleds,
        })
    );
  }, []);

  const salesGraph = [
    {
      name: "Filial Brasilia",
      data: [
        totalGainYear?.brasilia?.jan,
        totalGainYear?.brasilia?.fev,
        totalGainYear?.brasilia?.mar,
        totalGainYear?.brasilia?.abr,
        totalGainYear?.brasilia?.mai,
        totalGainYear?.brasilia?.jun,
        totalGainYear?.brasilia?.jul,
        totalGainYear?.brasilia?.ago,
        totalGainYear?.brasilia?.set,
        totalGainYear?.brasilia?.out,
        totalGainYear?.brasilia?.nov,
        totalGainYear?.brasilia?.dez,
      ],
    },
    {
      name: "Filial Uberlandia",
      data: [
        totalGainYear?.uberlandia?.jan,
        totalGainYear?.uberlandia?.fev,
        totalGainYear?.uberlandia?.mar,
        totalGainYear?.uberlandia?.abr,
        totalGainYear?.uberlandia?.mai,
        totalGainYear?.uberlandia?.jun,
        totalGainYear?.uberlandia?.jul,
        totalGainYear?.uberlandia?.ago,
        totalGainYear?.uberlandia?.set,
        totalGainYear?.uberlandia?.out,
        totalGainYear?.uberlandia?.nov,
        totalGainYear?.uberlandia?.dez,
      ],
    },
  ];

  const getLastPayments = async () => {
    return await handleGetLastPayments().then((res) =>
      setLastPayments(res.data.data)
    );
  };

  const getFullYearData = async () => {
    const { data } = await axios.post("/api/cashier/getYearlyCashierGraph", {
      filial: adminData?.filial,
      jwt: getCookie("jwt"),
    });

    setTotalGainYear(data.data.monthResults);
  };

  const handleGetMonthValue = async (date: Date) => {
    const startDate = formatISO(startOfMonth(date)).substring(0, 10);
    const endDate = formatISO(endOfMonth(date)).substring(0, 10);

    const { data } = await axios.post("/api/cashier/getMonthValues", {
      startDate,
      endDate,
      filial: adminData?.filial,
      jwt: getCookie("jwt"),
    });

    const {
      totalDebit,
      totalCash,
      totalCredit,
      totalOut,
      totalPix,
      totalBankCheck,
      totalTransfer,
    } = data.data;

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
    const difference = ((totalMonth - totalLastMonth) / totalMonth) * 100;
    setMonthDifference(parseFloat(difference.toFixed(2)));
  };

  useEffect(() => {
    getMonthTotal("current");
    getMonthTotal("last");
  }, [getMonthTotal]);

  useEffect(() => {
    if (!adminData) return;
    handleGetMonthValue(now);
    handleGetMonthValue(new Date(now.getFullYear(), now.getMonth() - 1, 1));
    handleGetAllPatients(now);
    handleGetAllPatients(new Date(now.getFullYear(), now.getMonth() - 1, 1));
    getFullYearData();
    getLastPayments();
  }, [adminData]);

  useEffect(() => {
    getDevicesTraffic();
  }, [getDevicesTraffic]);

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
            <Grid lg={6} sm={6} xs={12}>
              <TotalChats
                trend="up"
                sx={{ height: "100%" }}
                value={traffics.total.toString()}
              />
            </Grid>

            <Grid lg={6} sm={6} xs={12}>
              <TotalSchedules
                trend="down"
                sx={{ height: "100%" }}
                value={traffics.scheduleds.toString()}
              />
            </Grid>

            {adminData?.userType === "SUPERADMIN" ? (
              <>
                <Grid xs={12} sm={6} lg={6}>
                  <OverviewBudget
                    difference={monthDifference}
                    positive={totalMonth > totalLastMonth}
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
            {totalGainYear === null ? (
              <Skeleton width={"100%"} height={"400px"} />
            ) : (
              <Grid xs={12} lg={12}>
                <OverviewSales
                  chartSeries={salesGraph}
                  sx={{ height: "100%" }}
                />
              </Grid>
            )}
            {/*<Grid xs={12} md={12} lg={12}>
              <OverviewTraffic
                chartSeries={[traffics.web, traffics.android, traffics.ios]}
                labels={["PC", "Android", "iPhone"]}
                sx={{ height: "100%" }}
              />
            </Grid>*/}
            {adminData?.userType === "SUPERADMIN" ? (
              <Grid xs={12} md={12} lg={12}>
                <OverviewLatestOrders
                  orders={lastPayments}
                  sx={{ height: "100%" }}
                />
              </Grid>
            ) : null}
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
