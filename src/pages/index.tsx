/* eslint-disable @next/next/no-img-element */

import { useGetScrollPosition } from "@/hooks/useGetScrollPosition";
import { useCallback, useEffect, useRef } from "react";
import useWindowSize from "@/hooks/useWindowSize";
import BannerLanding from "@/components/landing/banner";
import { Box } from "@mui/material";
import { LandingLayout } from "@/layouts/landing";

export default function LandingPage() {
  const size = useWindowSize();
  const refMenu = useRef<HTMLDivElement>(null);
  const currentScroll = useGetScrollPosition();
  const aboutRef = useRef<HTMLDivElement>(null);

  const scrollUp = useCallback(() => {
    const scroll_up = document.getElementById("scroll_up");
    if (currentScroll > 100) {
      scroll_up?.classList.add("show-scroll");
    } else scroll_up?.classList.remove("show-scroll");
  }, [currentScroll]);

  const getActiveScroll = useCallback(() => {
    const about = document?.getElementById("about");
    const help = document?.getElementById("help");
    const contact = document?.getElementById("contact");

    const opacityNone = () => {
      about?.style?.setProperty("opacity", "0");
      help?.style?.setProperty("opacity", "0");
      contact?.style?.setProperty("opacity", "0");
    };
    opacityNone();
    if (currentScroll > 100) {
      about?.style?.setProperty("opacity", "1");
      help?.style?.setProperty("opacity", "0");
    } else {
      about?.style?.setProperty("opacity", "0");
      help?.style?.setProperty("opacity", "1");
    }
    // if (activeTab === 2) {
    //   help?.style?.setProperty("opacity", "1");
    // } else help?.style?.setProperty("opacity", "0");
  }, [currentScroll]);

  useEffect(() => {
    getActiveScroll();
  }, [getActiveScroll]);

  useEffect(() => {
    const changeRouter = () => {
      const list = refMenu?.current?.style;
      if (size?.width! > 900) list?.setProperty("display", "flex");
      else list?.setProperty("display", "none");
    };
    scrollUp();
    changeRouter();
  }, [scrollUp, size?.width]);

  return (
    <Box position="relative" zIndex={0}>
      <BannerLanding aboutRef={aboutRef} />
    </Box>
  );
}

LandingPage.getLayout = (page: any) => <LandingLayout>{page}</LandingLayout>;
