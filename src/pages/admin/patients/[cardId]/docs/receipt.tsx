import React from "react";
import ReceiptPdfRender from "@/components/pdf/receipt";
import { GetServerSidePropsContext } from "next";
import { contextUserAdmin } from "@/services/server-props";
import axiosInstance from "@/axios";
import { handleGetSinglePatient } from "@/axios/admin/patients";

const PDFExample = ({
  receipt,
  patient,
}: {
  receipt: PaymentsInterface;
  patient: PatientInterface;
}) => {
  console.log({ receipt, patient });
  return <ReceiptPdfRender patient={patient} receipt={receipt} />;
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { payment_id, cardId } = context.query as {
    payment_id: string;
    cardId: string;
  };
  const { jwtHeader, userJson } = contextUserAdmin(context);
  let patient = null;

  if (cardId) {
    const { data } = await handleGetSinglePatient(cardId!);
    patient = data.data[0];
  }

  if (userJson.userType === "DENTIST") {
    const { data } = await axiosInstance.get(
      `payments/${payment_id}/?populate[payment_shapes]=*&populate[payment_shapes][populate][0][fund_credit]=*`,
      jwtHeader
    );
    return { props: { receipt: data, patient } };
  }

  return { props: { receipt: null, patient } };
}

export default PDFExample;
