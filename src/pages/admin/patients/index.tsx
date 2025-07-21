/* eslint-disable react-hooks/exhaustive-deps */
import Head from "next/head";
import { useCallback, useEffect, useState } from "react";
import { DashboardLayout } from "src/layouts/dashboard/layout";
import { CustomersSearch } from "@/components/new-admin/patient/customers-search";
import { CustomersTable } from "@/components/new-admin/patient/customers-table";
import { useRecoilValue } from "recoil";
import { useRouter } from "next/router";
import { PaginationProps } from "types";
import { PatientRole } from "types/patient";
import CModal from "@/components/modal";
import UserData from "@/atoms/userData";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import NewPatientForm from "@/components/new-admin/patient/newPatient";
import PatientsSort from "@/components/new-admin/patient/patients-sort";
import {
  handleFilterPatientByNameOrCpf,
  handleGetPatients,
} from "@/axios/admin/patients";
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Container,
  Pagination,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { toast } from "react-toastify";
import SEO from "@/components/SEO";
import PatientBudgetModal from "@/components/modal/patient-to-budget-modal";

export type SortType = "asc" | "desc";
const pageSizeOptions = [5, 10, 20, 50, 100];
export interface SortInterface {
  [q: string]: SortType;
}
interface StrapiPatientData {
  data: {
    data: StrapiData<PatientInterface>[];
    meta: { pagination: PaginationProps };
  };
}

const PatientsPage = () => {
  const router = useRouter();
  const adminData: any = useRecoilValue(UserData);
  const [data, setData] = useState<StrapiData<PatientInterface>[]>([]);
  const [statusFilter, setStatusFilter] = useState<PatientRole | null>(null);
  const [searchPatientValue, setSearchPatientValue] = useState("");
  const [newPatientVisible, setNewPatientVisible] = useState(false);
  const [patientToBudgetVisible, setPatientToBudgetVisible] = useState(false);
  const [selectedPatient, setSelectedPatient] =
    useState<StrapiData<PatientInterface> | null>(null);
  const [currPage, setCurrPage] = useState<number>(1);
  const [sort, setSort] = useState<SortType>("asc");
  const [pageSize, setPageSize] = useState(10);
  const [dbPagination, setDbPagination] = useState<PaginationProps>({
    page: 0,
    pageCount: 0,
    pageSize: 0,
    total: 0,
  });

  const getPatients = useCallback(
    async (currPage?: number, pageSize?: number, sort?: string) => {
      if (!adminData) return;
      const filial =
        adminData?.userType !== "SUPERADMIN" ? adminData.filial : undefined;

      try {
        const { data }: StrapiPatientData = await handleGetPatients(
          filial,
          currPage,
          pageSize,
          sort
        );
        let pagination = data.meta.pagination;
        setData(data.data);
        setDbPagination(pagination);
        setCurrPage(pagination.page);
        return;
      } catch (error) {
        toast.error("Erro ao recuperar paciente!");
      }
    },
    [adminData?.filial]
  );

  const handleChangePage = (e: any, value: number) => {
    setCurrPage(value);
    getPatients(value, pageSize, sort);
  };

  const handleChangeSort = (sort: SortType) => {
    setSort(sort);
    getPatients(currPage, pageSize, sort);
  };

  const getPatientFiltered = async () => {
    const filial =
      adminData?.userType !== "SUPERADMIN" ? adminData.filial : undefined;

    try {
      const { data }: StrapiPatientData = await handleFilterPatientByNameOrCpf(
        searchPatientValue,
        filial
      );
      let pagination = data.meta.pagination;
      setData(data.data);
      setDbPagination(pagination);
      setCurrPage(pagination.page);
    } catch (error: any) {
      toast.error("Erro ao recuperar paciente!");
    }
  };

  const handleBudgetPatient = (patient: StrapiData<PatientInterface>) => {
    setPatientToBudgetVisible(!patientToBudgetVisible);
    setSelectedPatient(patient);
  };

  const handlePatientAdded = async () => {
    setNewPatientVisible(!newPatientVisible);
    return await getPatients(currPage, pageSize, sort);
  };

  const handleClickPatient = (cardId: string) => {
    router.push("/admin/patients/" + cardId);
  };

  const handleChangePatientVisible = () => {
    if (!router.query.new_patient)
      return setNewPatientVisible(!newPatientVisible);
    setNewPatientVisible(false);
    const { new_patient, ...rest } = router.query;

    router.replace({ pathname: router.pathname, query: rest }, undefined, {
      shallow: true,
    });
  };
  const handleChangePatientToBudgetVisible = () =>
    setPatientToBudgetVisible(!patientToBudgetVisible);

  useEffect(() => {
    if (searchPatientValue.length === 0) getPatients(currPage, pageSize, sort);
    else getPatientFiltered();
  }, [searchPatientValue]);

  useEffect(() => {
    getPatients(1, pageSize, sort);
  }, [pageSize, getPatients]);

  useEffect(() => {
    const shouldOpenModal = router.query.new_patient === "true";
    setNewPatientVisible(shouldOpenModal);
  }, [router.query.new_patient]);

  return (
    <>
      <SEO title="CEMIC · Pacientes" />
      <CModal
        styles={{ width: "85vw", overflow: "auto", height: "95vh" }}
        visible={newPatientVisible}
        closeModal={handleChangePatientVisible}
      >
        <NewPatientForm onClose={handlePatientAdded} />
      </CModal>

      <PatientBudgetModal
        open={patientToBudgetVisible}
        onClose={handleChangePatientToBudgetVisible}
        patientId={selectedPatient?.id!}
      />

      <Box component="main" sx={{ py: 8, overflow: "auto" }}>
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" spacing={2}>
              <Stack spacing={1}>
                <Typography variant="h4">Pacientes</Typography>
              </Stack>
              {adminData?.permissions?.patients?.permissions?.create && (
                <Button
                  startIcon={<PersonAddAltIcon />}
                  onClick={handleChangePatientVisible}
                  variant="contained"
                >
                  Add
                </Button>
              )}
            </Stack>

            {searchPatientValue.length > 0 && (
              <Alert severity="warning" sx={{ my: 2 }}>
                Apague o texto de busca para buscar todos pacientes!
              </Alert>
            )}

            <CustomersSearch
              value={searchPatientValue}
              onChange={(e: any) => setSearchPatientValue(e.target.value)}
              onClick={() => getPatientFiltered()}
              onKeyDown={({ key }: any) => {
                if (key === "Enter") {
                  return getPatientFiltered();
                }
              }}
            />

            <PatientsSort
              sort={sort}
              handleChangeSort={handleChangeSort}
              filterStatus={statusFilter}
              setFilterStatus={setStatusFilter}
            />

            <CustomersTable
              items={data}
              onClick={(cardId) => handleClickPatient(cardId)}
              onEdit={() => console.log("")}
              onBudgetForward={handleBudgetPatient}
            />

            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-around"
              mb={2}
            >
              <Box />
              {dbPagination.page !== 0 && (
                <Pagination
                  page={currPage}
                  size="small"
                  onChange={handleChangePage}
                  count={dbPagination.pageCount}
                />
              )}

              <Autocomplete
                options={pageSizeOptions}
                value={pageSize}
                getOptionLabel={(option: number) => option.toString()}
                onChange={(e, v) => setPageSize(v!)}
                clearIcon={false}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="P/ Pagina"
                    variant="outlined"
                    sx={{ backgroundColor: "white" }}
                  />
                )}
              />
            </Box>
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
