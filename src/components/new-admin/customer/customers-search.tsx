import MagnifyingGlassIcon from "@heroicons/react/24/solid/MagnifyingGlassIcon";
import {
  Button,
  Card,
  InputAdornment,
  OutlinedInput,
  SvgIcon,
} from "@mui/material";

interface CustomerSearchInterface {
  value: string;
  onChange?: any;
  onKeyDown?: any;
  onClick?: any;
}

export const CustomersSearch = (props: CustomerSearchInterface) => (
  <Card sx={{ p: 2, display: "flex", columnGap: "16px" }}>
    <OutlinedInput
      defaultValue=""
      value={props.value}
      onChange={props.onChange}
      onKeyDown={props.onKeyDown}
      fullWidth
      placeholder="Buscar paciente por CPF"
      inputProps={{ maxLength: 11 }}
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
