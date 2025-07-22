import React, { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { handleGetSinglePatient } from "@/axios/admin/patients";

// import { Container } from './styles';
const PDFViewerWithNoSSR = dynamic(
  import("../../../../../components/pdf/contract"),
  { ssr: false }
);

const PDFExample = () => {
  const router = useRouter();
  const cardId: string = router?.query?.cardId as string;
  const [patientData, setPatientData] = useState<null | any>(null);

  const handleGetPatient = useCallback(async () => {
    if (!cardId) return;
    try {
      const { data } = await handleGetSinglePatient(cardId!);
      setPatientData(data.data[0]);
    } catch (error) {
      console.log({ error });
    }
  }, [cardId]);

  useEffect(() => {
    handleGetPatient();
  }, [handleGetPatient]);

  if (patientData === null) return;

  return <PDFViewerWithNoSSR patient={patientData} />;
};

export default PDFExample;
