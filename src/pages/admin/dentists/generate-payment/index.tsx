import { getPatientsFinishedsForDentist } from "@/axios/admin/payments";
import { DashboardLayout } from "@/layouts/dashboard/layout";
import { Box, Button, Paper, Typography, styled } from "@mui/material";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";

// import { Container } from './styles';

const GenerateDentistPayment = () => {
  const router = useRouter();
  const dentistId: any = router.query.dentist ?? "";
  const [patientsToPay, setPatientsToPay] = useState<any[]>([]);
  const [patientsChoiceds, setPatientsChoiceds] = useState<any[]>([]);

  const handleAddPatient = (item: any) => {
    const filter = patientsToPay.filter((patient) => patient !== item);
    setPatientsToPay(filter);
    return setPatientsChoiceds((prev) => [...(prev ?? []), item]);
  };
  const handleDeletePatient = (item: any) => {
    const filter = patientsChoiceds.filter((treat) => treat !== item);
    setPatientsChoiceds(filter);
    return setPatientsToPay((prev) => [...(prev ?? []), item]);
  };

  const handleGetAllTreatmentsConcludedsOfDentist = useCallback(async () => {
    if (dentistId !== null || dentistId !== undefined) {
      return await getPatientsFinishedsForDentist(dentistId!).then(
        (res) => setPatientsToPay(res.data.data),
        (err) => console.log(err.response)
      );
    } else return;
  }, [dentistId]);

  useEffect(() => {
    handleGetAllTreatmentsConcludedsOfDentist();
  }, [handleGetAllTreatmentsConcludedsOfDentist]);

  return (
    <Box py={2} width="100%" height="90vh" overflow={"auto"}>
      <Container>
        {patientsToPay?.length > 0 && (
          <Paper elevation={9} sx={{ p: 2 }}>
            <Typography variant="subtitle1">Escolha os pacientes:</Typography>
            {patientsToPay?.map((patient, index) => (
              <Button
                variant="contained"
                sx={{ my: 1 }}
                fullWidth
                color="success"
                key={index}
                onClick={() => handleAddPatient(patient)}
              >
                {patient?.attributes?.name}
              </Button>
            ))}
          </Paper>
        )}

        {patientsChoiceds?.length > 0 && (
          <Paper elevation={9} sx={{ p: 2, mt: 4 }}>
            <Typography variant="subtitle1">Pacientes Escolhidos:</Typography>
            {patientsChoiceds?.map((patient, index) => (
              <Button
                variant="contained"
                sx={{ my: 1 }}
                fullWidth
                color="warning"
                key={index}
                onClick={() => handleDeletePatient(patient)}
              >
                {patient?.attributes?.name}
              </Button>
            ))}
          </Paper>
        )}

        {patientsChoiceds?.length > 0 && (
          <Typography variant="subtitle2" mt={4}>
            Somente esses pagamentos?
          </Typography>
        )}
      </Container>
    </Box>
  );
};

GenerateDentistPayment.getLayout = (page: any) => (
  <DashboardLayout>{page}</DashboardLayout>
);

const Container = styled(Box)`
  padding: 1rem;
`;

export default GenerateDentistPayment;
