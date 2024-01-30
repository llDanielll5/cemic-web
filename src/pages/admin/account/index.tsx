import Head from "next/head";
import { DashboardLayout } from "src/layouts/dashboard/layout";
import { AccountProfile } from "src/components/new-admin/account/account-profile";
import { AccountProfileDetails } from "src/components/new-admin/account/account-profile-details";
import {
  Box,
  Container,
  Stack,
  Typography,
  Unstable_Grid2 as Grid,
} from "@mui/material";

const AccountPage = () => {
  return (
    <>
      <Head>
        <title>Conta | CEMIC</title>
      </Head>
      <Box component="main" sx={{ flexGrow: 1, py: 8 }}>
        <Container maxWidth="lg">
          <Stack spacing={3}>
            <div>
              <Typography variant="h4">Conta</Typography>
            </div>
            <div>
              <Grid container spacing={3}>
                <Grid xs={12} md={6} lg={4}>
                  <AccountProfile />
                </Grid>
                <Grid xs={12} md={6} lg={8}>
                  <AccountProfileDetails />
                </Grid>
              </Grid>
            </div>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

AccountPage.getLayout = (page: any) => (
  <DashboardLayout>{page}</DashboardLayout>
);

export default AccountPage;
