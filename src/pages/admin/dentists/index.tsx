import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/layouts/dashboard/layout";
import { Box, Button, Stack, Typography, styled } from "@mui/material";
import { getDentistSingle, getListOfDentists } from "@/axios/admin/dentists";
import { CompaniesSearch } from "@/components/new-admin/companies/companies-search";
import CardDentist from "@/components/admin/dentist/_components/card-dentist";
import PaymentsDentistModal from "@/components/admin/dentist/modals/payments";
import AddIcon from "@mui/icons-material/Add";
import CModal from "@/components/modal";
import NewDentistForm from "@/components/new-admin/dentist/new-dentist-form";
import Head from "next/head";

const DentistPage = () => {
  const [dentists, setDentists] = useState<any[]>([]);
  const [filterValue, setFilterValue] = useState("");
  const [paymentModal, setPaymentModal] = useState(false);
  const [dentistSingle, setDentistSingle] = useState<any | null>(null);
  const [newDentistVisible, setNewDentistVisible] = useState(false);

  const handleGetAllDentists = async () => {
    return await getListOfDentists().then(
      (res) => setDentists(res.data),
      (err) => console.log(err.response)
    );
  };

  const handleGetDentistPayments = async (id: string) => {
    setPaymentModal(true);
    return await getDentistSingle(id).then(
      (res) => setDentistSingle(res.data),
      (err) => console.log(err.response)
    );
  };

  const handleChangeDentistVisible = () =>
    setNewDentistVisible(!newDentistVisible);

  const handleDentistAdded = async () => {
    handleChangeDentistVisible();
    // return await getPatients(currPage, pageSize, sort);
  };

  useEffect(() => {
    handleGetAllDentists();
  }, []);

  return (
    <Container>
      <Head>
        <title>Dentistas · CEMIC</title>
      </Head>

      <PaymentsDentistModal
        visible={paymentModal}
        closeModal={() => setPaymentModal(false)}
        dentistInfos={dentistSingle}
      />

      <CModal
        styles={{ width: "90vw", overflow: "auto", height: "95vh" }}
        visible={newDentistVisible}
        closeModal={handleChangeDentistVisible}
      >
        <NewDentistForm onClose={handleDentistAdded} />
      </CModal>

      <Stack maxWidth={"xl"} spacing={3}>
        <Stack
          alignItems="center"
          justifyContent="space-between"
          direction={"row"}
        >
          <Typography variant="h4">Dentistas</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleChangeDentistVisible}
          >
            Add
          </Button>
        </Stack>
        <CompaniesSearch
          placeholder="Buscar Dentista"
          value={filterValue}
          onChange={(val) => setFilterValue(val)}
        />
      </Stack>

      <GridContainer>
        {dentists?.map((val, index) => (
          <CardDentist
            key={index}
            dentistInfos={val}
            onGetDetails={(id) => console.log(id)}
            onGetPayments={handleGetDentistPayments}
          />
        ))}
      </GridContainer>
    </Container>
  );
};

const Container = styled(Box)`
  width: 100%;
  padding: 4rem 3rem;
`;

const GridContainer = styled(Box)`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-column-gap: 2rem;
  grid-row-gap: 1rem;
`;

DentistPage.getLayout = (page: any) => (
  <DashboardLayout>{page}</DashboardLayout>
);

export default DentistPage;
