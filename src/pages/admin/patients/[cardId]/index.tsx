/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useState } from "react";
import { DashboardLayout } from "@/layouts/dashboard/layout";
import { useLoading } from "@/contexts/LoadingContext";
import { Box } from "@mui/material";
import { useRouter } from "next/router";
import Loading from "@/components/loading";
import dynamic from "next/dynamic";

const SingleUser = dynamic(import("@/components/admin/patient"), {
  ssr: false,
});

const PatientSingle = () => {
  const router = useRouter();
  const { handleLoading } = useLoading();
  const card = router?.query?.cardId ?? "";
  const [patientCardId, setPatientCardId] = useState(card);

  const getPatient = useCallback(async () => {
    setPatientCardId(card);
  }, [card]);

  useEffect(() => {
    if (!card || card === undefined) return;
    else getPatient();
  }, [getPatient, card]);

  return (
    <Box p={4}>
      {!!card ? (
        <SingleUser cardId={patientCardId as string} />
      ) : (
        <Loading message="Carregando Informações do Usuário" />
      )}
    </Box>
  );
};

PatientSingle.getLayout = (page: any) => (
  <DashboardLayout>{page}</DashboardLayout>
);

export default PatientSingle;
