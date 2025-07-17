import { useCallback } from "react";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Checkbox,
  Divider,
  FormControlLabel,
  Stack,
  Typography,
  Unstable_Grid2 as Grid,
  Accordion,
  AccordionDetails,
} from "@mui/material";
import PermissionsAccordion from "./accordion-permissions";

export const SettingsNotifications = () => {
  const handleSubmit = useCallback((event: any) => {
    event.preventDefault();
  }, []);

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader
          subheader="Altere as permissões de seus Usuários"
          title="Permissões de Usuários"
        />
        <Divider />
        <CardContent>
          <PermissionsAccordion />
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: "flex-end" }}>
          <Button variant="contained">Save</Button>
        </CardActions>
      </Card>
    </form>
  );
};
