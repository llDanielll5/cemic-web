import MagnifyingGlassIcon from "@heroicons/react/24/solid/MagnifyingGlassIcon";
import { Card, InputAdornment, OutlinedInput, SvgIcon } from "@mui/material";

interface SearchProps {
  placeholder?: string;
  onChange: (e: string) => void;
  value?: string;
}

export const CompaniesSearch = (props: SearchProps) => {
  const { placeholder, onChange, value } = props;

  return (
    <Card sx={{ p: 2 }}>
      <OutlinedInput
        value={value}
        onChange={(e) => onChange(e.target.value)}
        defaultValue=""
        fullWidth
        placeholder={placeholder ?? "Buscar"}
        startAdornment={
          <InputAdornment position="start">
            <SvgIcon color="action" fontSize="small">
              <MagnifyingGlassIcon />
            </SvgIcon>
          </InputAdornment>
        }
        sx={{ maxWidth: 500 }}
      />
    </Card>
  );
};
