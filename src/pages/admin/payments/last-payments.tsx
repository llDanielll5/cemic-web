import React from "react";
import { DashboardLayout } from "@/layouts/dashboard/layout";

const LastPaymentsPage = () => {
  return <></>;
};

LastPaymentsPage.getLayout = (page: React.ReactElement) => (
  <DashboardLayout>{page}</DashboardLayout>
);

export default LastPaymentsPage;
