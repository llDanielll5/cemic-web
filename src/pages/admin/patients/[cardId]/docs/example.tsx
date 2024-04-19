import React, { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { handleGetSinglePatient } from "@/axios/admin/patients";

// import { Container } from './styles';
const PDFViewerWithNoSSR = dynamic(
  import("../../../../../components/pdf/example"),
  { ssr: false }
);

const PDFExample = () => {
  const router = useRouter();
  const cardId: any = router?.query?.cardId;
  const [patientData, setPatientData] = useState<null | any>(null);

  const handleGetPatient = useCallback(async () => {
    if (!cardId) return;
    return await handleGetSinglePatient(cardId!).then(
      (res) => setPatientData(res.data.data[0]),
      (err) => console.log(err.response)
    );
  }, [cardId]);

  useEffect(() => {
    handleGetPatient();
  }, [handleGetPatient]);

  if (patientData === null) return;

  return <PDFViewerWithNoSSR patient={patientData} />;
};

export default PDFExample;
