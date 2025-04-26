/* eslint-disable @next/next/no-img-element */
import About from "@/components/landing/about";
import Help from "@/components/landing/help";
import AboutUsSection from "@/components/lpv2/aboutus";
import TargetAudienceSection from "@/components/lpv2/audience";
import Hero from "@/components/lpv2/hero";
import MapSection from "@/components/lpv2/maps";
import { LandingLayout } from "@/layouts/landing";
import { Stack } from "@mui/material";

export default function LandingPage() {
  return (
    <Stack>
      <Hero />
      <TargetAudienceSection />
      <AboutUsSection />
      <Help />
      <MapSection />
    </Stack>
  );
}

LandingPage.getLayout = (page: any) => <LandingLayout>{page}</LandingLayout>;
