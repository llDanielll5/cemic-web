import React, { useState, useEffect } from "react";
import styles from "../../../styles/ClientDetails.module.css";
import AnamneseForm from "@/components/anamneseForm";
import Loading from "@/components/loading";
import Modal from "@/components/modal";
import EditIcon from "@mui/icons-material/Edit";
import UserData from "@/atoms/userData";
import { Timestamp, doc, updateDoc } from "firebase/firestore";
import { StyledButton } from "@/components/dynamicAdminBody/receipts";
import { db } from "@/services/firebase";
import { useRecoilValue } from "recoil";
import { Box } from "@mui/material";
import {
  AnamneseQuestions,
  AnswerType,
  anamneseQuestions,
} from "@/components/dynamicAdminBody/clients/newPatient";

interface ClientAnamneseProps {
  client: any;
  anamneseKeys?: any;
  anamneseValues: any;
}

const anamsVal = [
  "Está tomando alguma medicação no momento?",
  "Sofre ou sofreu de algum problema no coração?",
  "É diabético?",
  "Possui dificuldade de cicatrização?",
  "Tem ou teve alguma doença nos rins ou fígado?",
  "Sofre de epilepsia?",
  "Já esteve hospitalizado por algum motivo?",
  "Tem anemia?",
  "É alérgico a algum medicamento?",
  "Já teve algum problema com anestésicos?",
];

const ClientAnamneseInfos = (props: ClientAnamneseProps) => {
  const { client, anamneseKeys, anamneseValues } = props;
  const [anamneseModal, setAnamneseModal] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [observations, setObservations] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [anamneseData, setAnamneseData] =
    useState<AnamneseQuestions>(anamneseQuestions);
  const adminData: any = useRecoilValue(UserData);

  let anamneseNull = anamneseValues.filter((v: any) => v == "");
  const closeModal = () => {
    setAnamneseData(anamneseQuestions);
    setAnamneseModal(false);
  };
  const handleAnswer = (value: AnswerType, question: string) => {
    return setAnamneseData((prev) => ({ ...prev, [question]: value }));
  };
  const handleSubmit = async () => {
    setIsLoading(true);
    setLoadingMessage("Atualizando Anamnese do Cliente!");
    const ref = doc(db, "clients", client!.id);

    const anamneseValues = {
      [`anamnese.${anamsVal[0]}`]: anamneseData[`${anamsVal[0]}`],
      [`anamnese.${anamsVal[1]}`]: anamneseData[`${anamsVal[1]}`],
      [`anamnese.${anamsVal[2]}`]: anamneseData[`${anamsVal[2]}`],
      [`anamnese.${anamsVal[3]}`]: anamneseData[`${anamsVal[3]}`],
      [`anamnese.${anamsVal[4]}`]: anamneseData[`${anamsVal[4]}`],
      [`anamnese.${anamsVal[5]}`]: anamneseData[`${anamsVal[5]}`],
      [`anamnese.${anamsVal[6]}`]: anamneseData[`${anamsVal[6]}`],
      [`anamnese.${anamsVal[7]}`]: anamneseData[`${anamsVal[7]}`],
      [`anamnese.${anamsVal[8]}`]: anamneseData[`${anamsVal[8]}`],
      [`anamnese.${anamsVal[9]}`]: anamneseData[`${anamsVal[9]}`],
      observations,
      "updatedBy.reporterId": adminData?.id,
      "updatedBy.reporterName": adminData?.name,
      "updatedBy.timestamp": Timestamp.now(),
      "updatedBy.role": adminData?.role,
    };

    return await updateDoc(ref, anamneseValues).then(
      (queryDoc) => {
        setIsLoading(false);
        closeModal();
      },
      (err) => {
        setIsLoading(false);
      }
    );
  };

  useEffect(() => {
    setAnamneseData((prev) => ({
      ...prev,
      [`anamnese.${anamsVal[0]}`]: client?.anamnese[`${anamsVal[0]}`],
      [`anamnese.${anamsVal[1]}`]: client?.anamnese[`${anamsVal[1]}`],
      [`anamnese.${anamsVal[2]}`]: client?.anamnese[`${anamsVal[2]}`],
      [`anamnese.${anamsVal[3]}`]: client?.anamnese[`${anamsVal[3]}`],
      [`anamnese.${anamsVal[4]}`]: client?.anamnese[`${anamsVal[4]}`],
      [`anamnese.${anamsVal[5]}`]: client?.anamnese[`${anamsVal[5]}`],
      [`anamnese.${anamsVal[6]}`]: client?.anamnese[`${anamsVal[6]}`],
      [`anamnese.${anamsVal[7]}`]: client?.anamnese[`${anamsVal[7]}`],
      [`anamnese.${anamsVal[8]}`]: client?.anamnese[`${anamsVal[8]}`],
      [`anamnese.${anamsVal[9]}`]: client?.anamnese[`${anamsVal[9]}`],
    }));
    setObservations(client?.observations);
  }, [client]);

  return (
    <div className={styles["client-infos"]}>
      {isLoading && (
        <Box position="fixed" top={0} left={0}>
          <Loading message={loadingMessage} />
        </Box>
      )}
      <Modal
        visible={anamneseModal}
        closeModal={closeModal}
        style={{ content: { margin: "20px 0", width: "90%" } }}
      >
        <AnamneseForm
          anamneseData={anamneseData}
          handleAnswer={handleAnswer}
          handleBackPage={closeModal}
          handleNextPage={handleSubmit}
          observations={observations}
          setObservations={setObservations}
        />
      </Modal>

      {anamneseKeys?.map((item: any, index: number) => (
        <p className={styles["p-anamnese"]} key={index}>
          {item} <span>{anamneseValues![index]}</span>
        </p>
      ))}
      <p className={styles["p-anamnese"]}>
        Observações: <span>{client?.observations}</span>
      </p>

      <StyledButton
        endIcon={<EditIcon sx={{ color: "white" }} />}
        onClick={() => setAnamneseModal(true)}
      >
        Editar Anamnese
      </StyledButton>
    </div>
  );
};

export default ClientAnamneseInfos;
