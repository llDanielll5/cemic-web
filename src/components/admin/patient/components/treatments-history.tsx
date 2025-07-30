import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  Button,
  MenuItem,
  Paper,
  Select,
  Typography,
  styled,
} from "@mui/material";
import { useRecoilValue } from "recoil";
import { ToothsInterface } from "types/odontogram";
import { useLoading } from "@/contexts/LoadingContext";
import { parseDateIso, parseToothRegion } from "@/services/services";
import { handleGetTreatmentsOfPatient } from "@/axios/admin/treatments";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import UserData from "@/atoms/userData";
import PatientData from "@/atoms/patient";
import axiosInstance from "@/axios";

const treatmentStatusLabels: Record<PatientTreatmentStatus, string> = {
  WAITING: "Aguardando",
  IN_PROGRESS: "Em andamento",
  CANCELLED: "Cancelado",
  FINISHED: "Finalizado",
  SURGERY_SCHEDULED: "Cirurgia marcada",
  SCHEDULED: "Agendado",
  TO_PAY: "A pagar",
  CHANGED: "Alterado",
  REMAKE: "Refazer",
  FORWARDED: "Encaminhado",
};

const PatientTreatmentsHistory = (props: any) => {
  const { handleLoading } = useLoading();
  const patientData = useRecoilValue(PatientData);
  const adminData = useRecoilValue(UserData);
  const patient = patientData?.attributes;
  const actualProfessional =
    (patientData?.attributes as any)?.actualProfessional ?? "";
  const adminInfos = patient?.adminInfos;

  const [treatmentsFinished, setTreatmentsFinished] = useState<
    ToothsInterface[]
  >([]);
  const [patientTreatments, setPatientTreatments] = useState<any[]>([]);
  const [treatmentStatusMap, setTreatmentStatusMap] = useState<
    Record<string, PatientTreatmentStatus>
  >({});
  const [initialStatusMap, setInitialStatusMap] = useState<
    Record<string, PatientTreatmentStatus>
  >({});
  const [statusUpdates, setStatusUpdates] = useState<{
    [id: string]: PatientTreatmentStatus;
  }>({});

  const getPatientTreatments = useCallback(async () => {
    handleLoading(true, "Carregando dados do paciente...");
    try {
      const { data: d } = await handleGetTreatmentsOfPatient(
        String(patientData?.id!)
      );
      let data = d.data;

      const finisheds = data?.filter(
        (v: any) => v?.attributes?.finishedBy?.data !== null
      );
      setPatientTreatments(data);
      setTreatmentsFinished(finisheds);

      // Preenche o estado inicial
      const statusMap: Record<string, PatientTreatmentStatus> = {};
      data.forEach((item: any) => {
        statusMap[item.id] = item.attributes.status;
      });
      setInitialStatusMap(statusMap);
      setTreatmentStatusMap(statusMap);
    } catch (error: any) {
      console.log(error.response);
    } finally {
      handleLoading(false);
    }
  }, [patientData?.id]);

  useEffect(() => {
    getPatientTreatments();
  }, [getPatientTreatments, props.updateTreatments]);

  const hasUnsavedChanges = Object.keys(treatmentStatusMap).some(
    (id) => treatmentStatusMap[id] !== initialStatusMap[id]
  );

  const handleStatusChange = (
    id: string,
    newStatus: PatientTreatmentStatus
  ) => {
    const original = patientTreatments.find((t) => t.id === id)?.attributes
      ?.status;

    if (original !== newStatus) {
      setStatusUpdates((prev) => ({ ...prev, [id]: newStatus }));
    } else {
      // Se voltou ao original, remove do objeto de updates
      setStatusUpdates((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
    }
  };

  const handleSaveStatusUpdates = async () => {
    if (Object.keys(statusUpdates).length === 0) return;

    handleLoading(true, "Salvando alterações...");

    try {
      const updates = Object.entries(statusUpdates).map(([id, status]) => ({
        id,
        status,
      }));

      await axiosInstance.post("/update-treatment-statuses", {
        updates,
      });

      await getPatientTreatments(); // Recarrega os dados
      setStatusUpdates({});
    } catch (err) {
      console.error("Erro ao salvar status:", err);
    } finally {
      handleLoading(false);
    }
  };

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

      {patientTreatments?.length > 0 && (
        <TreatmentsContainer elevation={9}>
          <Typography variant="subtitle1" fontWeight="bold">
            Plano de Tratamento do paciente:
          </Typography>
          {patientTreatments.map((v: any, i: number) => (
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
              {adminData?.userType === "SUPERADMIN" && (
                <Select
                  value={statusUpdates[v.id] ?? v?.attributes?.status}
                  onChange={(e) =>
                    handleStatusChange(
                      v.id,
                      e.target.value as PatientTreatmentStatus
                    )
                  }
                  size="small"
                  variant="outlined"
                  disableUnderline
                >
                  {(
                    Object.keys(
                      treatmentStatusLabels
                    ) as PatientTreatmentStatus[]
                  ).map((status) => (
                    <MenuItem key={status} value={status}>
                      {treatmentStatusLabels[status]}
                    </MenuItem>
                  ))}
                </Select>
              )}
            </TreatmentPlan>
          ))}

          {Object.keys(statusUpdates).length > 0 && (
            <Box mt={2} textAlign="right">
              <Button
                variant="contained"
                color="primary"
                onClick={handleSaveStatusUpdates}
              >
                Salvar alterações
              </Button>
            </Box>
          )}
        </TreatmentsContainer>
      )}
    </Container>
  );
};

const Container = styled(Box)`
  width: 100%;
  min-width: 700px;
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
