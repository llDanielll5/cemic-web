import React from "react";
import CModal from "@/components/modal";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import { parseDateIso } from "@/services/services";
import { Box, Button, Paper, Stack, Typography, styled } from "@mui/material";

interface PaymentsDentistModalProps {
  visible: boolean;
  closeModal: any;
  dentistInfos: any | null;
}

const PaymentsDentistModal = (props: PaymentsDentistModalProps) => {
  const { closeModal, visible, dentistInfos } = props;

  const forwardeds = dentistInfos?.forwardedTreatments;

  return (
    <CModal
      visible={visible}
      closeModal={closeModal}
      styles={{ width: "95vw", height: "90vh", overflow: "auto" }}
    >
      <Container>
        <Paper elevation={5}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            p={2}
          >
            <Typography variant="h5">Pagamentos</Typography>
            <Button variant="contained" startIcon={<ReceiptLongIcon />}>
              Gerar
            </Button>
          </Stack>
        </Paper>
      </Container>

      <StyledGrid>
        <FinishedTreatmentsContainer elevation={9}>
          <Typography variant="h5" textAlign="center">
            Histórico de Pagamentos
          </Typography>
          {dentistInfos?.finisheds?.length === 0 && (
            <Typography variant="subtitle1" textAlign="center" mt={1}>
              Não há tratamentos pagos!
            </Typography>
          )}
          {dentistInfos?.finisheds?.length > 0 &&
            dentistInfos?.finisheds?.map((v: any, i: number) => (
              <Typography variant="h6" key={i}>
                Tratamento
              </Typography>
            ))}
        </FinishedTreatmentsContainer>

        <TreatmentsInProgress>
          <Typography variant="h5" textAlign="center">
            Tratamentos em Andamento
          </Typography>

          {forwardeds?.map((item: any, index: number) => {
            <Stack
              alignItems="center"
              justifyContent="space-between"
              direction={"row"}
              key={index}
            >
              <Typography>Encaminhado: {parseDateIso(item.date)}</Typography>
              <Typography>Paciente: {item.patient.name}</Typography>
              <Typography>{item.treatments.length} Tratamentos</Typography>
              <Button variant="contained">Ver Mais</Button>
            </Stack>;
          })}
        </TreatmentsInProgress>
      </StyledGrid>
    </CModal>
  );
};

const Container = styled(Box)`
  padding: 1rem;
`;

const StyledGrid = styled(Box)`
  display: grid;
  width: 100%;
  grid-template-rows: repeat(2, 1fr);
  justify-items: center;
  grid-column-gap: 1rem;
  grid-row-gap: 1rem;
`;

const FinishedTreatmentsContainer = styled(Paper)`
  background-color: #bdfcc0;
  padding: 1rem;
  width: 100%;
`;

const TreatmentsInProgress = styled(Paper)`
  background-color: #fdff94;
  padding: 1rem;
  width: 100%;
`;

export default PaymentsDentistModal;
