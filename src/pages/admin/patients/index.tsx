/* eslint-disable react-hooks/exhaustive-deps */
import Head from "next/head";
import { useCallback, useEffect, useState } from "react";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import { DashboardLayout } from "src/layouts/dashboard/layout";
import { CustomersSearch } from "@/components/new-admin/patient/customers-search";
import CModal from "@/components/modal";
import UserData from "@/atoms/userData";
import NewPatientForm from "@/components/new-admin/patient/newPatient";
import PatientsSort from "@/components/new-admin/patient/patients-sort";
import { CustomersTable } from "@/components/new-admin/patient/customers-table";
import { useRecoilValue } from "recoil";
import { useRouter } from "next/router";
import { PaginationProps } from "types";
import { PatientRole } from "types/patient";
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
import { getCookie } from "cookies-next";

export type SortType = "asc" | "desc";
const pageSizeOptions = [5, 10, 20, 50, 100];
export interface SortInterface {
  [q: string]: SortType;
}

const PatientsPage = () => {
  const router = useRouter();
  const [data, setData] = useState([]);
  const adminData: any = useRecoilValue(UserData);
  const [currPage, setCurrPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState(10);
  const [sort, setSort] = useState<SortType>("asc");
  const [statusFilter, setStatusFilter] = useState<PatientRole | null>(null);
  const [searchPatientValue, setSearchPatientValue] = useState("");
  const [newPatientVisible, setNewPatientVisible] = useState(false);
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
      return await handleGetPatients(filial, currPage, pageSize, sort).then(
        (res: any) => {
          let pagination = res.data.meta.pagination;
          setData(res.data.data);
          setDbPagination(pagination);
          setCurrPage(pagination.page);
          return;
        },
        (error) => console.log(error.response)
      );
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
    return await handleFilterPatientByNameOrCpf(
      searchPatientValue,
      filial
    ).then(
      (res) => {
        let pagination = res.data.meta.pagination;
        setData(res.data.data);
        setDbPagination(pagination);
        setCurrPage(pagination.page);
      },
      (err) => console.log(err.response)
    );
  };

  const handlePatientAdded = async () => {
    setNewPatientVisible(!newPatientVisible);
    return await getPatients(currPage, pageSize, sort);
  };

  const handleClickPatient = (cardId: string) => {
    router.push("/admin/patients/" + cardId);
  };

  const handleChangePatientVisible = () =>
    setNewPatientVisible(!newPatientVisible);

  useEffect(() => {
    if (searchPatientValue.length === 0) getPatients(currPage, pageSize, sort);
    else getPatientFiltered();
  }, [searchPatientValue]);

  useEffect(() => {
    getPatients(1, pageSize, sort);
  }, [pageSize, getPatients]);

  return (
    <>
      <Head>
        <title>Pacientes · CEMIC</title>
      </Head>

      <CModal
        styles={{ width: "85vw", overflow: "auto", height: "95vh" }}
        visible={newPatientVisible}
        closeModal={handleChangePatientVisible}
      >
        <NewPatientForm onClose={handlePatientAdded} />
      </CModal>

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

            <CustomersTable items={data} onClick={handleClickPatient} />

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
