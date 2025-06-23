import React, { useState, useEffect, useCallback } from "react";
import { Box, Button } from "@mui/material";
import { useRecoilValue } from "recoil";
import { PaymentTypes } from "types/payments";
import { handleGetPatientTreatments } from "@/axios/admin/patients";
import { handleCreateOdontogram } from "@/axios/admin/odontogram";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import OdontogramPatientDetails from "../components/odontogram-details";
import PatientTreatmentsHistory from "../components/treatments-history";
import PatientData from "@/atoms/patient";
import UserData from "@/atoms/userData";
import { toast } from "react-toastify";

interface ClientTreatmentsInterface {
  onUpdatePatient: any;
}

interface TreatmentsInterface {
  screening: any;
  treatments: any;
}

export interface PaymentShapesArray {
  paymentType: PaymentTypes | null;
  value: number;
  valueStr: string;
}

const PatientTreatmentsTab = (props: ClientTreatmentsInterface) => {
  const { onUpdatePatient } = props;
  const patientData = useRecoilValue(PatientData);
  const client = patientData?.attributes;
  const adminData: any = useRecoilValue(UserData);
  const [isLoading, setIsLoading] = useState(false);
  let patientOdontogram = client?.odontogram?.data;

  const [data, setData] = useState<TreatmentsInterface>({
    treatments: null,
    screening: null,
  });

  const openAddTreatment = async () => {
    if (patientOdontogram === null) {
      return await handleCreateOdontogram(patientData?.id, adminData?.id!).then(
        (res) => {
          toast.success("Odontograma do paciente criado com sucesso!");
          onUpdatePatient();
        },
        (err) => console.log(err.response)
      );
    }
  };

  const getInformations = (data: any) => {
    let treatments = data?.attributes?.treatments;
    let screening = data?.attributes?.screening?.data;
    return setData({ treatments, screening });
  };

  const getTreatments = useCallback(async () => {
    return await handleGetPatientTreatments(patientData?.id!).then(
      (res) => getInformations(res.data.data),
      (err) => console.log(err.response)
    );
  }, [patientData]);

  useEffect(() => {
    getTreatments();
  }, [getTreatments]);

  const updateTreatments = () => {
    return;
  };

  useEffect(() => {
    updateTreatments();
  }, [onUpdatePatient]);

  return (
    <Box py={2} width="100%" overflow={"auto"}>
      <PatientTreatmentsHistory updateTreatments={updateTreatments} />

      {patientOdontogram === null && (
        <Box display="flex" alignItems="center" justifyContent="center" p={2}>
          <Button
            variant="contained"
            fullWidth
            sx={{ width: "max-content" }}
            onClick={openAddTreatment}
            endIcon={<EmojiEmotionsIcon />}
          >
            Criar Odontograma do Paciente
          </Button>
        </Box>
      )}

      {patientOdontogram !== null && (
        <OdontogramPatientDetails
          patientOdontogram={patientOdontogram ?? undefined}
          onUpdatePatient={onUpdatePatient}
        />
      )}
    </Box>
  );
};

export default PatientTreatmentsTab;
