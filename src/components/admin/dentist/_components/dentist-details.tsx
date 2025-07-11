/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import {
  Box,
  Button,
  Paper,
  Stack,
  Tab,
  Typography,
  styled,
} from "@mui/material";
import { TabContext, TabList } from "@mui/lab";
import { useRouter } from "next/router";
import Head from "next/head";

interface PaymentsDentistModalProps {
  dentistInfos: StrapiData<DentistStrapiAttributes> | null;
}

const DentistDetailsSingle = (props: PaymentsDentistModalProps) => {
  const router = useRouter();
  const { dentistInfos } = props;
  const [tabIndex, setTabIndex] = useState(0);
  const forwardeds = dentistInfos?.attributes?.forwarded_treatments;

  const handleChangeTab = (e: any, nVal: string) => setTabIndex(parseInt(nVal));

  const renderDentistHistories = (tabIndex: string) => {
    switch (tabIndex) {
      case "0":
        return null;
      case "1":
        return null;
      case "2":
        return null;
    }
  };

  return (
    <Stack>
      <Container>
        {/* <AlertModal
        ref={modalRef}
        title="Criar um novo pagamento"
        content={renderNewPayment()}
        onClose={handleCloseNewPayment}
        onRefuse={handleCloseNewPayment}
        open={modalPayment}
        
      /> */}
        <Head>
          <title>Dentista · nome · CEMIC</title>
        </Head>

        <Button fullWidth onClick={router.back} variant="contained">
          Voltar
        </Button>

        <Paper elevation={5} sx={{ mt: 4 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            p={2}
          >
            <Typography variant="h5">Históricos</Typography>
            <Button
              variant="contained"
              startIcon={<ReceiptLongIcon />}
              onClick={() =>
                router.push({
                  pathname: "/admin/dentists/generate-payment",
                  query: { dentist: dentistInfos?.id! },
                })
              }
            >
              Gerar Pagamento
            </Button>
          </Stack>
        </Paper>
      </Container>

      <TabContext value={tabIndex.toString()}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleChangeTab}>
            {["Pagamentos", "Encaminhados", "Finalizados"].map((v, i) => (
              <Tab key={i} label={v} value={i.toString()} />
            ))}
          </TabList>
        </Box>

        {renderDentistHistories(tabIndex.toString())}
      </TabContext>
    </Stack>
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

const TreatmentsFinisheds = styled(Paper)`
  background-color: #9ee5ff;
  padding: 1rem;
  width: 100%;
`;

export default DentistDetailsSingle;
