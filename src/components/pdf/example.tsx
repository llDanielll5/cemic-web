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
Font.register({
  family: "Times-Roman",
  src: "https://www.grmw.org/static/fonts/Times%20New%20Roman.ttf",
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
    marginVertical: 8,
  },
  tableRow: {
    display: "flex",
    flexDirection: "row",
    borderBottom: "1px solid black",
  },
  table: (w: string): any => ({ width: w, borderRight: "1px solid black" }),
  textTable: {
    fontSize: "1.8vw",
    margin: "4px",
  },
  tableAnamnese: {
    borderBottom: "1px solid black",
    padding: 2,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  tableBudget: {
    display: "flex",
    flexDirection: "row",
    border: "1px solid black",
  },
  tableBudgetTitle: {
    fontSize: "2vw",
    fontFamily: "Montserrat",
    textAlign: "center",
    padding: 3,
  },
  center: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});

const tableData = [];

const headerPatient = (attr) => (
  <View style={styles.tableContainer}>
    <View style={{ ...styles.tableRow }}>
      <View style={styles.table("100%")}>
        <Text style={styles.textTable}>Paciente: {attr?.name ?? ""}</Text>
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
        <Text style={styles.textTable}>Bairro: {attr?.address?.neighbor}</Text>
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
);

const headerBudgetTable = (titles: string[], isBold?: boolean) => (
  <View style={styles.tableBudget}>
    <View style={{ ...styles.table("20%"), ...styles.center }}>
      <Text
        style={{
          ...styles.tableBudgetTitle,
          fontFamily: isBold ? "Montserrat" : "Times-Roman",
        }}
      >
        {titles[0]}
      </Text>
    </View>
    <View style={{ ...styles.table("20%"), ...styles.center }}>
      <Text
        style={{
          ...styles.tableBudgetTitle,
          fontFamily: isBold ? "Montserrat" : "Times-Roman",
        }}
      >
        {titles[1]}
      </Text>
    </View>
    <View style={{ ...styles.table("20%"), ...styles.center }}>
      <Text
        style={{
          ...styles.tableBudgetTitle,
          fontFamily: isBold ? "Montserrat" : "Times-Roman",
        }}
      >
        {titles[2]}
      </Text>
    </View>
    <View style={{ ...styles.table("20%"), ...styles.center }}>
      <Text
        style={{
          ...styles.tableBudgetTitle,
          fontFamily: isBold ? "Montserrat" : "Times-Roman",
        }}
      >
        {titles[3]}
      </Text>
    </View>
    <View style={{ ...styles.table("20%"), ...styles.center }}>
      <Text
        style={{
          ...styles.tableBudgetTitle,
          fontFamily: isBold ? "Montserrat" : "Times-Roman",
        }}
      >
        {titles[4]}
      </Text>
    </View>
  </View>
);

