import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/layouts/dashboard/layout";
import { WhatsappTable } from "@/components/table/whatsapp-table";
import axiosInstance from "@/axios";
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Card,
  Chip,
  Pagination,
  Stack,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import { useRecoilValue } from "recoil";
import UserData from "@/atoms/userData";

type Locale = "BRASILIA-DF" | "UBERLANDIA-MG" | "";
interface PaginationInterface {
  page: number;
  total: number;
  pageSize: number;
  pageCount: number;
}

const WhatsappPage = (props: any) => {
  const [cadastros, setCadastros] = useState<any[]>([]);
  const [filterLocale, setFilterLocale] = useState<Locale>("");
  const [hourFilter, setHourFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const adminData = useRecoilValue(UserData);
  const [pagination, setPagination] = useState<PaginationInterface>({
    page: 1,
    total: 0,
    pageSize: 0,
    pageCount: 0,
  });
  const resetFilters = () => {
    setDateFilter("");
    setHourFilter("");
    setFilterLocale("");
    setPagination((prev) => ({ ...prev, page: 1 }));
  };
  const changeLocale = (item: string) => {
    if (item === filterLocale) return setFilterLocale("");
    setFilterLocale(item as Locale);
  };

  const getRegisters = React.useCallback(async () => {
    let localeFilter =
      filterLocale !== "" ? `&filters[location][$eq]=${filterLocale}` : "";
    // let hourParams =
    //   hourFilter !== "" ? `&filters[hour][$eq]=${hourFilter}` : "";
    let dayParams = dateFilter !== "" ? `&filters[day][$eq]=${dateFilter}` : "";
    let url = `/wa-schedules/?sort[0]=createdAt:desc&pagination[page]=${pagination.page}`;

    if (localeFilter !== "") {
      url += localeFilter;
    } else {
      url.replace(`&filters[location][$eq]=${filterLocale}`, "");
    }

    // if (hourFilter !== "") {
    //   url += hourParams;
    // } else {
    //   url.replace(`&filters[hour][$eq]=${hourFilter}`, "");
    // }

    if (dateFilter !== "") {
      url += dayParams;
    } else {
      url.replace(`&filters[day][$eq]=${dateFilter}`, "");
    }

    return await axiosInstance.get(url).then(
      ({ data }) => {
        setPagination(data.meta.pagination);
        setCadastros(data.data);
      },
      (err) => console.log(err)
    );
  }, [filterLocale, pagination.page, dateFilter]);

  const getFilterByDentist =
    adminData?.location === "DF" ? "BRASILIA-DF" : "UBERLANDIA-MG";

  useEffect(() => {
    getRegisters();
  }, [getRegisters]);

  useEffect(() => {
    if (adminData?.role === "DENTIST") setFilterLocale(getFilterByDentist);
  }, [adminData?.role]);

  const regions =
    adminData?.role === "DENTIST"
      ? [getFilterByDentist]
      : ["BRASILIA-DF", "UBERLANDIA-MG", "OTHER"];

  return (
    <Box>
      <Header>
        <Typography variant="h5">Central Whatsapp</Typography>
      </Header>

      <SearchContainer elevation={5}>
        <Typography variant="subtitle1" pb={1}>
          Filtrar por Localização:
        </Typography>

        <Stack
          direction="row"
          columnGap={2}
          flexWrap={"wrap"}
          rowGap={2}
          pb={1}
        >
          {adminData?.role === "ADMIN" || adminData?.role === "SUPERADMIN"
            ? regions.map((item, index) => (
                <Chip
                  key={index}
                  label={item}
                  variant="filled"
                  onClick={() => changeLocale(item)}
                  color={filterLocale === item ? "primary" : "default"}
                />
              ))
            : null}
        </Stack>

        <FilterStack direction="row">
          <TextField
            label={`Filtrar por Dia`}
            InputLabelProps={{ shrink: true }}
            type={"date"}
            placeholder="Filtrar por Dia"
            onChange={(e) => setDateFilter(e.target.value)}
            fullWidth
          />
          {/* <Autocomplete
            fullWidth
            options={["11:00", "17:00", "18:00"]}
            value={hourFilter}
            onChange={(e, v) => setHourFilter(v!)}
            renderInput={(params) => (
              <TextField placeholder="Filtrar por horário!" {...params} />
            )}
          /> */}
        </FilterStack>
        <Stack direction="row" alignItems="center">
          {dateFilter !== "" || hourFilter !== "" ? (
            <Button
              fullWidth
              variant="contained"
              onClick={resetFilters}
              sx={{ mt: 2 }}
            >
              Resetar Filtros
            </Button>
          ) : null}
        </Stack>
      </SearchContainer>

      <Alert severity="success" icon={<></>} sx={{ my: 2 }}>
        Foram encontrado(s) {pagination?.total} resultados.
      </Alert>

      <Box sx={{ mx: "2%", my: 2 }}>
        <WhatsappTable rows={cadastros} />
      </Box>

      <Stack
        py={2}
        direction={"row"}
        columnGap={1}
        alignItems="center"
        justifyContent="center"
      >
        <Pagination
          color="primary"
          count={pagination?.pageCount}
          onChange={(e, p) => setPagination((prev) => ({ ...prev, page: p }))}
        />
      </Stack>
    </Box>
  );
};

WhatsappPage.getLayout = (page: any) => (
  <DashboardLayout>{page}</DashboardLayout>
);

const Header = styled(Box)`
  padding: 3rem 3rem 1rem 3rem;
`;
const SearchContainer = styled(Card)`
  padding: 2rem;
  margin: 0 2%;
`;
const FilterStack = styled(Stack)`
  justify-content: center;
  align-items: center;
  column-gap: 1rem;
  padding-top: 1rem;

  @media screen and (max-width: 760px) {
    flex-direction: column;
    row-gap: 1rem;
  }
`;

export default WhatsappPage;
