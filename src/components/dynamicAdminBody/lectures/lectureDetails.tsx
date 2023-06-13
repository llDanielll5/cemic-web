import React from "react";
import { Box, Typography, styled } from "@mui/material";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/services/firebase";
import { cpfMask, phoneMask } from "@/services/services";
import { closeIcon, successIcon } from "../screening/screeningDetails";

interface LectureDetailsProps {
  clientInfos: any;
  lectureInfos: any;
  closeModal: () => void;
}

const LectureDetails = (props: LectureDetailsProps) => {
  const { clientInfos, lectureInfos, closeModal } = props;
  const momentNow = new Date();
  const [y, m, d] = lectureInfos.day.split("-");
  const hourSchedule = lectureInfos.hour.split(":")[0];
  const scheduledDay = new Date(
    parseInt(y),
    parseInt(m) - 1,
    parseInt(d),
    parseInt(hourSchedule)
  );
  const passedHour = momentNow > scheduledDay;

  const updateLecture = async (isMissed: boolean) => {
    const ref = doc(db, "lectures", lectureInfos.id);
    const data: any = { isMissed };
    await updateDoc(ref, data)
      .then(() => closeModal())
      .catch(() => alert("Erro ao atualizar palestra do cliente"));
  };

  const updateLectureExam = async (examRequest: boolean) => {
    const ref = doc(db, "lectures", lectureInfos.id);
    const data: any = { examRequest };
    await updateDoc(ref, data)
      .then(() => closeModal())
      .catch(() => alert("Erro ao atualizar palestra do cliente"));
  };
  return (
    <Box
      display="flex"
      alignItems="center"
      width="100%"
      justifyContent="center"
      flexDirection="column"
    >
      <HeaderTitle variant="semibold" textAlign="center" mb={1}>
        {clientInfos.name}
      </HeaderTitle>

      <Box width="100%" display="flex" flexDirection="column">
        <FlexRowCenter>
          <Typography variant="semibold">ID Cliente: </Typography>
          <Typography variant="body1">{clientInfos.id}</Typography>
        </FlexRowCenter>
        <FlexRowCenter>
          <Typography variant="semibold">CPF: </Typography>
          <Typography variant="body1">{cpfMask(clientInfos.cpf)}</Typography>
        </FlexRowCenter>
        <FlexRowCenter>
          <Typography variant="semibold">Telefone: </Typography>
          <Typography variant="body1">
            {phoneMask(clientInfos.phone)}
          </Typography>
        </FlexRowCenter>

        {passedHour && lectureInfos?.isMissed === null ? (
          <Box m={"8px 0"} display="flex" alignItems="center">
            <HeaderTitle variant="bold">Paciente compareceu?</HeaderTitle>
            {successIcon({ onClick: () => updateLecture(false) })}
            {closeIcon({ onClick: () => updateLecture(true) })}
          </Box>
        ) : passedHour && lectureInfos?.isMissed ? (
          <Typography variant="bold" my={1}>
            Paciente Faltou
          </Typography>
        ) : passedHour && !lectureInfos?.isMissed ? (
          <Typography variant="bold" my={1}>
            Paciente Compareceu
          </Typography>
        ) : null}

        {passedHour && lectureInfos?.examRequest === null ? (
          <Box m={"8px 0"} display="flex" alignItems="center">
            <HeaderTitle variant="bold">
              Paciente pegou pedido de exame?
            </HeaderTitle>
            {successIcon({ onClick: () => updateLectureExam(true) })}
            {closeIcon({ onClick: () => updateLectureExam(false) })}
          </Box>
        ) : passedHour && lectureInfos?.examRequest ? (
          <Typography variant="bold" my={1}>
            Paciente Pegou pedido
          </Typography>
        ) : passedHour && !lectureInfos?.examRequest ? (
          <Typography variant="bold" my={1}>
            Paciente Não pegou pedido
          </Typography>
        ) : null}
      </Box>
    </Box>
  );
};

export const FlexRowCenter = styled(Box)`
  display: flex;
  flex-direction: row;
  align-items: center;
  column-gap: 8px;
`;

export const HeaderTitle = styled(Typography)`
  font-size: 18px;
  @media screen and (max-width: 760px) {
    font-size: 16px;
  }
  @media screen and (max-width: 500px) {
    font-size: 14px;
  }
`;

export default LectureDetails;
