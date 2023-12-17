import { LandingLayout } from "@/layouts/landing";
import { Box } from "@mui/material";

export default function ContactPage() {
  return <Box />;
}

ContactPage.getLayout = (page: any) => <LandingLayout>{page}</LandingLayout>;
