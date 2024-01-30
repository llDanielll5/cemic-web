import React, { useEffect, useState } from "react";
import Radio from "@mui/material/Radio";
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  RadioGroup,
  TextField,
  Typography,
  styled,
} from "@mui/material";

interface AnamneseFormProps {
  handleAnswer: any;
  handleNextPage: any;
  anamneseData: any;
  observations: any;
  setObservations: any;
  handleBackPage: any;
  userData?: any;
  setUserData?: any;
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

  const questions = Object.keys(anamneseData);

  const renderRadioGroup = (props: {
    name: string;
    value: string;
    answer: string;
  }) => {
    return (
      <RadioGroup name={props.name}>
        <Box display="flex">
          {anamneseOptions.map((item, index) => (
            <FormControlLabel
              key={index}
              value={item}
              checked={item === props.value}
              control={<Radio />}
              name={props.name}
              label={item}
              onChange={(e: any) => handleAnswer(e.target.value, props.answer)}
            />
          ))}
        </Box>
      </RadioGroup>
    );
  };

  return (
    <>
      <Typography variant="h5" p={2} sx={{ color: "var(--dark-blue)" }}>
        Anamnese
      </Typography>
      {questions.map((v, i) => (
        <RadioContainer key={i} sx={{ my: 1 }}>
          <Typography variant="subtitle1">{v}</Typography>
          {renderRadioGroup({
            name: "question1",
            answer: v,
            value: anamneseData[v],
          })}
        </RadioContainer>
      ))}

      <TextField
        label="Observações:"
        value={observations!}
        sx={{ width: "100%" }}
        onChange={(e) => setObservations(e.target.value)}
        margin="dense"
      />
      {!!userData && (
        <TextField
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
      )}
      <div style={{ marginBottom: "12px" }} />

      <Box display="flex" justifyContent="space-between" columnGap={2}>
        <Button variant="contained" onClick={handleBackPage}>
          Voltar
        </Button>
        <Button variant="contained" onClick={handleNextPage}>
          Finalizar
        </Button>
      </Box>
    </>
  );
};

const RadioContainer = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid #f4f4f4;
  padding: 4px 8px;
  border-radius: 8px;
`;

export default AnamneseForm;
