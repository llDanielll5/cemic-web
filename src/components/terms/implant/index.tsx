import React from "react";
import styles from "../../../styles/Selected.module.css";

interface ImplanteTermProps {
  userData: any;
  handleBackPage: any;
  handleNextPage: any;
  implantTermRead: any;
  setImplantTermRead: any;
}

const ImplanteTerm = (props: ImplanteTermProps) => {
  const {
    userData,
    handleBackPage,
    handleNextPage,
    implantTermRead,
    setImplantTermRead,
  } = props;
  return (
    <div className={styles["term-content"]}>
      <h2>TERMO DE CONSENTIMENTO PARA CIRURGIAS DE IMPLANTES</h2>

      <br />
      <p>
        Eu: {userData?.name ?? ""}, por meio desse termo, declaro que optei por
        submeter-me ao procedimento cirúrgico de colocação de implante ósseo
        integrado, para recuperação de dentes perdidos que fui orientado de
        outra alternativa de tratamento com suas vantagens e desvantagens. Fui
        informado ainda que tal procedimento apresenta taxa de sucesso de cerca
        de 92%, podendo esta ser reduzida frente a situação, tais como,
        pacientes com diabetes não controlada, hipertensos (pressão alta),
        cardiopatas (problema de coração), alérgicos, portadores de hábitos
        anormais, como bruxismo (ranger os dentes), e pacientes que fazem o uso
        de medicamentos controlados. Além disso, estou ciente que há redução
        dessa porcentagem em pacientes que apresentam estrutura óssea (tamanho
        do osso) reduzida tanto em largura tanto em comprimento ou osso
        extremamente compacto (osso tipo I) ou ainda, extremamente mole (osso
        tipo IV), assim como, em pacientes fumantes e ex-fumantes (nesse caso
        reduzindo-se a 77% de sucesso). Estou consciente também que implantes
        colocados na região posterior apresentam índice de perda maior em
        relação a região anterior, devido a maior carga (força) mastigatória,
        reduzindo-se este índice também, quanto a colocação dos implantes de
        pequenos comprimentos (7 e 8,5) frente a implantes maiores (=10 mm),
        assim como, há em menor grau de sucessos em implantes com coroas
        individualizadas em comparação com coroas unidas. Fui esclarecido que o
        risco de perda de implante é considerado até o segundo ano da sua
        colocação reduzindo-se drasticamente para os anos subsequentes, e que
        há, durante o primeiro ano, uma pequena perda óssea horizontal de 1 a 2
        mm, considerando normal e que se estabiliza nos anos subsequentes. Foram
        destacados também, algumas situações comuns relacionadas ao procedimento
        cirúrgico de colocação de implantes, tais como, desconforto
        pós-operatório, hematomas, edemas, formigamento e trauma no canto do
        lábio com consequente equimose (mancha escura) e restrição de abertura
        de boca. Ficou claro que essas situações podem necessitar de alguns dias
        para recuperação. Estou ciente da importância de minha efetiva
        participação no tratamento, seguindo as recomendações e medicações
        prescritas pelo cirurgião dentista enquanto estiver sob seus cuidados, e
        entendo que sem minha cooperação poderá haver diminuição da
        possibilidade de se obter melhores resultados, assim como, sei que
        deverei realizar controles periódicos similares aos dentes naturais com
        radiografias anuais e manter eficiente escovação sobre implante. Entendo
        que os implantes ósseos integrados oferecem resultados funcionais
        estéticos excelentes, porém ele é uma prótese e como tal, possui
        limitações. Tive a oportunidade de discutir minha história médica, não
        omitindo nenhuma informação que possa resultar em prejuízo ao meu
        tratamento. Por último, tive a oportunidade de ler e entender os termos
        e palavras contidas no texto acima e me foram dadas explicações
        pertinentes a ele.
      </p>

      <div className={styles["checkbox-container"]}>
        <input
          type="checkbox"
          value={implantTermRead}
          onChange={(e) => setImplantTermRead(e.target.checked)}
        />
        {"  "}
        Eu li, compreendi e aceito o termo acima descrito
      </div>

      <div className={styles["buttons-finish"]}>
        <button onClick={handleBackPage} className={styles["button-back"]}>
          Voltar
        </button>
        <button onClick={handleNextPage} className={styles["button-next"]}>
          Próximo
        </button>
      </div>
    </div>
  );
};

export default ImplanteTerm;
