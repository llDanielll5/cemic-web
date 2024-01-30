import Head from "next/head";
import { subDays, subHours } from "date-fns";
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
import UserData from "@/atoms/userData";

const now = new Date();

const AdminPage = () => {
  const userData: any = useRecoilValue(UserData);

  if (!userData) return;
  return (
    <>
      <Head>
        <title>Início · CEMIC</title>
      </Head>

      <Box component="main" sx={{ flexGrow: 1, py: 8 }}>
        <Container maxWidth="xl">
          <Grid container spacing={3}>
            <Grid xs={12} sm={6} lg={3}>
              <OverviewBudget
                difference={12}
                positive
                sx={{ height: "100%" }}
                value="$24k"
              />
            </Grid>
            <Grid xs={12} sm={6} lg={3}>
              <OverviewTotalCustomers
                difference={16}
                positive={false}
                sx={{ height: "100%" }}
                value="1.6k"
              />
            </Grid>
            <Grid xs={12} sm={6} lg={3}>
              <OverviewTasksProgress sx={{ height: "100%" }} value={75.5} />
            </Grid>
            <Grid xs={12} sm={6} lg={3}>
              <OverviewTotalProfit sx={{ height: "100%" }} value="$15k" />
            </Grid>
            <Grid xs={12} lg={8}>
              <OverviewSales
                chartSeries={[
                  {
                    name: "This year",
                    data: [18, 16, 5, 8, 3, 14, 14, 16, 17, 19, 18, 20],
                  },
                  {
                    name: "Last year",
                    data: [12, 11, 4, 6, 2, 9, 9, 10, 11, 12, 13, 13],
                  },
                ]}
                sx={{ height: "100%" }}
              />
            </Grid>
            <Grid xs={12} md={6} lg={4}>
              <OverviewTraffic
                chartSeries={[63, 15, 22]}
                labels={["Desktop", "Tablet", "Phone"]}
                sx={{ height: "100%" }}
              />
            </Grid>
            <Grid xs={12} md={6} lg={4}>
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
            </Grid>
            <Grid xs={12} md={12} lg={8}>
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
          </Grid>
        </Container>
      </Box>
    </>
  );
};

AdminPage.getLayout = (page: any) => <DashboardLayout>{page}</DashboardLayout>;

export default AdminPage;
