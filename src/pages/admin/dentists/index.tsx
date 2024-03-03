import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/layouts/dashboard/layout";
import { Box, Button, Stack, Typography, styled } from "@mui/material";
import { getDentistSingle, getListOfDentists } from "@/axios/admin/dentists";
import { CompaniesSearch } from "@/components/new-admin/companies/companies-search";
import CardDentist from "@/components/admin/dentist/_components/card-dentist";
import PaymentsDentistModal from "@/components/admin/dentist/modals/payments";
import AddIcon from "@mui/icons-material/Add";

const DentistPage = () => {
  const [dentists, setDentists] = useState<any[]>([]);
  const [filterValue, setFilterValue] = useState("");
  const [paymentModal, setPaymentModal] = useState(false);
  const [dentistSingle, setDentistSingle] = useState<any | null>(null);

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

  useEffect(() => {
    handleGetAllDentists();
  }, []);

  return (
    <Container>
      <PaymentsDentistModal
        visible={paymentModal}
        closeModal={() => setPaymentModal(false)}
        dentistInfos={dentistSingle}
      />

      <Stack
        alignItems="center"
        justifyContent="space-between"
        direction={"row"}
      >
        <Typography variant="h4">Dentistas</Typography>
        <Button variant="contained" startIcon={<AddIcon />}>
          Add
        </Button>
      </Stack>

      <CompaniesSearch
        placeholder="Buscar Dentista"
        value={filterValue}
        onChange={(val) => setFilterValue(val)}
      />

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
