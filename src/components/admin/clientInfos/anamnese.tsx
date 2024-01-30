import React, { useState, useEffect } from "react";
import AnamneseForm from "@/components/anamneseForm";
import EditIcon from "@mui/icons-material/Edit";
import Modal from "@/components/modal";
import UserData from "@/atoms/userData";
import Loading from "@/components/loading";
import { useRecoilValue } from "recoil";
import { Box, Button, Typography, styled } from "@mui/material";

import {
  handleGetSinglePatient,
  handleUpdatePatient,
} from "@/axios/admin/patients";
import { AnamneseQuestions, AnswerType } from "types/patient";
import { anamneseQuestions, anamsVal } from "data";

interface ClientAnamneseProps {
  client: any;
  onUpdate: any;
  anamneseKeys?: any;
  anamneseValues: any;
}

const ClientAnamneseInfos = (props: ClientAnamneseProps) => {
  const { client, anamneseKeys, anamneseValues, onUpdate } = props;
  const [anamneseModal, setAnamneseModal] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [observations, setObservations] = useState(client?.observations ?? "");
  const [isLoading, setIsLoading] = useState(false);
  const [anamneseData, setAnamneseData] =
    useState<AnamneseQuestions>(anamneseQuestions);
  const adminData: any = useRecoilValue(UserData);

  let anamneseNull = anamneseValues.filter((v: any) => v == "");
  const closeModal = () => {
    onUpdate();
    setAnamneseModal(false);
  };

  const handleAnswer = (value: AnswerType, question: string) => {
    return setAnamneseData((prev) => ({ ...prev, [question]: value }));
  };
  const handleSubmit = async () => {
    setIsLoading(true);
    setLoadingMessage("Atualizando Anamnese do Cliente!");
    const patientId = client!.id;

    const anamneseValues = {
      data: {
        anamnese: anamneseData,
        observations,
        adminInfos: { updated: adminData?.id, updateTimestamp: new Date() },
      },
    };

    return await handleUpdatePatient(patientId, anamneseValues).then(
      (res) => {
        setIsLoading(false);
        closeModal();
      },
      (err) => {
        setIsLoading(false);
        console.log(err.response);
      }
    );
  };

  useEffect(() => {
    setAnamneseData((prev) => ({
      ...prev,
      [anamsVal[0]]: client?.attributes?.anamnese[`${anamsVal[0]}`],
      [anamsVal[1]]: client?.attributes?.anamnese[`${anamsVal[1]}`],
      [anamsVal[2]]: client?.attributes?.anamnese[`${anamsVal[2]}`],
      [anamsVal[3]]: client?.attributes?.anamnese[`${anamsVal[3]}`],
      [anamsVal[4]]: client?.attributes?.anamnese[`${anamsVal[4]}`],
      [anamsVal[5]]: client?.attributes?.anamnese[`${anamsVal[5]}`],
      [anamsVal[6]]: client?.attributes?.anamnese[`${anamsVal[6]}`],
      [anamsVal[7]]: client?.attributes?.anamnese[`${anamsVal[7]}`],
      [anamsVal[8]]: client?.attributes?.anamnese[`${anamsVal[8]}`],
      [anamsVal[9]]: client?.attributes?.anamnese[`${anamsVal[9]}`],
      [anamsVal[10]]: client?.attributes?.anamnese[`${anamsVal[10]}`],
      [anamsVal[11]]: client?.attributes?.anamnese[`${anamsVal[11]}`],
    }));
    setObservations(client?.attributes?.observations);
  }, [client]);

  if (isLoading)
    return (
      <Box position="fixed" top={0} left={0} zIndex={9999}>
        <Loading message={loadingMessage} />
      </Box>
    );

  return (
    <Container>
      <Modal
        visible={anamneseModal}
        closeModal={closeModal}
        styles={{ height: "95vh", overflow: "auto", width: "90vw" }}
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
        <AnamneseKey variant="subtitle1" key={index}>
          {item} <span>{anamneseValues![index]}</span>
        </AnamneseKey>
      ))}
      <AnamneseKey variant="subtitle1">
        Observações: <span>{client?.attributes?.observations}</span>
      </AnamneseKey>

      <Button
        variant="contained"
        sx={{ mt: 2 }}
        endIcon={<EditIcon sx={{ color: "white" }} />}
        onClick={() => setAnamneseModal(true)}
      >
        Editar Anamnese
      </Button>
    </Container>
  );
};

const Container = styled(Box)`
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: space-between;
  background-color: #f1f1f1;
  padding: 1rem;
  border-radius: 1rem;
  -webkit-box-shadow: 4px 5px 13px -7px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 4px 5px 13px -7px rgba(0, 0, 0, 0.75);
  box-shadow: 4px 5px 13px -7px rgba(0, 0, 0, 0.75);
`;

const AnamneseKey = styled(Typography)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin: 0.3rem 0.2rem;
  padding: 0.5rem 0.8rem;
  border-radius: 0.4rem;
  background-color: white;
  border: 0.3px solid #d3d3d3;
`;

export default ClientAnamneseInfos;
