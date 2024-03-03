/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Box, Typography, styled } from "@mui/material";
import { cpfMask, phoneMask } from "@/services/services";
import { closeIcon, successIcon } from "../screening/screeningDetails";
import { getLectureDetails, updateSingleLecture } from "@/axios/admin/lectures";
import { useRecoilValue } from "recoil";
import UserData from "@/atoms/userData";

interface LectureDetailsProps {
  lectureID: any;
  closeModal: () => void;
}

const LectureDetails = (props: LectureDetailsProps) => {
  const { lectureID, closeModal } = props;
  const [lectureData, setLectureData] = useState<any | null>(null);
  const dateString = lectureData?.attributes?.dateString;
  const userData: any = useRecoilValue(UserData);
  const zoneTime = "T03:00:00.001Z";
  const isoString = dateString + zoneTime;
  const currDate = new Date(isoString);
  const now = new Date();
  const passedHour = currDate < now;
  let patient = lectureData?.attributes?.patient?.data;
  let patientId = patient?.id;
  let patientAttr = patient?.attributes;
  let attr = lectureData?.attributes;

  const updateLecture = async (data: any) => {
    return await updateSingleLecture(lectureID, {
      ...data,
      admin: userData?.id,
    }).then(
      (res) => closeModal(),
      (error) => console.log(error.response)
    );
  };

  async function getLecture() {
    if (lectureID === null) return;
    return await getLectureDetails(lectureID).then(
      (res) => setLectureData(res.data.data),
      (error) => console.log(error.response)
    );
  }

  useEffect(() => {
    getLecture();
  }, []);

  return (
    <Box
      display="flex"
      alignItems="center"
      width="100%"
      justifyContent="center"
      flexDirection="column"
    >
      <HeaderTitle variant="subtitle1" textAlign="center" mb={1}>
        {patientAttr?.name}
      </HeaderTitle>

      <Box width="100%" display="flex" flexDirection="column">
        <FlexRowCenter>
          <Typography variant="subtitle1">CPF: </Typography>
          <Typography variant="body1">{cpfMask(patientAttr?.cpf)}</Typography>
        </FlexRowCenter>
        <FlexRowCenter>
          <Typography variant="subtitle1">Telefone: </Typography>
          <Typography variant="body1">
            {phoneMask(patientAttr?.phone)}
          </Typography>
        </FlexRowCenter>

        {passedHour && attr?.isMissed === null ? (
          <Box m={"8px 0"} display="flex" alignItems="center">
            <HeaderTitle variant="subtitle2">Paciente compareceu?</HeaderTitle>
            {successIcon({
              onClick: () =>
                updateLecture({
                  examRequest: attr?.examRequest,
                  isMissed: false,
                }),
            })}
            {closeIcon({
              onClick: () =>
                updateLecture({
                  examRequest: attr?.examRequest,
                  isMissed: true,
                }),
            })}
          </Box>
        ) : passedHour && attr?.isMissed ? (
          <Typography variant="subtitle2" my={1}>
            Paciente Faltou
          </Typography>
        ) : passedHour && !attr?.isMissed ? (
          <Typography variant="subtitle2" my={1}>
            Paciente Compareceu
          </Typography>
        ) : null}

        {passedHour && attr?.examRequest === null ? (
          <Box m={"8px 0"} display="flex" alignItems="center">
            <HeaderTitle variant="subtitle2">
              Paciente pegou pedido de exame?
            </HeaderTitle>
            {successIcon({
              onClick: () =>
                updateLecture({ examRequest: true, isMissed: attr?.isMissed }),
            })}
            {closeIcon({
              onClick: () =>
                updateLecture({ examRequest: false, isMissed: attr?.isMissed }),
            })}
          </Box>
        ) : passedHour && attr?.examRequest ? (
          <Typography variant="subtitle2" my={1}>
            Paciente Pegou pedido
          </Typography>
        ) : passedHour && !attr?.examRequest ? (
          <Typography variant="subtitle2" my={1}>
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