const basicHeaderBudget = () => {
  return headerBudgetTable(
    [
      "Procedimento",
      "Qntd Orçada",
      "Região Dentes",
      "Valor Unitário",
      "Valor Total",
    ],
    true
  );
};

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

          {headerPatient(attr)}

          <View style={{ border: "1px solid black", marginBottom: 17 }}>
            {Object.values(anamsVal).map((text, index) => (
              <View style={styles.tableAnamnese} key={index}>
                <Text style={styles.textTable}>{text}</Text>
                <Text style={styles.textTable}>
                  {attr?.anamnese?.[text] as string}
                </Text>
              </View>
            ))}
          </View>

          <Text style={{ fontSize: "12px" }}>
            OBS:{" "}
            <Text>
              {attr?.observations === ""
                ? "____________________________________________________________________"
                : attr?.observations}
            </Text>
          </Text>

          <View style={{ marginTop: 20 }}>
            <Text style={{ alignSelf: "center", fontSize: 10 }}>
              _______________________________________
            </Text>
            <Text style={{ ...styles.author, marginBottom: 10 }}>
              Assinatura Paciente
            </Text>
            <Text style={{ alignSelf: "flex-end", fontSize: 12 }}>
              Brasilia: {new Date().toLocaleDateString()}
            </Text>
          </View>

          {/* ORÇAMENTOS */}

          <Image style={styles.image} src="/images/cemicLogo.png" break />
          <Text style={{ ...styles.subtitle, textAlign: "center", margin: 0 }}>
            Ficha Cadastral
          </Text>

          <View style={styles.tableContainer}>
            <View style={{ ...styles.tableRow }}>
              <View style={styles.table("100%")}>
                <Text style={styles.textTable}>
                  Paciente: {attr?.name ?? ""}
                </Text>
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

          <Text style={{ ...styles.subtitle, textAlign: "center", margin: 0 }}>
            Material
          </Text>

          <Text style={{ ...styles.subtitle, fontSize: "1.9vw", margin: 0 }}>
            1ª Fase
          </Text>
          {basicHeaderBudget()}
          {headerBudgetTable(
            ["Levantamento Seio", "", "", "R$ 500,00", ""],
            false
          )}
          {headerBudgetTable(
            ["Enxerto Simples", "", "", "R$ 500,00", ""],
            false
          )}
          {headerBudgetTable(
            ["Enxerto Complexo", "", "", "R$ 1000,00", ""],
            false
          )}
          {headerBudgetTable(["Membrana", "", "", "R$ 400,00", ""], false)}
          {headerBudgetTable(
            ["Osso Liofilizado", "", "", "R$ 400,00", ""],
            false
          )}
          {headerBudgetTable(["Osso Bioss", "", "", "R$ 1300,00", ""], false)}

          <Text style={{ ...styles.subtitle, fontSize: "1.9vw", margin: 0 }}>
            2ª Fase
          </Text>
          {basicHeaderBudget()}
          {headerBudgetTable(["Implante", "", "", "R$ 450,00", ""], false)}
          {headerBudgetTable(["Mini Implante", "", "", "R$ 250,00", ""], false)}
          {headerBudgetTable(["Prótese Total", "", "", "R$ 450,00", ""], false)}
          {headerBudgetTable(["Exodontia", "", "", "R$ 50,00", ""], false)}
          {headerBudgetTable(["Over Denture", "", "", "R$ 3000,00", ""], false)}
          {headerBudgetTable(
            ["Sedação Médica Anestésica", "", "", "R$ 900,00", ""],
            false
          )}

          <Text style={{ ...styles.subtitle, fontSize: "1.9vw", margin: 0 }}>
            3ª Fase
          </Text>
          {basicHeaderBudget()}
          {headerBudgetTable(
            ["Coroa Definitiva Metalocerâmica", "", "", "R$ 700,00", ""],
            false
          )}
          {headerBudgetTable(
            ["Componentes Protéticos", "", "", "R$ 250,00", ""],
            false
          )}
          {headerBudgetTable(
            ["Protocolo Definitivo Superior Resina", "", "", "R$ 4500,00", ""],
            false
          )}
          {headerBudgetTable(
            ["Protocolo Definitivo Inferior Resina", "", "", "R$ 4000,00", ""],
            false
          )}
          {headerBudgetTable(["Total Geral", "", "", "", ""], false)}

          {/* FIM ORÇAMENTOS */}

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

          <Text
            style={{
              ...styles.text,
              fontSize: "1.9vw",
              fontWeight: "bold",
              fontFamily: "Montserrat",
            }}
          >
            Observação:{" "}
            <Text style={{ ...styles.text, fontSize: "2vw" }}>
              Se o menor assinar o cirurgião dentista responderá legalmente pela
              lei 8.069/90 pelo artigo 18 da lei n° 4.342/64
            </Text>
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
            TERMO DE CONSENTIMENTO PARA COROAS
          </Text>

          {/* <Image style={styles.image} src="/images/quijote2.png" /> */}
          <Text style={styles.textMin}>
            Eu {attr?.name} estou ciente que só paguei pela fase cirúrgica do
            meu tratamento de implantes, e me comprometo em retornar no período
            de 6 meses ou a data definida pelo especialista, após a colocação
            dos implantes para fazer as coroas definitiva de metalocerâmica em
            caso de implantes individuais, ou prótese protocolo superior de
            resina. Onde pagarei por elas no dia do meu retorno. Exceto nos
            casos de carga imediata de prótese protocolo de resina na inferior.
            Me comprometo que depois de instaladas minhas próteses definitivas,
            de voltar ao especialista de 6 em 6 meses para fazer limpeza
            (manutenções) das minhas próteses definitivas, próteses protocolos e
            etc., e que pagarei por esses serviços no dia do meu retorno. Fui
            informado que optando pelo, tratamentos com implantes dentários,
            estarei sempre em tratamento sendo assim precisando de minha
            colaboração, como higienização, manutenções, retornos caso sinta
            dores incômodos ou caso precise de ajustes protéticas, infecções e
            etc. Fui informado que, tratamento com implantes dentários não são
            permanentes ou para sempre e que pode ter perdas ou rejeição dos
            implantes da forma que li no meu risco cirúrgico. Ex: falta de
            manutenções (limpeza).
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
            style={{
              ...styles.text,
              fontSize: "1.9vw",
              fontWeight: "bold",
              fontFamily: "Montserrat",
            }}
          >
            Observação:{" "}
            <Text style={{ ...styles.text, fontSize: "2vw" }}>
              Se o menor assinar o cirurgião dentista responderá legalmente pela
              lei 8.069/90 pelo artigo 18 da lei n° 4.342/64
            </Text>
          </Text>

          <Image style={styles.image} src="/images/cemicLogo.png" break />
          <Text
            style={{
              fontSize: 14,
              fontFamily: "Montserrat",
              alignSelf: "center",
            }}
          >
            CONTROLE DE PROCEDIMENTOS
          </Text>
          <View style={styles.tableContainer}>
            <View style={{ ...styles.tableRow }}>
              <View style={styles.table("100%")}>
                <Text style={styles.textTable}>
                  Paciente: {attr?.name ?? ""}
                </Text>
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

          <View style={styles.tableBudget}>
            <View style={{ ...styles.table("15%"), ...styles.center }}>
              <Text
                style={{
                  ...styles.tableBudgetTitle,
                }}
              >
                Data
              </Text>
            </View>
            <View style={{ ...styles.table("50%"), ...styles.center }}>
              <Text
                style={{
                  ...styles.tableBudgetTitle,
                }}
              >
                Procedimentos Realizados
              </Text>
            </View>
            <View style={{ ...styles.table("20%"), ...styles.center }}>
              <Text
                style={{
                  ...styles.tableBudgetTitle,
                }}
              >
                CD
              </Text>
            </View>
            <View style={{ ...styles.table("15%"), ...styles.center }}>
              <Text
                style={{
                  ...styles.tableBudgetTitle,
                }}
              >
                CEMIC
              </Text>
            </View>
          </View>
          {[
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
          ].map((v, i) => (
            <View style={styles.tableBudget} key={i}>
              <View style={{ ...styles.table("15%"), ...styles.center }}>
                <Text style={{ ...styles.tableBudgetTitle, padding: 7 }}></Text>
              </View>
              <View style={{ ...styles.table("50%"), ...styles.center }}>
                <Text style={{ ...styles.tableBudgetTitle, padding: 7 }}></Text>
              </View>
              <View style={{ ...styles.table("20%"), ...styles.center }}>
                <Text style={{ ...styles.tableBudgetTitle, padding: 7 }}></Text>
              </View>
              <View style={{ ...styles.table("15%"), ...styles.center }}>
                <Text style={{ ...styles.tableBudgetTitle, padding: 7 }}></Text>
              </View>
            </View>
          ))}

          {/* <Text
            style={styles.pageNumber}
            render={({ pageNumber, totalPages }) =>
              `${pageNumber} / ${totalPages}`
            }
            fixed
          /> */}
        </Page>
      </Document>
    </PDFViewer>
  );
};

export default ExamplePdfRender;
