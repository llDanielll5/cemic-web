import { GetServerSidePropsContext } from "next";
import { contextUserAdmin } from "@/services/server-props";
import axiosInstance from "@/axios";
import axios from "axios";
import dynamic from "next/dynamic";
import { useMemo } from "react";
import { parseToBrl } from "@/components/admin/patient/modals/receipt-preview";

const ReceiptPdfRender = dynamic(
  import("../../../../../components/pdf/receipt"),
  { ssr: false }
);

const PDFExample = ({
  receipt,
  patient,
}: {
  receipt: StrapiRelationData<PaymentsInterface>;
  patient: StrapiData<PatientInterface>;
}) => {
  const payShapes = receipt?.data?.attributes?.payment_shapes;
  console.log({ receipt });

  const getTotal = useMemo(() => {
    const payShapesArr = payShapes?.map((pShape) => {
      const creditValue = pShape.price + (pShape.creditAdditionalValue || 0);
      if (pShape.shape === "CREDIT_CARD") return creditValue;
      else if (pShape.shape === "WALLET_CREDIT") {
        let fundCreditPaymentShapes =
          (
            (pShape?.fund_credit as StrapiRelationData<FundCreditsInterface>)
              ?.data?.attributes
              ?.payment as StrapiRelationData<PaymentsInterface>
          )?.data?.attributes?.payment_shapes || [];
        if (fundCreditPaymentShapes?.length === 0) return pShape.price;
        let sum: number[] = [];

        for (const element of fundCreditPaymentShapes) {
          if (element.shape === "CREDIT_CARD") {
            let val = element.price + (element.creditAdditionalValue || 0);
            sum.push(val);
          } else sum.push(element.price);
        }

        //   setPaymentsWallets(fundCreditPaymentShapes);

        return sum.reduce((p, c) => p + c, 0);
      } else return pShape.price;
    });

    const value = payShapesArr?.reduce((prev, curr) => prev + curr, 0);
    return parseToBrl(value);
  }, [payShapes]);

  return (
    <ReceiptPdfRender
      receipt={receipt}
      patient={patient}
      total={getTotal as string}
    />
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { payment_id, cardId } = context.query as {
    payment_id: string;
    cardId: string;
  };

  const { jwtHeader, userJson } = contextUserAdmin(context);

  let patient = null;

  try {
    if (cardId) {
      const { data } = await axiosInstance.get(
        `/patients/?filters[cardId][$eq]=${cardId}&populate=*`,
        jwtHeader
      );
      patient = data.data[0];
    }
    if (userJson?.userType !== "DENTIST") {
      const { data } = await axiosInstance.get(
        `payments/${payment_id}?populate[payment_shapes][populate][fund_credit][populate][0]=fund_credit&populate[fund_credit][populate]=*&populate[treatments][populate]=*&populate[fund_useds][populate]=*&populate[patient][populate]=*`,
        jwtHeader
      );

      return { props: { receipt: data, patient } };
    }
  } catch (error) {
    return { props: { receipt: null, patient } };
  }
}

export default PDFExample;
