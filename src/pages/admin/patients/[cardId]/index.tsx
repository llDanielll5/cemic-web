/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useState } from "react";
import { DashboardLayout } from "@/layouts/dashboard/layout";
import { useLoading } from "@/contexts/LoadingContext";
import { Box } from "@mui/material";
import { useRouter } from "next/router";
import Loading from "@/components/loading";
import dynamic from "next/dynamic";
import { getCookie } from "cookies-next";
import { GetServerSidePropsContext } from "next";
import { handleGetSinglePatient } from "@/axios/admin/patients";

const SingleUser = dynamic(import("@/components/admin/patient"), {
  ssr: false,
});

const PatientSingle = ({
  patient,
}: {
  patient: StrapiData<PatientInterface>;
}) => {
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

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { cardId } = context.query as { cardId: string };
  const jwt = context
    ? getCookie("jwt", { req: context.req, res: context.res })
    : undefined;

  const user = context
    ? getCookie("user", { req: context.req, res: context.res })
    : undefined;

  const userJson: AdminType = JSON.parse(user as string);
  const jwtHeader = {
    headers: {
      ...(jwt && { Authorization: `Bearer ${jwt}` }),
    },
  };

  const { data } = await handleGetSinglePatient(cardId, jwtHeader);

  if (data) {
    return { props: { patient: data.data[0] } };
  }

  return { props: { patient: null } };
}

export default PatientSingle;
