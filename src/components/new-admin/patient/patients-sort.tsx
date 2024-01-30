import React from "react";
import {
  Autocomplete,
  Box,
  Chip,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

interface PatientsSortInterface {
  sort: any;
  handleChangeSort: any;
  filterStatus: any;
  setFilterStatus: any;
}

const filterOptions = [
  { name: "Paciente", value: "PATIENT" },
  { name: "Pré-Registro", value: "PRE-REGISTER" },
  { name: "Selecionado", value: "SELECTED" },
  { name: "", value: "" },
];

const PatientsSort = (props: PatientsSortInterface) => {
  const { handleChangeSort, sort, filterStatus, setFilterStatus } = props;

  const ascSort = sort === "asc" ? "warning" : undefined;
  const descSort = sort === "desc" ? "warning" : undefined;

  return (
    <Box display="flex" columnGap={2}>
      <Stack
        p={2}
        direction="column"
        spacing={1}
        width="fit-content"
        borderRadius={2}
        sx={{ background: "#f4f4f4" }}
      >
        <Typography variant="subtitle1">Ordenar por Nome</Typography>
        <Stack direction="row" spacing={1} justifyContent="center">
          <Chip
            label="A-Z"
            color={ascSort}
            size="small"
            clickable
            onClick={() => handleChangeSort("asc")}
          />
          <Chip
            label="Z-A"
            color={descSort}
            size="small"
            clickable
            onClick={() => handleChangeSort("desc")}
          />
        </Stack>
      </Stack>

      {/* <Stack
        p={2}
        direction="column"
        spacing={1}
        width="fit-content"
        borderRadius={2}
        sx={{ background: "#f4f4f4" }}
      >
        <Typography variant="subtitle1">Filtrar por Status</Typography>
        <Autocomplete
          options={filterOptions}
          value={filterStatus}
          getOptionLabel={(option) => option.name}
          isOptionEqualToValue={(option, value) => {
            console.log(value);
            option.name === value;
          }}
          onChange={(e, v) => {
            if (v === null) return setFilterStatus("");
            setFilterStatus(v.value);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              sx={{ backgroundColor: "white" }}
            />
          )}
        />
      </Stack> */}
    </Box>
  );
};

export default PatientsSort;
