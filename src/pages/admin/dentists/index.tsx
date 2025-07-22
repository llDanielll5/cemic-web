import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/layouts/dashboard/layout";
import { Box, Button, Stack, Typography, styled } from "@mui/material";
import { getAllDentists } from "@/axios/admin/dentists";
import { CompaniesSearch } from "@/components/new-admin/companies/companies-search";
import AddIcon from "@mui/icons-material/Add";
import CModal from "@/components/modal";
import NewDentistForm from "@/components/new-admin/dentist/new-dentist-form";
import Head from "next/head";
import { DentistTable } from "@/components/table/dentist-table";
import { useRouter } from "next/router";

const DentistPage = () => {
  const { push } = useRouter();
  const [dentists, setDentists] = useState<any[]>([]);
  const [filterValue, setFilterValue] = useState("");
  const [paymentModal, setPaymentModal] = useState(false);
  const [dentistSingle, setDentistSingle] = useState<any | null>(null);
  const [newDentistVisible, setNewDentistVisible] = useState(false);

  const handleGetAllDentists = async () => {
    return await getAllDentists().then(
      (res) => setDentists(res.data.data),
      (err) => console.log(err.response)
    );
  };

  const handleGetDentistPayments = async (id: string) => {
    return await push(`/admin/dentists/${id}`);
  };

  const handleChangeDentistVisible = () =>
    setNewDentistVisible(!newDentistVisible);

  const handleDentistAdded = async () => {
    handleChangeDentistVisible();
    await handleGetAllDentists();
  };

  useEffect(() => {
    handleGetAllDentists();
  }, []);

  return (
    <Container>
      <Head>
        <title>Dentistas · CEMIC</title>
      </Head>

      <CModal
        styles={{ width: "90vw", overflow: "auto", height: "95vh" }}
        visible={newDentistVisible}
        closeModal={handleChangeDentistVisible}
      >
        <NewDentistForm onClose={handleDentistAdded} />
      </CModal>

      <Stack maxWidth={"xl"} spacing={3} mb={4}>
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

      <Stack gap={2}>
        <DentistTable
          items={dentists}
          onClick={(t) => console.log(t)}
          onGetPaymentDetails={handleGetDentistPayments}
        />
      </Stack>
      {/*  <CardDentist
             key={index}
             dentistInfos={val}
             onGetDetails={(id) => console.log(id)}
             onGetPayments={handleGetDentistPayments}
           /> */}
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
