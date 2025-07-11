import React, { useCallback, useEffect, useState } from "react";
import DentistDetailsSingle from "@/components/admin/dentist/_components/dentist-details";
import Loading from "@/components/loading";
import { DashboardLayout } from "@/layouts/dashboard/layout";
import { getSingleDentist } from "@/axios/admin/dentists";
import { Box, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

const DentistDetailsPage = () => {
  const router = useRouter();
  const id = router?.query?.id ?? "";
  const [dentistId, setDentistId] = useState<string>(id as string);
  const [dentistInfos, setDentistInfos] =
    useState<StrapiData<DentistStrapiAttributes> | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorResponse, setErrorResponse] = useState<boolean>(false);

  const getDentist = useCallback(async () => {
    try {
      setDentistId(id as string);
      const {
        data,
      }: { data: StrapiRelation<StrapiData<DentistStrapiAttributes>> } =
        await getSingleDentist(dentistId);
      setDentistInfos(data.data);
    } catch (error: any) {
      console.log({ error: error?.response });
      setErrorResponse(true);
      toast.error("Erro ao recuperar dados do Dentista");
    }
  }, [id, dentistId]);

  useEffect(() => {
    if (!id || id === undefined) return;
    else getDentist();
  }, [getDentist, id]);

  return (
    <Box p={4}>
      {dentistInfos !== null ? (
        <DentistDetailsSingle dentistInfos={dentistInfos} />
      ) : errorResponse ? (
        <Typography variant="h2">
          Erro ao recuperar dados do Dentista
        </Typography>
      ) : isLoading ? (
        <Loading message="Carregando Informações do Usuário" />
      ) : null}
    </Box>
  );
};

DentistDetailsPage.getLayout = (page: React.ReactElement) => (
  <DashboardLayout>{page}</DashboardLayout>
);

export default DentistDetailsPage;
