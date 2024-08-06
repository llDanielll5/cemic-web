import React from "react";
import { PatientInterface } from "types/patient";
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
import { cpfMask, parseDateBr } from "@/services/services";
import { getCookie } from "cookies-next";

const ContractPDF = (props: {
  patient: {
    attributes: PatientInterface;
    id: string;
  };
}) => {
  const patient = props.patient;
  const attr = patient?.attributes;
  const adminData = getCookie("user");
  const adminParsed: any = JSON.parse(adminData as string);

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
    container: {
      padding: "16px",
    },
    clausule: {
      fontFamily: "Times-Roman",
      fontSize: "2vw",
      marginVertical: "8px",
      paddingHorizontal: "16px",
      textAlign: "justify",
    },
    title: {
      fontSize: "2.3vw",
      fontWeight: "bold",
      textAlign: "center",
      marginVertical: 10,
    },
  });

  return (
    <PDFViewer style={styles.viewer}>
      <Document>
        <Page>
          <View style={styles.container}>
            <Text style={styles.title}>
              TERMO DE CONSENTIMENTO LIVRE E ESCLARECIDO
            </Text>

            <Text style={styles.clausule}>
              Pelo presente termo de consentimento livre e esclarecido, eu,{" "}
              {attr?.name}, paciente (ou responsável legal do(a) menor
              __________________________________), portador(a) do RG nº{" "}
              {attr?.rg}, CPF nº {cpfMask(attr?.cpf)}, residente a{" "}
              {attr?.address?.address}, CEP: {attr?.address?.cep}, declaro que o
              (a)
              cirurgião(ã)-dentista_____________________________________________,
              devidamente inscrito(a) no Conselho Regional de Odontologia{" "}
              {adminParsed.filial === "Brasilia"
                ? "do Distrito Federal"
                : "de Minas Gerais"}{" "}
              sob o nº _________, com consultório à
              _________________________________________________, (cidade)
              _____________, {adminParsed.location}, CEP ____________,
              profissional parceiro comunitário da CEMIC e escolhido para
              realizar o tratamento descrito no planejamento de tratamento e
              planejamento de custos, constante em meu prontuário, cuja cópia
              encontra-se em meu poder e sob a minha guarda, declaro que:
            </Text>

            <Text style={styles.clausule}>
              1. A ficha de anamnese foi por mim CONFERIDA E ASSINADA,
              apresentando informações que correspondem à verdade dos fatos,
              especialmente no que diz respeito às minhas condições da saúde
              geral e bucal, não tendo omitido ou suprimido qualquer dado quanto
              a doenças pré-existentes e que sejam de meu conhecimento, tão
              pouco quanto ao uso de medicamentos controlados ou não, ciente de
              que a omissão de dados sobre a minha saúde geral e bucal e sobre o
              uso de medicamentos pode interferir negativamente no planejamento
              e andamento de tratamento, na resposta biológica do meu organismo
              à técnica empregada, podendo ocasionar danos irreversíveis à minha
              saúde bucal e geral, inclusive quando do uso de substâncias
              medicamentosas utilizadas durante o procedimento odontológico ou
              prescritas no transcorrer do tratamento, que podem dar causa à
              problemas cardíacos, alergias e até a morte;
            </Text>

            <Text style={styles.clausule}>
              2. Considerando minha queixa principal e, após avaliação clínica e
              de eventuais exames complementares, o profissional me esclareceu
              sobre o diagnóstico e planejamento de tratamento, com alternativas
              e informações claras sobre os objetivos e riscos do planejamento
              terapêutico escolhido, bem como sobre minha responsabilidade de
              colaborar e contribuir para o tratamento que será executado;
            </Text>

            <Text style={styles.clausule}>
              3. É de meu conhecimento que a CEMIC NÃO É UM ORGÃO BENEFICENTE
              (não recebe dinheiro do Governo), sendo uma associação sem fins
              lucrativos, que possui um projeto social na área de implantes
              dentários assistido por voluntários, portanto, tenho ciência que a
              CEMIC adquire os materiais com preço de custo para atender os
              beneficiários do projeto social para fins de tratamento de
              implante dentário.
            </Text>

            <Text style={styles.clausule}>
              4. É de meu conhecimento de que o tratamento de implante
              corresponde a duas fases, sendo a primeira a cirúrgica e segunda
              protética, podendo sofrer prorrogação ou alteração de prazo, de
              acordo com eventual complexidade que o caso apresentar no decorrer
              do tratamento, bem como pela resposta biológica do meu organismo à
              técnica empregada, assiduidade às consultas e seguimento das
              orientações fornecidas pelo profissional;
            </Text>

            <Text style={styles.clausule}>
              5. É de meu conhecimento que o tratamento de implante poderá
              corresponder a três fases, podendo sofrer prorrogação ou alteração
              de prazo, de acordo com eventual complexidade que o caso
              apresentar no decorrer do tratamento, bem como pela resposta
              biológica do meu organismo à técnica empregada, assiduidade às
              consultas e seguimento das orientações fornecidas pelo
              profissional;
            </Text>

            <Text style={styles.clausule}>
              5.1. 1ª Fase- A primeira fase corresponde a parte cirúrgica
              (levantamento de seio, enxerto ósseo, membrana e osso
              liofilizado), sendo que essa fase será feita apenas quando o
              paciente não ter osso suficiente para instalação do implante.
            </Text>

            <Text style={styles.clausule}>
              5.2. 2ª Fase - A segunda fase corresponde à instalação dos
              implantes, exodontia ou prótese provisória. 5.3. 3ª Fase - A
              terceira fase corresponde a parte protética (próteses individuais,
              coroas de metalocerâmica ou prótese protocolo em resina).
            </Text>

            <Text style={styles.clausule}>
              6. É de meu conhecimento que cada fase do tratamento de implante
              possui um custo.
            </Text>

            <Text style={styles.clausule}>
              7. Fui informado (a) que pagarei por cada fase do procedimento de
              implante a depender de fase de execução no momento oportuno.
            </Text>

            <Text style={{ ...styles.clausule, marginTop: 40 }} break>
              8. Fui informado e esclarecido, que optando pelo tratamento de
              implantes dentários, estarei sempre em tratamento, portanto,
              declaro, que estou ciente e esclarecido (a) que deverei observar
              os seguintes cuidados: (com a higiene bucal específica da prótese
              escolhida, cuidados com a mastigação com alimentos duros e
              pegajosos, realizar manutenções ou profilaxias preventivas de 6 em
              6 meses), marcar retorno caso sinta dores, incômodos ou caso seja
              necessário seja necessário realizar ajustes protéticos, além de
              eventual surgimento de infecção / anormalidade local.
            </Text>

            <Text style={styles.clausule}>
              9. Declaro, que estou ciente que eventuais ausências às consultas
              a cada período de 6 meses e o não atendimento das orientações
              profissionais prejudicarão o resultado pretendido, uma vez que a
              Odontologia não se trata de uma ciência exata, sofrendo
              limitações.
            </Text>

            <Text style={styles.clausule}>
              10. Declaro, que estou ciente que eventuais ausências às consultas
              a cada período de 6 meses e o não atendimento das orientações e
              cuidados indicados pelos profissionais, assumo o risco e a
              responsabilidade por algum problema no meu tratamento
              odontológico. Assim assumo, que não haverá nenhuma
              responsabilidade civil por parte da CEMIC e do profissional que
              realizou o meu tratamento ante a minha desídia (não comparecimento
              regular para realização do tratamento e manutenções preventivas).
              11. Fui informado que o tratamento com implantes dentários não são
              permanentes ou para sempre e que podem ocorrer perdas ou rejeições
              dos implantes das formas que li no meu risco cirúrgico.
            </Text>

            <Text style={styles.clausule}>
              12. Declaro que estou ciente de que deverei comparecer
              pontualmente no consultório do dentista especialista parceiro da
              CEMIC, nas sessões, previamente agendadas, devendo seguir,
              rigorosamente, as prescrições, encaminhamentos a outros
              especialistas da área odontológica ou profissionais da área de
              saúde e demais orientações fornecidas pelo profissional, sob pena
              de ser declarado interrompido o tratamento.
            </Text>

            <Text style={styles.clausule}>
              13. É de meu conhecimento de que devo informar ao profissional
              qualquer alteração em decorrência do tratamento realizado,
              insatisfações ou dúvidas sobre o tratamento em execução; mantendo
              meus dados cadastrais sempre atualizados e informando eventuais
              mudanças de endereço, telefone, etc;
            </Text>

            <Text style={styles.clausule}>
              14. O cirurgião-dentista parceiro da CEMIC declarou que a técnica
              proposta e demais materiais que serão utilizados no meu tratamento
              possuem efetiva comprovação científica, respeitando o mai alto
              nível profissional, o estado atual da ciência e sua dignidade
              profissional, sendo uma das alternativas de tratamento indicadas
              para o meu caso;
            </Text>

            <Text style={styles.clausule}>
              15. Estou ciente de que a Odontologia não é uma ciência exata e
              que os resultados esperados, a partir do diagnóstico, poderão não
              se concretizar em face da resposta biológica do meu organismo ao
              tratamento e de minha colaboração, assim como da própria limitação
              da ciência, sendo certo que o profissional parceiro se compromete
              a utilizar as técnicas e os materiais adequados à execução do
              plano de tratamento proposto e aprovado, assumindo
              responsabilidade pelos serviços prestados, resguardando a minha
              privacidade e o necessário sigilo profissional, além de zelar por
              minha saúde e dignidade.
            </Text>

            <Text style={styles.clausule}>
              16. Declaro estar ciente do plano de tratamento odontológico em
              anexo, também de possíveis alterações que porventura venham a
              ocorrer e concordo com a possibilidade, se necessária, da
              realização de extrações parciais ou totais de dentes.
            </Text>

            <Text style={styles.clausule}>
              17. Entendo a importância da saúde bucal e me comprometo a seguir
              as orientações da equipe odontológica, assim como a retornar às
              consultas de orientações programadas.
            </Text>

            <Text style={styles.clausule}>
              18. Entendo, ainda, que cada ser humano possui particularidades
              quanto ao seu organismo e respostas biológicas diversas, sendo que
              o procedimento odontológico, ainda que realizado por profissional
              habilitado, ou seja, cirurgião-dentista, e, ainda que realizado de
              acordo com técnica reconhecida cientificamente e indicada ao meu
              caso, com material de qualidade, respeitando passo a passo do que
              determina a literatura ou a Ciência odontológica, pode acontecer
              de que a resposta e o resultado esperado não sejam parcial ou
              totalmente alcançados, uma vez que a Odontologia não é uma ciência
              exata e, por isso, o resultado não é certo e não pode ser
              garantido;
            </Text>

            <Text style={{ ...styles.clausule, marginTop: 40 }} break>
              19. Fui esclarecido (a) que, caso o tratamento proposto, durante a
              sua execução ou ao final, não alcance a perspectiva almejada, com
              cura da doença ou reabilitação necessária, o profissional
              apresentará esclarecimentos, a todo instante, sobre as limitações
              enfrentadas propondo alternativas, quando houver.
            </Text>

            <Text style={styles.clausule}>
              20. Informo que fui esclarecido(a) e estou ciente a respeito dos
              cuidados pós-tratamento reabilitador protético que devo manter com
              o intuito de preservar a durabilidade do serviço odontológico
              realizado, efetivado com o material acordado, de acordo com o
              tamanho e cor dos elementos dentários previamente aprovados.
            </Text>

            <Text style={styles.clausule}>
              21. Recebi esclarecimentos quanto à durabilidade do trabalho
              protético, que não depende única e exclusivamente do material
              utilizado ou da técnica aplicada, uma vez que a Odontologia é uma
              ciência de meios e não de resultados. Estou ciente da importância
              da manutenção diária de higienização oral, como orientado pelo
              profissional, bem como que o hábito de fumar pode causar prejuízos
              à peça protética e a toda cavidade bucal, como problemas
              periodontais que vão influenciar na estrutura óssea e gengival e
              consequente estabilidade da prótese.
            </Text>

            <Text style={styles.clausule}>
              22. Estou ciente de que todo ser humano pode sofrer alterações
              hormonais, alterações psicológicas e neurológicas, assim como
              alterações externas, como traumas e outros, que venham a
              influenciar diretamente nas condições de saúde geral e bucal, no
              equilíbrio necessário das articulações têmporomandibulares, o que
              pode ocasionar, por diversos fatores, o desenvolvimento de
              bruxismo e apertamento dos elementos dentários, com consequente
              desgaste dos elementos dentários naturais e dos protéticos, assim
              como perda óssea ou radicular, mobilidade dentária ou de eventuais
              implantes, fratura de coroas dentárias ou das peças protéticas,
              fratura de raízes e até a perda de implantes instalados, próteses
              ou dos elementos dentários naturais.
            </Text>

            <Text style={styles.clausule}>
              23. O trabalho protético que será instalado tem como princípio
              observar e restabelecer o equilíbrio de oclusão, a fim de garantir
              a função de reabilitação bucal, equilíbrio mastigatório, evitar
              disfunções nas articulações ou outras, visando a perspectiva de
              benefício estético-funcional.
            </Text>

            <Text style={styles.clausule}>
              24. Havendo qualquer alteração que seja de meu conhecimento quanto
              à minha saúde bucal ou geral, bem como o surgimento de dores nos
              elementos dentários ou outras dores orofaciais, é de minha
              responsabilidade manter contato com o dentista parceiro que
              realizou o meu tratamento, viabilizando a necessária avaliação do
              meio bucal e dos fatores que podem ter influenciado ou que tenham
              sido os causadores de eventuais danos ou alterações que,
              eventualmente, podem dar origem a prejuízos diversos e até a perda
              de elementos dentários naturais, de implantes e do trabalho
              protético instalado.
            </Text>

            <Text style={styles.clausule}>
              25. Estou ciente de que, assim como o trabalho protético, os
              elementos dentários naturais podem sofrer alterações, danos e
              prejuízos por questões naturais, por deficiência na higienização,
              doenças periodontais ou outras alterações bucais advindas de
              fatores biológicos ou externos, que não terão como fato causador o
              tratamento realizado.
            </Text>

            <Text style={styles.clausule}>
              26. Estou ciente de que os implantes serão instalados de maneira
              precisa, observando o que determina a técnica empregada e indicada
              ao caso, com a devida osseointegração. Ainda, é de meu
              conhecimento que não há garantia de que os implantes permanecerão
              imutáveis quanto a sua osseointegração, em razão do que foi acima
              mencionado, situação que pode ser agravada pelo hábito de fumar e
              pela deficiência na higienização, ausência às consultas de
              manutenção preventiva dos implantes que serão marcadas a cada 6
              meses, ausência de utilização dos materiais e equipamentos
              indicados pelos dentistas para limpeza e seu uso incorreto, e
              dentre outros fatores biológicos.
            </Text>

            <Text style={styles.clausule}>
              27. O trabalho protético sobre os implantes será instalado de
              forma adequada e adaptada, conforme prevê a técnica, a fim de
              resguardar as questões funcionais da reabilitação oral.
            </Text>

            <Text style={styles.clausule}>
              28. Declaro, ainda, que tenho conhecimento de que ao término do
              tratamento deverei retornar para consultas de acompanhamento de
              acordo com os critérios estabelecidos pelo profissional, visando
              resguardar e manter o tratamento realizado, sendo certo que não é
              possível garantir o tempo de durabilidade dos procedimentos
              odontológicos, pois a referida avaliação deverá observar as
              condições de minha saúde e eventuais alterações bucais, hábitos em
              geral, adequada higienização oral, além de outros fatores internos
              ou externos que podem danificar o serviço prestado. O profissional
              não se eximirá de avaliar eventual dano ou prejuízo sofrido e
              alegado, reparando-o, quando o caso, dentro do limite de sua
              responsabilidade.
            </Text>

            <Text style={{ ...styles.clausule, marginTop: 40 }} break>
              29. Estou ciente que o dentista responsável pelo meu tratamento é
              um profissional parceiro da CEMIC.
            </Text>

            <Text style={styles.clausule}>
              30. Estou ciente que a CEMIC não responderá pela qualidade dos
              serviços prestados pelo dentista parceiro, não cabendo qualquer
              responsabilidade. Nesse sentido, caso exista algum problema ético
              ou de qualquer ordem no atendimento profissional do dentista,
              ficando a CEMIC isento(a) de qualquer responsabilidade civil,
              inclusive quanto à eventuais prejuízos à saúde bucal, bem como por
              qualquer despesa oriunda de eventual agravamento do serviço
              prestado pelos profissionais parceiros da CEMIC.
            </Text>

            <Text style={styles.clausule}>
              31. Estou ciente que, fica estipulado o prazo de 90 (noventa)
              dias, a partir da finalização do tratamento, para comunicação de
              eventual alteração do trabalho realizado e entregue em perfeitas
              condições, de forma que após esse prazo qualquer medida dependerá
              da avaliação clínica profissional do dentista parceiro da CEMIC.
            </Text>

            <Text style={styles.clausule}>
              32. Abaixo, declaro se permito a utilização do meu prontuário para
              uso em publicações científicas ou com finalidade acadêmica,
              autorizando a exibição de imagens e exames com finalidade
              didático-acadêmicas, conforme previsto no Código de Ética
              Odontológica.
            </Text>

            <Text style={styles.clausule}>
              33. Autorizo, gratuita e espontaneamente, a utilização pela CEMIC
              de minhas imagens intraorais e extra-orais, para as finalidades
              descritas a seguir: Publicação em revistas científicas. Exposição
              em congressos científicos. Utilização para fins publicitários,
              veiculados pela televisão, rádio e redes sociais para fins de
              incentivar e motivar outras pessoas a buscarem os mesmos
              resultados. 35. A utilização deste material não gera nenhum
              compromisso de ressarcimento, a qualquer preceito, por parte da
              CEMIC.
            </Text>

            <Text style={styles.clausule}>( ) Sim ( ) Não</Text>

            <Text style={{ ...styles.clausule, textAlign: "center" }}>
              {adminParsed.filial}-{adminParsed.location} ,{" "}
              {parseDateBr(new Date().toLocaleDateString())}
            </Text>
            <Text style={{ ...styles.clausule, textAlign: "center" }}>
              ____________________________________________________
            </Text>
            <Text style={{ ...styles.clausule, textAlign: "center" }}>
              Assinatura do paciente ou seu responsável legal
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

export default ContractPDF;
