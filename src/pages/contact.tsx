import { LandingLayout } from "@/layouts/landing";
import { Box, Typography } from "@mui/material";

export default function ContactPage() {
  return (
    <Box>
      <Typography variant="h5">
        Novos pacientes: <span>(61) 3083-3075</span>
      </Typography>
      <Typography variant="h5">
        Pacientes Brasília e Entorno: <span>(61) 99379-5285</span>
      </Typography>
      {/* <Typography variant='h5'>Novos pacientes: <span>(61) 3083-3075</span></Typography> */}
    </Box>
  );
}

ContactPage.getLayout = (page: any) => <LandingLayout>{page}</LandingLayout>;
