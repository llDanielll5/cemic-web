import React from "react";
import { Card, Typography, styled } from "@mui/material";
import { AnamneseQuestions } from "types/patient";

const PatientAnamneseDentistDetails = ({
  patient,
}: {
  patient: PatientInterface;
}) => {
  const anamneseKeys: string[] = Object.keys(patient?.anamnese);

  return (
    <Container elevation={9} sx={{ my: 4 }}>
      {anamneseKeys?.map((item: string, index: number) => (
        <AnamneseKey variant="subtitle1" key={index}>
          {item}{" "}
          <span>{patient?.anamnese![item as keyof AnamneseQuestions]}</span>
        </AnamneseKey>
      ))}
      <AnamneseKey variant="subtitle1">
        Observações: <span>{patient?.observations}</span>
      </AnamneseKey>
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

export default PatientAnamneseDentistDetails;
