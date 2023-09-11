import React from "react";
import { Radio, RadioGroup } from "react-radio-group";
import styles from "../../styles/Selected.module.css";
import Input from "../input";
import { StyledButton } from "../dynamicAdminBody/receipts";
import { StyledTextField } from "../patient/profile";

interface AnamneseFormProps {
  handleAnswer: any;
  handleNextPage: any;
  anamneseData: any;
  observations: any;
  setObservations: any;
  handleBackPage: any;
  userData: any;
  setUserData: any;
}

const anamneseOptions = ["SIM", "NÃO", "NÃO SEI"];

const AnamneseForm = (props: AnamneseFormProps) => {
  const {
    anamneseData,
    handleAnswer,
    handleNextPage,
    observations,
    setObservations,
    handleBackPage,
    userData,
    setUserData,
  } = props;
  const renderRadioGroup = (props: {
    name: string;
    value: string;
    answer: string;
  }) => (
    <RadioGroup
      name={props.name}
      className={styles["radio-group"]}
      selectedValue={props.value}
      onChange={(value) => handleAnswer(value, props.answer)}
    >
      {anamneseOptions.map((item, index) => (
        <div key={index} className={styles["radio-options"]}>
          <span>{item}</span>
          <Radio key={index} value={item} className={styles["radio-item"]} />
        </div>
      ))}
    </RadioGroup>
  );
  return (
    <>
      <h2>ANAMNESE</h2>
      <div className={styles["question-container"]}>
        <span>Está tomando alguma medicação no momento?</span>
        {renderRadioGroup({
          name: "question1",
          answer: "Está tomando alguma medicação no momento?",
          value: anamneseData["Está tomando alguma medicação no momento?"],
        })}
      </div>

      <div className={styles["question-container"]}>
        <span>Sofre ou sofreu de algum problema no coração?</span>
        {renderRadioGroup({
          name: "question2",
          answer: "Sofre ou sofreu de algum problema no coração?",
          value: anamneseData["Sofre ou sofreu de algum problema no coração?"],
        })}
      </div>
      <div className={styles["question-container"]}>
        <span>É diabético?</span>
        {renderRadioGroup({
          name: "question3",
          answer: "É diabético?",
          value: anamneseData["É diabético?"],
        })}
      </div>

      <div className={styles["question-container"]}>
        <span>Possui dificuldade de cicatrização?</span>
        {renderRadioGroup({
          name: "question4",
          answer: "Possui dificuldade de cicatrização?",
          value: anamneseData["Possui dificuldade de cicatrização?"],
        })}
      </div>
      <div className={styles["question-container"]}>
        <span>Tem ou teve alguma doença nos rins ou fígado?</span>
        {renderRadioGroup({
          name: "question5",
          answer: "Tem ou teve alguma doença nos rins ou fígado?",
          value: anamneseData["Tem ou teve alguma doença nos rins ou fígado?"],
        })}
      </div>

      <div className={styles["question-container"]}>
        <span>Sofre de epilepsia?</span>
        {renderRadioGroup({
          name: "question6",
          answer: "Sofre de epilepsia?",
          value: anamneseData["Sofre de epilepsia?"],
        })}
      </div>
      <div className={styles["question-container"]}>
        <span>Já esteve hospitalizado por algum motivo?</span>
        {renderRadioGroup({
          name: "question7",
          answer: "Já esteve hospitalizado por algum motivo?",
          value: anamneseData["Já esteve hospitalizado por algum motivo?"],
        })}
      </div>
      <div className={styles["question-container"]}>
        <span>Tem anemia?</span>
        {renderRadioGroup({
          name: "question8",
          answer: "Tem anemia?",
          value: anamneseData["Tem anemia?"],
        })}
      </div>
      <div className={styles["question-container"]}>
        <span>É alérgico a algum medicamento?</span>
        {renderRadioGroup({
          name: "question9",
          answer: "É alérgico a algum medicamento?",
          value: anamneseData["É alérgico a algum medicamento?"],
        })}
      </div>
      <div className={styles["question-container"]}>
        <span>Já teve algum problema com anestésicos?</span>
        {renderRadioGroup({
          name: "question10",
          answer: "Já teve algum problema com anestésicos?",
          value: anamneseData["Já teve algum problema com anestésicos?"],
        })}
      </div>

      <StyledTextField
        label="Observações:"
        value={observations!}
        onChange={(e) => setObservations(e.target.value)}
        margin="dense"
      />
      <StyledTextField
        type={"date"}
        margin="dense"
        sx={{ width: "30%", alignSelf: "center" }}
        label="Data de Triagem*:"
        value={userData?.screeningDate}
        InputLabelProps={{ shrink: true }}
        onChange={(e) =>
          setUserData((prev: any) => ({
            ...prev,
            screeningDate: e.target.value,
          }))
        }
      />
      <div style={{ marginBottom: "12px" }} />

      <div className={styles["buttons-finish"]}>
        <StyledButton onClick={handleBackPage}>Voltar</StyledButton>
        <StyledButton onClick={handleNextPage}>Finalizar</StyledButton>
      </div>
    </>
  );
};

export default AnamneseForm;
