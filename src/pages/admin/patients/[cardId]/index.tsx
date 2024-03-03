/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/layouts/dashboard/layout";
import { useRouter } from "next/router";
import { Box } from "@mui/material";
import PatientDetails from "@/components/admin/patient";

const PatientSingle = (props: any) => {
  const router = useRouter();
  const [patientCardId, setPatientCardId] = useState(
    router?.query?.cardId ?? ""
  );

  useEffect(() => {
    if (!patientCardId || patientCardId === undefined) return;
    let cardId: any = router?.query?.cardId;
    setPatientCardId(cardId);
  }, [patientCardId]);

  return (
    <Box p={4}>
      {patientCardId !== "" && <PatientDetails cardId={patientCardId} />}
    </Box>
  );
};

PatientSingle.getLayout = (page: any) => (
  <DashboardLayout>{page}</DashboardLayout>
);

export default PatientSingle;
