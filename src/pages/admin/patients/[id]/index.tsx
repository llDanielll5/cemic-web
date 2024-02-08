import React, { useCallback, useEffect, useState } from "react";
import { handleGetSinglePatient } from "@/axios/admin/patients";
import { DashboardLayout } from "@/layouts/dashboard/layout";
import { Box, Button, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useRecoilValue, useRecoilState } from "recoil";
import UserData from "@/atoms/userData";
import PatientDetails from "@/components/admin/patient";
import PatientData from "@/atoms/patient";

const PatientSingle = (props: any) => {
  const router = useRouter();
  const patientId: any = router?.query?.id;
  const adminData: any = useRecoilValue(UserData);
  const [patientData, setPatientData] = useRecoilState(PatientData);

  const getBack = () => router.push("/admin/patients");
  const handleGetPatientInfo = useCallback(async () => {
    if (!patientId || patientId === undefined) return;
    return await handleGetSinglePatient(patientId!).then(
      (res) => setPatientData(res.data.data),
      (err) => console.log(err.response)
    );
  }, [patientId]);

  useEffect(() => {
    handleGetPatientInfo();
  }, [handleGetPatientInfo]);

  return (
    <Box p={4}>
      {patientData !== null && (
        <Typography variant="h5">{patientData?.attributes?.name}</Typography>
      )}
      {patientData !== null && <PatientDetails />}
    </Box>
  );
};

PatientSingle.getLayout = (page: any) => (
  <DashboardLayout>{page}</DashboardLayout>
);

export default PatientSingle;
