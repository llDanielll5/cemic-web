/* eslint-disable jsx-a11y/alt-text */
//@ts-nocheck
import React from "react";
import { anamsVal } from "data";
import { PatientInterface } from "types/patient";
import { parseDateIso } from "@/services/services";
import {
  Document,
  Image,
  Page,
  Text,
  StyleSheet,
  Font,
  PDFViewer,
  View,
} from "@react-pdf/renderer";

Font.register({
  family: "Montserrat",
  src: "http://fonts.gstatic.com/s/montserrat/v7/Kqy6-utIpx_30Xzecmeo8_esZW2xOQ-xsNqO47m55DA.ttf",
});

const styles = StyleSheet.create({
  body: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    fontFamily: "Montserrat",
  },
  author: {
    fontSize: 12,
    textAlign: "center",
    marginBottom: 40,
  },
  subtitle: {
    fontSize: 18,
    margin: 12,
    fontFamily: "Montserrat",
  },
  text: {
    margin: 12,
    fontSize: 14,
    textAlign: "justify",
    fontFamily: "Times-Roman",
  },
  textMin: {
    margin: 10,
    fontSize: 12,
    textAlign: "justify",
    fontFamily: "Times-Roman",
  },
  image: {
    marginVertical: 10,
    marginHorizontal: "30%",
  },
  header: {
    fontSize: 12,
    marginBottom: 20,
    textAlign: "center",
    color: "grey",
  },
  pageNumber: {
    position: "absolute",
    fontSize: 12,
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: "center",
    color: "grey",
  },
  viewer: {
    width: "100%", //the pdf viewer will take up all of the width and height
    height: "100vh",
  },
  tableContainer: {
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    border: "1px solid black",
    padding: 8,
    marginVertical: 8,
  },
  tableRow: { display: "flex", flexDirection: "row" },
  table: (w: string): any => ({ width: w }),
  textTable: { fontSize: "2vw", margin: "4px" },
  tableAnamnese: {
    marginVertical: 2,
    border: "1px solid #d4d4d4",
    padding: 2,
    borderRadius: 4,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
  },
});

const tableData = [];

