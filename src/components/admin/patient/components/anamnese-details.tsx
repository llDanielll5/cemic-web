//@ts-nocheck
import React, { useState, useEffect } from "react";
import EditIcon from "@mui/icons-material/Edit";
import Modal from "@/components/modal";
import UserData from "@/atoms/userData";
import Loading from "@/components/loading";
import { useRecoilState, useRecoilValue } from "recoil";
import { Box, Button, Card, Typography, styled } from "@mui/material";
import {
  handleGetSinglePatient,
  handleUpdatePatient,
} from "@/axios/admin/patients";
import { AnamneseQuestions, AnswerType } from "types/patient";
import { anamneseQuestions, anamsVal } from "data";
import PatientData from "@/atoms/patient";
import AnamneseForm from "./anamnese-form";

const PatientAnamneseDetails = () => {
  const [patientData, setPatientData] = useRecoilState(PatientData);
  const [anamneseModal, setAnamneseModal] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  let client = patientData?.attributes;
  const [observations, setObservations] = useState(client?.observations ?? "");
  const [isLoading, setIsLoading] = useState(false);
  const [anamneseData, setAnamneseData] =
    useState<AnamneseQuestions>(anamneseQuestions);
  const adminData = useRecoilValue(UserData);
  const anamneseKeys: string[] = Object.keys(anamneseData);

  const closeModal = () => setAnamneseModal(false);
  const handleAnswer = (value: AnswerType, question: string) => {
    return setAnamneseData((prev) => ({ ...prev, [question]: value }));
  };
  const handleSubmit = async () => {
    const patientId = patientData?.id!;

    const anamneseValues = {
      data: {
        anamnese: anamneseData,
        observations,
        adminInfos: { updated: adminData?.id, updateTimestamp: new Date() },
      },
    };

    return await handleUpdatePatient(patientId, anamneseValues).then(
      async (res) => {
        const cardId = res.data.data.attributes.cardId;
        await handleGetSinglePatient(cardId).then((result) => {
          const updt = result.data.data[0];
          setPatientData(updt);
          closeModal();
        });
      },
      (err) => console.log(err.response)
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
      [anamsVal[12]]: client?.anamnese[`${anamsVal[12]}`],
      [anamsVal[13]]: client?.anamnese[`${anamsVal[13]}`],
      [anamsVal[14]]: client?.anamnese[`${anamsVal[14]}`],
      [anamsVal[15]]: client?.anamnese[`${anamsVal[15]}`],
    }));
    setObservations(client?.observations!);
  }, [client?.anamnese, client?.observations, patientData]);

  if (isLoading)
    return (
      <Box position="fixed" top={0} left={0} zIndex={9999}>
        <Loading message={loadingMessage} />
      </Box>
    );

  if (!client) return <></>;
  else
    return (
      <Container elevation={9}>
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
            {item} <span>{client?.anamnese![item]}</span>
          </AnamneseKey>
        ))}
        <AnamneseKey variant="subtitle1">
          Observações: <span>{client?.observations}</span>
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

const Container = styled(Card)`
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: space-between;
  padding: 1rem;
  border-radius: 1rem;
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

export default PatientAnamneseDetails;
