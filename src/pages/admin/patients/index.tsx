/* eslint-disable react-hooks/exhaustive-deps */
import Head from "next/head";
import { useEffect, useState, useCallback } from "react";
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
import {
  handleGetPatientByCPF,
  handleGetPatients,
} from "@/axios/admin/patients";
import {
  Autocomplete,
  Box,
  Button,
  Container,
  Pagination,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { PatientRole } from "types/patient";
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
  const [pageSize, setPageSize] = useState(5);
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

  const getPatients = async (
    currPage?: number,
    pageSize?: number,
    sort?: string
  ) => {
    return await handleGetPatients(currPage, pageSize, sort).then(
      (res: any) => {
        let pagination = res.data.meta.pagination;
        setData(res.data.data);
        setDbPagination(pagination);
        setCurrPage(pagination.page);
        return;
      },
      (error) => console.log(error.response)
    );
  };

  const handleChangePage = (e: any, value: number) => {
    setCurrPage(value);
    getPatients(value, pageSize, sort);
  };

  const handleChangeSort = (sort: SortType) => {
    setSort(sort);
    getPatients(currPage, pageSize, sort);
  };

  const getPatientByCPF = async () => {
    return await handleGetPatientByCPF(searchPatientValue).then(
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
    return await getPatients();
  };

  const handleClickPatient = (id: string) =>
    router.push("/admin/patients/" + id);

  const handleChangePatientVisible = () =>
    setNewPatientVisible(!newPatientVisible);

  useEffect(() => {
    if (searchPatientValue.length < 11) getPatients(currPage, pageSize, sort);
    else getPatientByCPF();
  }, [searchPatientValue]);

  useEffect(() => {
    getPatients(1, pageSize, sort);
  }, [pageSize]);

  return (
    <>
      <Head>
        <title>Pacientes · CEMIC</title>
      </Head>
      <CModal
        styles={{ width: "90%", overflow: "auto", height: "95vh" }}
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
              <Button
                startIcon={<PersonAddAltIcon />}
                onClick={handleChangePatientVisible}
                variant="contained"
              >
                Add
              </Button>
            </Stack>

            <CustomersSearch
              value={searchPatientValue}
              onChange={(e: any) => setSearchPatientValue(e.target.value)}
              onClick={() => getPatientByCPF()}
              onKeyDown={({ key }: any) => {
                if (key === "Enter") {
                  return getPatientByCPF();
                }
              }}
            />

            <PatientsSort
              handleChangeSort={handleChangeSort}
              sort={sort}
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
