//@ts-nocheck
/* eslint-disable @next/next/no-img-element */
import { IoLogoWhatsapp } from "react-icons/io";
import { useGetScrollPosition } from "@/hooks/useGetScrollPosition";
import { useCallback, useEffect, useRef, useState } from "react";
import About from "@/components/about";
import useWindowSize from "@/hooks/useWindowSize";
import Help from "@/components/help";
import Footer from "@/components/footer";
import HeadLanding from "@/components/landing/head";
import HeaderLanding from "@/components/landing/header";
import BannerLanding from "@/components/landing/banner";

export default function LandingPage() {
  const size = useWindowSize();
  const refMenu = useRef<HTMLUListElement>(null);
  const currentScroll = useGetScrollPosition();
  const [activeTab, setActiveTab] = useState(0);
  const aboutRef = useRef<HTMLDivElement>(null);

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

    const opacityNone = () => {
      about?.style?.setProperty("opacity", "0");
      help?.style?.setProperty("opacity", "0");
      contact?.style?.setProperty("opacity", "0");
    };

    // if (currentScroll > 30) about?.style?.setProperty("opacity", "1");
    // if (currentScroll > help?.offsetHeight)
    //   help?.style?.setProperty("opacity", "1");
    // if (currentScroll > contact?.offsetHeight)
    //   contact?.style?.setProperty("opacity", "1");
    // if (currentScroll < contact?.offsetHeight)
    //   contact?.style?.setProperty("opacity", "0");
    // if (currentScroll < help?.offsetHeight)
    //   help?.style?.setProperty("opacity", "0");
    // if (currentScroll < 30) about?.style?.setProperty("opacity", "0");
    opacityNone();
    if (activeTab === 1) {
      about?.style?.setProperty("opacity", "1");
      help?.style?.setProperty("opacity", "0");
    } else if (activeTab === 2) {
      about?.style?.setProperty("opacity", "0");
      help?.style?.setProperty("opacity", "1");
    }
  }, [activeTab]);

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
    <>
      <HeadLanding />
      <HeaderLanding refMenu={refMenu} setTabIndex={setActiveTab} />
      {activeTab === 0 && <BannerLanding setTabIndex={setActiveTab} />}
      {activeTab === 1 && <About ref={aboutRef} />}
      {activeTab === 2 && <Help />}
      <Footer />

      <a
        href={zapHref}
        className="scrollup"
        id="scroll_up"
        target={"_blank"}
        rel="noreferrer"
      >
        <IoLogoWhatsapp className="whatsapp" color="#34af23" />
      </a>
    </>
  );
}
