//@ts-nocheck

import { LandingLayout } from "@/layouts/landing";
import Help from "@/components/landing/help";

export default function HelpPage() {
  return <Help />;
}

HelpPage.getLayout = (page: any) => <LandingLayout>{page}</LandingLayout>;
