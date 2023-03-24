import React from "react";
import styles from "../../../styles/Selected.module.css";

interface CrownTermProps {
  userData: any;
  handleBackPage: any;
  handleNextPage: any;
  crownTermRead: any;
  setCrownTermRead: any;
}

const CrownTerm = (props: CrownTermProps) => {
  const {
    userData,
    handleBackPage,
    handleNextPage,
    crownTermRead,
    setCrownTermRead,
  } = props;
  return (
    <div className={styles["term-content"]}>
      <h2>TERMO DE CONSENTIMENTO PARA COROAS DEFINITIVAS</h2>

      <br />
      <p>
        estou ciente que só paguei pela fase cirúrgica dos implantes, e me
        comprometo em retornar no período de 6 MESES ou indicado pelo
        implantodontista, após a colocação dos implantes, para fazer as coroas
        definitivas de metalocerâmica (em caso de dente individual) ou o
        protocolo de resina (total). Onde pagarei por elas no dia do meu
        retorno. Estou ciente dos valores e que pode haver acréscimo dos
        componentes protéticos, também estou ciente de que se eu não retornar
        nesse período indicado pelo profissional, corro o risco de perda dos
        implantes, sendo assim, assumo a responsabilidade de comparecer na CEMIC
        – Centro Médico e de Implantes Comunitários – no prazo citado. O meu não
        comparecimento retira toda responsabilidade da CEMIC e do profissional
        que realizou a minha cirurgia.
      </p>

      <div className={styles["checkbox-container"]}>
        <input
          type="checkbox"
          value={crownTermRead}
          onChange={(e) => setCrownTermRead(e.target.checked)}
        />
        {"  "}
        Eu li, compreendi e aceito o termo acima descrito
      </div>

      <div className={styles["buttons-finish"]}>
        <button onClick={handleBackPage} className={styles["button-back"]}>
          Voltar
        </button>
        <button onClick={handleNextPage} className={styles["button-next"]}>
          Finalizar
        </button>
      </div>
    </div>
  );
};

export default CrownTerm;
