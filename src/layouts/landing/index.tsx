/* eslint-disable @next/next/no-img-element */
import PropTypes from "prop-types";
import { Box, styled } from "@mui/material";
import HeadLanding from "@/components/landing/head";
import HeaderLanding from "@/components/landing/header";
import useWindowSize from "@/hooks/useWindowSize";
import { useCallback, useEffect, useRef, useState } from "react";
import { useGetScrollPosition } from "@/hooks/useGetScrollPosition";
import { useRouter } from "next/router";
import Footer from "@/components/landing/footer";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import BannerLanding from "@/components/landing/banner";

export const LandingLayout = (props: any) => {
  const { children } = props;

  const size = useWindowSize();
  const refMenu = useRef<HTMLDivElement>(null);
  const currentScroll = useGetScrollPosition();
  const [activeTab, setActiveTab] = useState(0);
  const router = useRouter();

  const msg = `Olá!! Gostaria de realizar o agendamento para conhecer melhor o projeto social que a CEMIC faz.`;
  const zapHref = `https://api.whatsapp.com/send?phone=5561986573056&text=${encodeURIComponent(
    msg
  )}`;

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

    if (currentScroll > 100) {
      about?.style?.setProperty("opacity", "1");
    } else if (currentScroll < 100) {
      about?.style?.setProperty("opacity", "0");
    } else if (currentScroll > 10 && router.pathname === "/help") {
      help?.style?.setProperty("opacity", "1");
    } else if (currentScroll < 10 && router.pathname === "/help") {
      help?.style?.setProperty("opacity", "0");
    }
  }, [currentScroll, router.pathname]);

  useEffect(() => {
    getActiveScroll();
  }, [getActiveScroll, activeTab]);

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
      <HeadLanding />

      <HeaderLanding
        refMenu={refMenu}
        setTabIndex={setActiveTab}
        activeTab={activeTab}
      />

      {children}
      <Footer setActiveTab={setActiveTab} />

      <a
        href={zapHref}
        className="scrollup"
        id="scroll_up"
        target={"_blank"}
        rel="noreferrer"
      >
        <WhatsAppIcon sx={{ color: "white" }} fontSize="large" />
      </a>
    </Box>
  );
};

LandingLayout.prototypes = {
  children: PropTypes.node,
};
