import React, { useCallback, useEffect, useState } from "react";
import { Box, Paper, Typography, styled } from "@mui/material";
import { useRecoilValue } from "recoil";
import { parseDateIso, parseToothRegion } from "@/services/services";
import { ToothsInterface } from "types/odontogram";
import { handleGetTreatmentsOfPatient } from "@/axios/admin/treatments";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import UserData from "@/atoms/userData";
import PatientData from "@/atoms/patient";

const PatientTreatmentsHistory = (props: any) => {
  const patientData = useRecoilValue(PatientData);
  const adminData = useRecoilValue(UserData);
  const patient = patientData?.attributes;
  const actualProfessional =
    (patientData?.attributes as any)?.actualProfessional ?? "";
  const adminInfos = patient?.adminInfos;
  const [treatmentsFinished, setTreatmentsFinished] = useState<
    ToothsInterface[]
  >([]);
  const [patientTreatments, setPatientTreatments] = useState<ToothsInterface[]>(
    []
  );
  const hasTreatments = patientTreatments?.length > 0;
  const hasFinisheds = treatmentsFinished?.length > 0;

  const getPatientTreatments = useCallback(async () => {
    return await handleGetTreatmentsOfPatient(String(patientData?.id!)).then(
      (res) => {
        let data = res.data.data;
        const finisheds = data?.filter(
          (v: any) => v?.attributes?.finishedBy?.data !== null
        );
        setPatientTreatments(data);
        setTreatmentsFinished(finisheds);
        // return location.reload();
      },
      (err) => console.log(err.response)
    );
  }, [patientData?.id]);

  useEffect(() => {
    getPatientTreatments();
  }, [getPatientTreatments, props.updateTreatments]);

  return (
    <Container>
      {adminData?.userType === "SUPERADMIN" && (
        <Header>
          <Typography variant="subtitle2">
            <b>Dentista Atual:</b> {actualProfessional?.name ?? "Sem Dentista"}
          </Typography>
          <Typography variant="caption">
            Atualizado por: {adminInfos?.updated?.data?.attributes?.name} dia{" "}
            {parseDateIso(
              (adminInfos?.updateTimestamp as unknown as string)?.substring?.(
                0,
                10
              )
            )}
          </Typography>
        </Header>
      )}

      {hasTreatments && (
        <TreatmentsContainer elevation={9}>
          <Typography variant="subtitle1" fontWeight="bold">
            Plano de Tratamento do paciente:
          </Typography>
          {!hasTreatments ? (
            <Typography variant="subtitle1">Sem plano de Tratamento</Typography>
          ) : (
            patientTreatments?.map((v: any, i: number) => (
              <TreatmentPlan key={i}>
                <Typography
                  variant="subtitle1"
                  width="max-content"
                  sx={{ whiteSpace: "nowrap" }}
                >
                  {parseToothRegion(v?.attributes?.region)} -{" "}
                  {v?.attributes?.name}
                </Typography>

                <Line>
                  <IconForward />
                </Line>

                <Typography
                  variant="subtitle1"
                  width="min-content"
                  textAlign="right"
                  whiteSpace="nowrap"
                  color={v.attributes.payment.data === null ? "red" : "green"}
                >
                  {v.attributes.payment.data === null ? "Não pago" : "Pago"}
                </Typography>
              </TreatmentPlan>
            ))
          )}
        </TreatmentsContainer>
      )}

      {/* {hasFinisheds && (
        <FinishedsContainer elevation={9}>
          <Typography variant="subtitle1" fontWeight="bold">
            Tratamentos já realizados:
          </Typography>
          {treatmentsFinished?.map((v: any, i: number) => (
            <Box
              key={i}
              display={"flex"}
              alignItems={"center"}
              columnGap={"4px"}
              width={"100%"}
              my={"4px"}
            >
              <Typography variant="subtitle1">
                {parseToothRegion(v?.attributes?.region)} -{" "}
              </Typography>
              <Typography variant="subtitle1">
                {v?.attributes?.treatments?.name}
              </Typography>
            </Box>
          ))}
          {!hasFinisheds && (
            <Typography variant="subtitle1">
              Sem Tratamentos concluídos
            </Typography>
          )}
        </FinishedsContainer>
      )} */}

      {/* <Box display="flex" flexDirection="column" alignItems="center" mt={1}>
        <Typography variant="subtitle1">
          Verificar histórico de encaminhamentos
        </Typography>
        <Link
          passHref
          target="_blank"
          href={`/admin/treatment-history/${patientData!.id}`}
        >
          <Button fullWidth endIcon={<HistoryIcon />}>
            Histórico
          </Button>
        </Link>
      </Box> */}
    </Container>
  );
};

const Container = styled(Box)`
  width: 100%;
  min-width: 700px;
`;
const FinishedsContainer = styled(Paper)`
  padding: 1rem;
  margin: 1rem 0;
`;
const TreatmentsContainer = styled(Paper)`
  padding: 1rem;
  margin: 1rem 0;
`;

const TreatmentPlan = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0.5rem 0;
  width: 100%;
  column-gap: 0.5rem;
`;

const Header = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  column-gap: 1rem;
`;

const Line = styled(Box)`
  height: 1px;
  width: 100%;
  background-color: #d5d5d5;
  border-radius: 5rem;
  position: relative;
  margin: 0 1rem;
`;

const IconForward = styled(ArrowForwardIcon)`
  position: absolute;
  right: -10px;
  top: 50%;
  transform: translateY(-50%);
  margin-top: 1px;
`;

export default PatientTreatmentsHistory;
