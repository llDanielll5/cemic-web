import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Grid,
  Avatar,
  Stack,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SettingsPermissions from "./settings-permissions";

const PermissionsAccordion = () => {
  return (
    <Accordion sx={{ borderRadius: 2, boxShadow: 2 }}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="permissions-content"
        id="permissions-header"
      >
        <Stack direction={"row"} alignItems={"center"} gap={2}>
          <Avatar>A</Avatar>
          <Typography variant="h6">Alterar Permissões de ((Daniel))</Typography>
        </Stack>
      </AccordionSummary>

      <AccordionDetails>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <SettingsPermissions />
          </Grid>
          <Grid item xs={12} md={6}>
            <SettingsPermissions />
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};

export default PermissionsAccordion;
