import React, { useState, useEffect } from "react";
import styles from "../../../styles/ClientDetails.module.css";
import AnamneseForm from "@/components/anamneseForm";
import EditIcon from "@mui/icons-material/Edit";
import Modal from "@/components/modal";
import UserData from "@/atoms/userData";
import Loading from "@/components/loading";
import { StyledButton } from "@/components/dynamicAdminBody/receipts";
import { useOnSnapshotQuery } from "@/hooks/useOnSnapshotQuery";
import { db } from "@/services/firebase";
import { useRecoilValue } from "recoil";
import { Box } from "@mui/material";
import {
  AnamneseQuestions,
  AnswerType,
  anamneseQuestions,
} from "@/components/dynamicAdminBody/clients/newPatient";
import {
  Timestamp,
  collection,
  doc,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

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
  "Tem ansiedade?",
  "Faz uso AAS",
];

const ClientAnamneseInfos = (props: ClientAnamneseProps) => {
  const { client, anamneseKeys, anamneseValues } = props;
  const [anamneseModal, setAnamneseModal] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [observations, setObservations] = useState(client?.observations ?? "");
  const [isLoading, setIsLoading] = useState(false);
  const [anamneseData, setAnamneseData] =
    useState<AnamneseQuestions>(anamneseQuestions);
  const adminData: any = useRecoilValue(UserData);
  const refClient = collection(db, "clients");
  const queryClient = query(refClient, where("id", "==", client?.id ?? ""));
  let snapClient = useOnSnapshotQuery("clients", queryClient, [client]);

  let anamneseNull = anamneseValues.filter((v: any) => v == "");
  const closeModal = () => setAnamneseModal(false);

  const handleAnswer = (value: AnswerType, question: string) => {
    return setAnamneseData((prev) => ({ ...prev, [question]: value }));
  };
  const handleSubmit = async () => {
    setIsLoading(true);
    setLoadingMessage("Atualizando Anamnese do Cliente!");
    const ref = doc(db, "clients", client!.id);
    let anamneseForUpdate: { [s: string]: any } = {};
    for (let i = 0; i < 12; i++) {
      anamneseForUpdate[`anamnese.${anamsVal[i]}`] =
        anamneseData?.[anamsVal[i]];
    }

    const anamneseValues = {
      ...anamneseForUpdate,
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
      [anamsVal[0]]: client?.anamnese[`${anamsVal[0]}`],
      [anamsVal[1]]: client?.anamnese[`${anamsVal[1]}`],
      [anamsVal[2]]: client?.anamnese[`${anamsVal[2]}`],
      [anamsVal[3]]: client?.anamnese[`${anamsVal[3]}`],
      [anamsVal[4]]: client?.anamnese[`${anamsVal[4]}`],
      [anamsVal[5]]: client?.anamnese[`${anamsVal[5]}`],
      [anamsVal[6]]: client?.anamnese[`${anamsVal[6]}`],
      [anamsVal[7]]: client?.anamnese[`${anamsVal[7]}`],
      [anamsVal[8]]: client?.anamnese[`${anamsVal[8]}`],
      [anamsVal[9]]: client?.anamnese[`${anamsVal[9]}`],
      [anamsVal[10]]: client?.anamnese[`${anamsVal[10]}`],
      [anamsVal[11]]: client?.anamnese[`${anamsVal[11]}`],
    }));
    setObservations(client?.observations);
  }, [client]);

  if (isLoading)
    return (
      <Box position="fixed" top={0} left={0} zIndex={9999}>
        <Loading message={loadingMessage} />
      </Box>
    );

  return (
    <div className={styles["client-infos"]}>
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
        Observações: <span>{snapClient?.[0]?.observations}</span>
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
