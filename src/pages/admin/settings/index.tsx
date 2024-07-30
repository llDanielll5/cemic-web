import Head from "next/head";
import { Box, Container, Stack, Typography } from "@mui/material";
import { SettingsNotifications } from "src/components/new-admin/settings/settings-notifications";
import { SettingsPassword } from "src/components/new-admin/settings/settings-password";
import { DashboardLayout } from "src/layouts/dashboard/layout";
import { useRecoilValue } from "recoil";
import UserData from "@/atoms/userData";
import { SettingsCompanies } from "@/components/new-admin/settings/settings-companies";
import { useEffect, useState } from "react";
import axiosInstance from "@/axios";

const Page = () => {
  const adminData = useRecoilValue(UserData);

  return (
    <>
      <Head>
        <title>Opções | CEMIC</title>
      </Head>
      <Box component="main" sx={{ flexGrow: 1, py: 8 }}>
        <Container maxWidth="lg">
          <Stack spacing={3}>
            <Typography variant="h4">Opções</Typography>
            {adminData?.userType === "SUPERADMIN" && <SettingsNotifications />}
            {adminData?.userType === "SUPERADMIN" && <SettingsCompanies />}
            <SettingsPassword />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page: any) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
