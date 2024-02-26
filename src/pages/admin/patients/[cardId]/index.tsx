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
  const patientCardId: any = router?.query?.cardId;
  const adminData: any = useRecoilValue(UserData);
  const [patientData, setPatientData] = useRecoilState(PatientData);

  const handleGetPatientInfo = useCallback(async () => {
    if (!patientCardId || patientCardId === undefined) return;
    return await handleGetSinglePatient(patientCardId!).then(
      (res) => setPatientData(res.data.data[0]),
      (err) => console.log(err.response)
    );
  }, [patientCardId]);

  useEffect(() => {
    handleGetPatientInfo();
  }, [handleGetPatientInfo]);

  return <Box p={4}>{patientData !== null && <PatientDetails />}</Box>;
};

PatientSingle.getLayout = (page: any) => (
  <DashboardLayout>{page}</DashboardLayout>
);

export default PatientSingle;
