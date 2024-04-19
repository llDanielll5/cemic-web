/* eslint-disable @next/next/no-img-element */
import About from "@/components/landing/about";
import { LandingLayout } from "@/layouts/landing";

export default function LandingPage() {
  return <About />;
}

LandingPage.getLayout = (page: any) => <LandingLayout>{page}</LandingLayout>;
