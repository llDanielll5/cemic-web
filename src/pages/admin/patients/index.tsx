/* eslint-disable react-hooks/exhaustive-deps */
//@ts-nocheck
import Head from "next/head";
import { useCallback, useEffect, useMemo, useState } from "react";
import ArrowDownOnSquareIcon from "@heroicons/react/24/solid/ArrowDownOnSquareIcon";
import ArrowUpOnSquareIcon from "@heroicons/react/24/solid/ArrowUpOnSquareIcon";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import { useSelection } from "@/hooks/useSelection";
import { DashboardLayout } from "src/layouts/dashboard/layout";
import { CustomersTable } from "src/components/new-admin/customer/customers-table";
import { CustomersSearch } from "src/components/new-admin/customer/customers-search";
import { applyPagination } from "@/services/apply-pagination";
import { useOnSnapshotQuery } from "@/hooks/useOnSnapshotQuery";
import {
  Box,
  Button,
  Container,
  Stack,
  SvgIcon,
  Typography,
} from "@mui/material";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "@/services/firebase";
import CModal from "@/components/modal";
import ClientInfos from "@/components/admin/clientInfos";

const useCustomerIds = (customers: any) => {
  return useMemo(() => {
    return customers.map((customer: any) => customer.id);
  }, [customers]);
};

const clientRef = collection(db, "clients");

const PatientsPage = () => {
  const orderByName = query(clientRef, orderBy("name"));
  const snapshotPatients = useOnSnapshotQuery("clients", orderByName, []);
  const [data, setData] = useState(snapshotPatients);

  const [searchPatientValue, setSearchPatientValue] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [patientInfo, setPatientInfo] = useState({});
  const [patientID, setPatientID] = useState(null);
  const [patientDetailsVisible, setPatientDetailsVisible] = useState(false);

  const useCustomers = (page: any, rowsPerPage: any) => {
    return useMemo(() => {
      return applyPagination(data, page, rowsPerPage);
    }, [page, rowsPerPage, data]);
  };

  const customers = useCustomers(page, rowsPerPage);
  const customersIds = useCustomerIds(customers);
  const customersSelection = useSelection(customersIds);

  const handlePageChange = useCallback((event: any, value: any) => {
    setPage(value);
  }, []);

  const handleRowsPerPageChange = useCallback((event: any) => {
    setRowsPerPage(event.target.value);
  }, []);

  const getPatientByCPF = async () => {
    const q = query(clientRef, where("cpf", "==", searchPatientValue));
    const snapshot = await getDocs(q);
    if (snapshot.docs[0] === undefined)
      return alert("Paciente não encontrado ou não existe!");
    else {
      let arr: any[] = [];
      snapshot.docs.forEach((doc) => {
        arr.push(doc.data());
      });
      setData(arr);
    }
  };

  const handleClosePatientSingle = () => {
    setPatientID(null);
    setPatientInfo({});
    setPatientDetailsVisible(false);
  };

  const handleGetPatientInfo = (patient: any) => {
    setPatientID(patient.id);
    setPatientInfo(patient);
    setPatientDetailsVisible(true);
  };

  useEffect(() => {
    if (searchPatientValue.length < 11) setData(snapshotPatients);
  }, [searchPatientValue, snapshotPatients]);

  return (
    <>
      <Head>
        <title>Pacientes · CEMIC</title>
      </Head>
      <CModal
        styles={{ width: "80%", overflow: "auto" }}
        visible={patientDetailsVisible}
        closeModal={handleClosePatientSingle}
      >
        <ClientInfos client={patientInfo} />
      </CModal>

      <Box component="main" sx={{ py: 8, overflow: "auto" }}>
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4">Pacientes</Typography>
              </Stack>
              <div>
                <Button
                  startIcon={
                    <SvgIcon fontSize="small">
                      <PlusIcon />
                    </SvgIcon>
                  }
                  variant="contained"
                >
                  Add
                </Button>
              </div>
            </Stack>
            <CustomersSearch
              value={searchPatientValue}
              onChange={(e: any) => setSearchPatientValue(e.target.value)}
              onClick={() => getPatientByCPF()}
              onKeyDown={({ key }: any) => {
                if (key === "Enter") getPatientByCPF();
              }}
            />
            <CustomersTable
              count={data.length}
              items={customers}
              onClick={handleGetPatientInfo}
              onDeselectAll={customersSelection.handleDeselectAll}
              onDeselectOne={customersSelection.handleDeselectOne}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              onSelectAll={customersSelection.handleSelectAll}
              onSelectOne={customersSelection.handleSelectOne}
              page={page}
              rowsPerPage={rowsPerPage}
              selected={customersSelection.selected}
            />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

PatientsPage.getLayout = (page: any) => (
  <DashboardLayout>{page}</DashboardLayout>
);

export default PatientsPage;
