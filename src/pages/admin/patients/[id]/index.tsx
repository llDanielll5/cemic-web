import React, { useCallback, useEffect, useState } from "react";
import { handleGetSinglePatient } from "@/axios/admin/patients";
import { DashboardLayout } from "@/layouts/dashboard/layout";
import { Box, Button, Typography } from "@mui/material";
import { useRouter } from "next/router";
import ClientInfos from "@/components/admin/clientInfos";
import { useRecoilValue } from "recoil";
import UserData from "@/atoms/userData";
import IconButton from "@/components/iconButton";

const PatientSingle = (props: any) => {
  const router = useRouter();
  const patientId: any = router?.query?.id;
  const adminData: any = useRecoilValue(UserData);
  const [patientData, setPatientData] = useState<any | null>(null);

  const handleGetPatientInfo = useCallback(async () => {
    if (!patientId || patientId === undefined) return;
    return await handleGetSinglePatient(patientId!).then(
      (res) => setPatientData(res.data.data),
      (err) => console.log(err.response)
    );
  }, [patientId]);

  const getBack = () => router.push("/admin/patients");

  useEffect(() => {
    handleGetPatientInfo();
  }, [handleGetPatientInfo]);

  return (
    <Box p={4}>
      <Button onClick={getBack} variant="text">
        {`< Voltar`}
      </Button>
      {patientData !== null && (
        <ClientInfos
          client={patientData}
          onUpdate={handleGetPatientInfo}
          adminData={adminData}
        />
      )}
    </Box>
  );
};

PatientSingle.getLayout = (page: any) => (
  <DashboardLayout>{page}</DashboardLayout>
);

export default PatientSingle;
