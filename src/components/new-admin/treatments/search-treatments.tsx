import React from "react";
import {
  Button,
  Card,
  InputAdornment,
  OutlinedInput,
  SvgIcon,
} from "@mui/material";
import MagnifyingGlassIcon from "@heroicons/react/24/solid/MagnifyingGlassIcon";

interface SearchTreatmentsInterface {
  value: string;
  onChange?: any;
  onKeyDown?: any;
  onClick?: any;
}

const SearchTreatments = (props: SearchTreatmentsInterface) => {
  return (
    <Card
      sx={{
        p: 2,
        display: "flex",
        columnGap: "16px",
        width: "95%",
        margin: "1rem 0",
      }}
    >
      <OutlinedInput
        defaultValue=""
        value={props.value}
        onChange={props.onChange}
        onKeyDown={props.onKeyDown}
        fullWidth
        placeholder="Buscar Tratamento"
        startAdornment={
          <InputAdornment position="start">
            <SvgIcon color="action" fontSize="small">
              <MagnifyingGlassIcon />
            </SvgIcon>
          </InputAdornment>
        }
        sx={{ maxWidth: 500 }}
      />
      <Button variant="contained" onClick={props.onClick}>
        Buscar
      </Button>
    </Card>
  );
};

export default SearchTreatments;
