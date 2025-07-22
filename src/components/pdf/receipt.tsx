/* eslint-disable jsx-a11y/alt-text */
// components/pdf/CemicReceiptPDF.tsx
import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
  PDFViewer,
} from "@react-pdf/renderer";
import { parseToBrl } from "../admin/patient/modals/receipt-preview";
import { parseToothRegion } from "@/services/services";
import { format } from "date-fns";
import { useRecoilValue } from "recoil";
import UserData from "@/atoms/userData";

Font.register({
  family: "Poppins",
  fonts: [
    {
      src: "https://fonts.gstatic.com/s/poppins/v20/pxiEyp8kv8JHgFVrJJfedw.ttf", // Regular (400)
      fontWeight: "normal",
    },
    {
      src: "https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLEj6Z11lEA.ttf", // SemiBold (600)
      fontWeight: 600,
    },
    {
      src: "https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLDz8Z11lEA.ttf", // Bold (700)
      fontWeight: "bold",
    },
    {
      src: "https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLGT9Z11lEA.ttf", // ExtraBold (800)
      fontWeight: 800,
    },
  ],
});

interface ReceiptPDFProps {
  receipt: StrapiRelationData<PaymentsInterface>;
  patient: StrapiData<PatientInterface>;
  total: string;
}

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 12,
    fontFamily: "Poppins",
  },
  header: {
    alignItems: "center",
    textAlign: "center",
    marginBottom: 10,
  },
  logo: {
    marginVertical: 10,
    marginHorizontal: "30%",
  },
  title: {
    fontSize: 16,
    marginBottom: 4,
    fontFamily: "Poppins",
    fontWeight: "normal",
  },
  text: {
    marginVertical: 4,
    lineHeight: 1.5,
  },
  bold: {
    fontWeight: 800,
    fontFamily: "Poppins",
    fontSize: 13,
  },
  signatureBlock: {
    marginTop: 40,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-end",
    rowGap: 50,
    paddingHorizontal: 30,
  },
  signature: {
    alignSelf: "flex-end",
    textAlign: "right",
    fontSize: 12,
  },
  line: {
    borderTopWidth: 1,
    borderColor: "#000",
    marginBottom: 4,
    width: 180,
    alignSelf: "center",
  },
  viewer: {
    width: "100%",
    height: "100vh",
  },
  row: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 2,
  },
  regionText: {
    fontSize: 10,
    paddingLeft: 16,
    marginLeft: 12,
    marginVertical: 2,
    maxWidth: "60%", // Simula truncamento
    overflow: "hidden",
    textOverflow: "ellipsis",
    fontFamily: "Poppins",
  },
  lineIcon: {
    fontSize: 10,
    paddingHorizontal: 4,
  },
  priceText: {
    fontSize: 10,
    fontFamily: "Poppins",
  },
  section: {
    marginVertical: 8,
    paddingHorizontal: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: 600,
    marginBottom: 4,
  },
  detail: {
    fontSize: 12,
    marginBottom: 2,
    fontWeight: 400,
    lineHeight: 1.4,
  },
});

