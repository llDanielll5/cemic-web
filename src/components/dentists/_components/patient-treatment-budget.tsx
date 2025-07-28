import React, { useState, useEffect, useCallback } from "react";
import { Box, Button } from "@mui/material";
import { useRecoilValue } from "recoil";
import { PaymentTypes } from "types/payments";
import { handleGetPatientTreatments } from "@/axios/admin/patients";
import { handleCreateOdontogram } from "@/axios/admin/odontogram";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import PatientData from "@/atoms/patient";
import UserData from "@/atoms/userData";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import OdontogramPatientDetails from "@/components/admin/patient/components/odontogram-details";
import PatientTreatmentsHistory from "@/components/admin/patient/components/treatments-history";

interface ClientTreatmentsInterface {
  patient: StrapiData<PatientInterface>;
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

const PatientTreatmentDentistBudgetTab = ({
  patient,
}: ClientTreatmentsInterface) => {
  const { asPath, replace } = useRouter();
  const adminData = useRecoilValue(UserData);
  const patientData = useRecoilValue(PatientData);
  const attr = patient?.attributes;
  let patientOdontogram = (
    attr?.odontogram as StrapiRelationData<OdontogramInterface>
  )?.data;
  const odontogramAttr = patientOdontogram?.attributes;

  const updatePage = () => replace(asPath);

  const openAddTreatment = async () => {
    if (patientOdontogram === null) {
      try {
        await handleCreateOdontogram(patientData?.id, adminData?.id!);
        toast.success("Odontograma do paciente criado com sucesso!");
        updatePage();
      } catch (error) {
        toast.error("Erro ao criar odontograma do paciente!");
      }
    }
  };

  return (
    <Box py={2} width="100%" overflow={"auto"}>
      <PatientTreatmentsHistory updateTreatments={updatePage} />

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
          patientOdontogram={{
            ...patientOdontogram,
            id: (
              patient?.attributes
                ?.odontogram as StrapiRelationData<OdontogramInterface>
            )?.data?.id,
          }}
          onUpdatePatient={updatePage}
        />
      )}
    </Box>
  );
};

export default PatientTreatmentDentistBudgetTab;