const ExamplePdfRender = (props: {
  patient: {
    attributes: PatientInterface;
    id: string;
  };
}) => {
  const patient = props.patient;
  const attr = patient?.attributes;

  return (
    <PDFViewer style={styles.viewer}>
      <Document>
        <Page style={styles.body}>
          <Image style={styles.image} src="/images/cemicLogo.png" />

          <Text style={{ alignSelf: "center", fontFamily: "Montserrat" }}>
            ANAMNESE
          </Text>

          <View style={styles.tableContainer}>
            <View style={styles.tableRow}>
              <View style={styles.table("100%")}>
                <Text style={styles.textTable}>
                  Paciente: {attr?.name ?? ""}
                </Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.table("40%")}>
                <Text style={styles.textTable}>
                  Data Nasc: {parseDateIso(attr?.dateBorn)}
                </Text>
              </View>
              <View style={styles.table("60%")}>
                <Text style={styles.textTable}>
                  Endereço: {attr?.address?.address ?? ""}
                </Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.table("40%")}>
                <Text style={styles.textTable}>
                  Bairro: {attr?.address?.neighbor}
                </Text>
              </View>
              <View style={styles.table("60%")}>
                <Text style={styles.textTable}>CEP: {attr?.address?.cep}</Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.table("40%")}>
                <Text style={styles.textTable}>Telefone: {attr?.phone}</Text>
              </View>
              <View style={styles.table("60%")}>
                <Text style={styles.textTable}>Email: {attr?.email}</Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.table("40%")}>
                <Text style={styles.textTable}>CPF: {attr?.cpf}</Text>
              </View>
              <View style={styles.table("60%")}>
                <Text style={styles.textTable}>RG: {attr?.rg}</Text>
              </View>
            </View>
          </View>

          {Object.values(anamsVal).map((text, index) => (
            <View style={styles.tableAnamnese} key={index}>
              <Text style={styles.textTable}>{text}</Text>
              <Text style={styles.textTable}>
                {attr?.anamnese?.[text] as any}
              </Text>
            </View>
          ))}

          <Text style={styles.author}></Text>
          <Text style={styles.author}>Assinatura Paciente</Text>
          <Text style={{ alignSelf: "flex-end", fontSize: 10 }}>
            Brasilia: {new Date().toLocaleDateString()}
          </Text>

          <Image style={styles.image} src="/images/cemicLogo.png" break />
          <Text
            style={{
              fontSize: 14,
              fontFamily: "Montserrat",
              alignSelf: "center",
            }}
          >
            TERMO DE CONSENTIMENTO PARA CIRURGIAS DE IMPLANTES
          </Text>

          {/* <Image style={styles.image} src="/images/quijote2.png" /> */}
          <Text style={styles.textMin}>
            Eu {attr?.name}, de CPF nº {attr?.cpf} e RG nº {attr?.rg}, Por meio
            desse termo, declaro que optei por submeter-me ao procedimento
            cirúrgico de colocação de implante ósseo integrado, para recuperação
            de dentes perdidos que fui orientado de outra alternativa de
            tratamento com suas vantagens e desvantagens. Fui informado ainda
            que tal procedimento apresenta taxa de sucesso de cerca de 92%,
            podendo esta ser reduzida frente a situação, tais como, pacientes
            com diabetes não controlada, hipertensos (pressão alta), cardiopatas
            (problema de coração), alérgicos, portadores de hábitos anormais,
            como bruxismo (ranger os dentes), e pacientes que fazem o uso de
            medicamentos controlados. Além disso, estou ciente que há redução
            dessa porcentagem em pacientes que apresentam estrutura óssea
            (tamanho do osso) reduzida tanto em largura tanto em comprimento ou
            osso extremamente compacto (osso tipo I) ou ainda, extremamente mole
            (osso tipo IV), assim como, em pacientes fumantes e ex-fumantes
            (nesse caso reduzindo-se a 77% de sucesso). Estou consciente também
            que implantes colocados na região posterior apresentam índice de
            perda maior em relação a região anterior, devido a maior carga
            (força) mastigatória, reduzindo-se este índice também, quanto a
            colocação dos implantes de pequenos comprimentos (7 e 8,5) frente a
            implantes maiores (=10 mm), assim como, há em menor grau de sucessos
            em implantes com coroas individualizadas em comparação com coroas
            unidas. Fui esclarecido que o risco de perda de implante é
            considerado até o segundo ano da sua colocação reduzindo-se
            drasticamente para os anos subsequentes, e que há, durante o
            primeiro ano, uma pequena perda óssea horizontal de 1 a 2 mm,
            considerando normal e que se estabiliza nos anos subsequentes. Foram
            destacados também, algumas situações comuns relacionadas ao
            procedimento cirúrgico de colocação de implantes, tais como,
            desconforto pós-operatório, hematomas, edemas, formigamento e trauma
            no canto do lábio com consequente equimose (mancha escura) e
            restrição de abertura de boca. Ficou claro que essas situações podem
            necessitar de alguns dias para recuperação. Estou ciente da
            importância de minha efetiva participação no tratamento, seguindo as
            recomendações e medicações prescritas pelo cirurgião dentista
            enquanto estiver sob seus cuidados, e entendo que sem minha
            cooperação poderá haver diminuição da possibilidade de se obter
            melhores resultados, assim como, sei que deverei realizar controles
            periódicos similares aos dentes naturais com radiografias anuais e
            manter eficiente escovação sobre implante. Entendo que os implantes
            ósseos integrados oferecem resultados funcionais estéticos
            excelentes, porém ele é uma prótese e como tal, possui limitações.
            Tive a oportunidade de discutir minha história médica, não omitindo
            nenhuma informação que possa resultar em prejuízo ao meu tratamento.
            Por último, tive a oportunidade de ler e entender os termos e
            palavras contidas no texto acima e me foram dadas explicações
            pertinentes a ele.
          </Text>

          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              margin: 10,
            }}
          >
            <View>
              <Text style={{ marginTop: 12, fontSize: 12 }}>
                _________________________________________
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  textAlign: "justify",
                  fontFamily: "Times-Roman",
                }}
              >
                Assinatura do Paciente
              </Text>
            </View>
            <Text style={styles.textMin}>
              Data: {new Date().toLocaleDateString()}
            </Text>
          </View>

          <Text style={styles.text}>
            Observação: Se o menor assinar o cirurgião dentista responderá
            legalmente pela lei 8.069/90 pelo artigo 18 da lei n° 4.342/64
          </Text>

          {/* Coroas Definitivas Termo */}

          <Image style={styles.image} src="/images/cemicLogo.png" break />
          <Text
            style={{
              fontSize: 14,
              fontFamily: "Montserrat",
              alignSelf: "center",
            }}
          >
            FASE FINAL: COROAS DEFINITIVAS
          </Text>

          {/* <Image style={styles.image} src="/images/quijote2.png" /> */}
          <Text style={styles.textMin}>
            Eu {attr?.name}, estou ciente que só paguei pela fase cirúrgica dos
            impl antes, e me comprometo em retornar no período de 6 MESES ou
            indicado pelo implantodontista, após a colocação dos implantes, para
            fazer as coroas definitivas de metalocerâmica ( em caso de dente
            individual) ou o protocolo de resina (total). Onde pagarei por elas
            no dia do meu retorno. Estou ciente dos va lores e que pode haver
            acréscimo dos componentes protéticos, também estou ciente de que se
            eu não retornar nesse período indicado pelo profissional, corro o
            risco de perda dos implantes, sendo assim, assumo a responsabilidade
            de comparecer na CEMIC – Centro Médico e de Implantes Comunitários –
            no prazo citado. O meu não comparecimento retira toda
            responsabilidade da CEMIC e do profissional que realizou a minha
            cirurgia.
          </Text>

          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              margin: 10,
            }}
          >
            <View>
              <Text style={{ marginTop: 12, fontSize: 12 }}>
                _________________________________________
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  textAlign: "justify",
                  fontFamily: "Times-Roman",
                }}
              >
                Assinatura do Paciente
              </Text>
            </View>
            <Text style={styles.textMin}>
              Data: {new Date().toLocaleDateString()}
            </Text>
          </View>

          <Text
            style={styles.pageNumber}
            render={({ pageNumber, totalPages }) =>
              `${pageNumber} / ${totalPages}`
            }
            fixed
          />
        </Page>
      </Document>
    </PDFViewer>
  );
};

export default ExamplePdfRender;