const CemicReceiptPDF = ({ receipt, patient, total }: ReceiptPDFProps) => {
  const pat = patient?.attributes;
  const rcpt = receipt?.data?.attributes;
  const treats = (
    rcpt?.treatments as StrapiListRelationData<PatientTreatmentInterface>
  )?.data;
  const payShapes = rcpt?.payment_shapes;
  const filial = pat?.filial;

  const parseShape = (shape: PaymentShapeTypes) => {
    if (shape === "BANK_CHECK") return "Cheque";
    if (shape === "CASH") return "Dinheiro";
    if (shape === "CREDIT_CARD") return "Cartão de Crédito";
    if (shape === "DEBIT_CARD") return "Cartão de Débito";
    if (shape === "PIX") return "Transferência Pix";
    if (shape === "TRANSFER") return "Transferência Bancária TED/DOC";
    if (shape === "WALLET_CREDIT") return "Carteira de Crédito";
  };
  return (
    <PDFViewer style={styles.viewer}>
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.header}>
            <Image style={styles.logo} src="/images/cemicLogo.png" />
            <Text style={{ ...styles.title, fontSize: 19 }}>Recibo</Text>
          </View>

          <Text style={styles.text}>
            <Text style={styles.bold}>
              Recebi de {pat?.name} a quantia de {total} referente a:
            </Text>
          </Text>

          <Text style={styles.text}>
            {treats?.length > 0 &&
              treats?.map((item, i: number) => (
                <View style={styles.row} key={i}>
                  <Text style={styles.regionText}>
                    {`♦ Região ${parseToothRegion(item.attributes.region)} => ${
                      item.attributes.name
                    }`}
                  </Text>

                  <Text style={styles.lineIcon}>→</Text>

                  <Text style={styles.priceText}>
                    {parseToBrl(item.attributes.price)}
                  </Text>
                </View>
              ))}

            {rcpt?.description !== "" && rcpt?.description !== null && (
              <Text style={styles.priceText}>OBS: {rcpt?.description}</Text>
            )}
          </Text>

          <Text style={[styles.text, styles.bold, { marginVertical: 10 }]}>
            TOTAL: {total}
          </Text>

          <Text style={styles.text}>
            <View style={styles.section}>
              <Text style={styles.label}>Forma de Pagamento: </Text>

              {payShapes?.length === 1 &&
                payShapes.map((v: any) => {
                  const valueAdditional =
                    v.price + (v.creditAdditionalValue || 0);

                  if (v.shape === "CREDIT_CARD") {
                    return (
                      <Text key={v.shape} style={styles.detail}>
                        Pagos {parseToBrl(valueAdditional)} no{" "}
                        {parseShape(v.shape)} em {v.split_times}x
                        {v?.creditAdditional > 0
                          ? ` (${parseToBrl(v.price)} + ${parseToBrl(
                              v.creditAdditionalValue
                            )} — ${v.creditAdditional}% de acréscimo)`
                          : ""}
                      </Text>
                    );
                  }

                  if (v.shape === "WALLET_CREDIT") {
                    const fundUsed =
                      (
                        rcpt?.fund_useds as StrapiListRelationData<FundCreditsInterface>
                      )?.data ?? [];
                    return fundUsed.map((p: any, i: number) => {
                      const payment = p.attributes.payment;
                      const paymentDate = new Date(
                        payment?.data?.attributes?.date
                      ).toLocaleDateString();

                      return (
                        <Text key={`wallet-${i}`} style={styles.detail}>
                          Usados {parseToBrl(p.attributes.used_value)} do
                          crédito de {parseToBrl(p.attributes.max_used_value)},
                          pagos no dia {paymentDate}
                        </Text>
                      );
                    });
                  }

                  if (v.shape === "BANK_CHECK") {
                    return (
                      <Text key={v.shape} style={styles.detail}>
                        Pagos no {parseShape(v.shape)} em {v.split_times}x,
                        cheques informados abaixo.
                      </Text>
                    );
                  }

                  return (
                    <Text key={v.shape} style={styles.detail}>
                      Pagos no(a) {parseShape(v.shape)}.
                    </Text>
                  );
                })}

              {payShapes?.length > 1 &&
                payShapes
                  .filter((v, i, arr) =>
                    v.shape === "WALLET_CREDIT"
                      ? arr.findIndex((x) => x.shape === "WALLET_CREDIT") === i
                      : true
                  )
                  .map((v: any, i: number) => {
                    const hasSpace = i === payShapes.length - 1 ? "" : " + ";
                    if (v.shape === "CREDIT_CARD") {
                      return (
                        <Text key={v.shape + i} style={styles.detail}>
                          Pagos{" "}
                          {parseToBrl(v.price + (v.creditAdditionalValue || 0))}{" "}
                          no {parseShape(v.shape)} em {v.split_times}x
                          {v?.creditAdditional > 0
                            ? ` (${parseToBrl(v.price)} + ${parseToBrl(
                                v.creditAdditionalValue
                              )} — ${v.creditAdditional}% de acréscimo)`
                            : ""}
                          {hasSpace}
                        </Text>
                      );
                    }

                    if (v.shape === "WALLET_CREDIT") {
                      const paymentsUseds =
                        (
                          rcpt?.fund_useds as StrapiListRelationData<FundCreditsInterface>
                        )?.data ?? [];
                      const seenFormats = new Set<string>();
                      const formattedPayments: string[] = [];

                      for (const p of paymentsUseds) {
                        const paymentDate = (
                          p.attributes
                            ?.payment as StrapiRelationData<PaymentsInterface>
                        )?.data?.attributes?.date;
                        if (!paymentDate) continue;

                        const formatted = `Usados ${parseToBrl(
                          p.attributes.used_value
                        )} do crédito de ${parseToBrl(
                          p.attributes.max_used_value
                        )}, pagos no dia ${format(
                          new Date(paymentDate),
                          "dd/MM/yyyy"
                        )}`;

                        if (!seenFormats.has(formatted)) {
                          seenFormats.add(formatted);
                          formattedPayments.push(formatted);
                        }
                      }

                      return formattedPayments.map((line, idx) => (
                        <Text key={`wallet-${i}-${idx}`} style={styles.detail}>
                          {line}
                          {idx === formattedPayments.length - 1 && hasSpace}
                        </Text>
                      ));
                    }

                    if (v.shape === "BANK_CHECK") {
                      return (
                        <Text key={v.shape + i} style={styles.detail}>
                          Pagos {parseToBrl(v.price)} no {parseShape(v.shape)}{" "}
                          em {v.split_times}x, cheques informados abaixo.
                        </Text>
                      );
                    }

                    return (
                      <Text key={v.shape + i} style={styles.detail}>
                        Pagos {parseToBrl(v.price)} no(a) {parseShape(v.shape)}
                        {hasSpace}.
                      </Text>
                    );
                  })}
            </View>
          </Text>

          <Text style={{ ...styles.text, ...{ marginVertical: 10 } }}>
            Estou ciente que em caso de desistência, será descontado 10% do
            valor do tratamento negociado
          </Text>

          <Text style={styles.text}>
            Qualquer divergência em relação ao valor do material e procedimento,
            é necessário retornar com o recibo na CEMIC. Paciente precisa trazer
            o recibo sempre que retornar na CEMIC para resolver qualquer
            assunto.
          </Text>

          <Text
            style={{
              ...styles.text,
              marginTop: 30,
              textAlign: "right",
            }}
          >
            {/* {filial} {date} */}
          </Text>

          <View style={styles.signatureBlock}>
            <View>
              <Text>
                {filial}{" "}
                {new Date(rcpt?.date as unknown as string).toLocaleDateString()}
              </Text>
            </View>
            <View>
              <View style={styles.line} />
              <Text style={styles.signature}>Paciente</Text>
            </View>
            <View>
              <View style={styles.line} />
              <Text style={styles.signature}>CEMIC</Text>
            </View>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
};

export default CemicReceiptPDF;
