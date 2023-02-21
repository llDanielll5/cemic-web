/* eslint-disable @next/next/no-img-element */
import Head from "next/head";
import styles from "@/styles/Landing.module.css";
import { headerData } from "data";
import { IoLogoWhatsapp } from "react-icons/io";
import { GiHamburgerMenu } from "react-icons/gi";
import { useGetScrollPosition } from "@/hooks/useGetScrollPosition";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import About from "@/components/about";
import ContactForm from "@/components/contact";
import useWindowSize from "@/hooks/useWindowSize";

export default function LandingPage() {
  const router = useRouter();
  const size = useWindowSize();
  const refMenu = useRef<HTMLUListElement>(null);
  const currentScroll = useGetScrollPosition();
  const [menuMobile, setMenuMobile] = useState(false);

  const msg = `Olá!! 
Gostaria de realizar o agendamento para conhecer melhor o projeto social que a CEMIC faz.`;
  const zapHref = `https://api.whatsapp.com/send?phone=5561986573056&text=${encodeURIComponent(
    msg
  )}`;

  const openMenu = useCallback(
    (e?: any) => {
      const list = refMenu?.current?.style;
      if (!menuMobile && size?.width! < 760) {
        setMenuMobile(true);
        list?.setProperty("display", "flex");
      } else if (menuMobile && size?.width! < 760) {
        setMenuMobile(false);
        list?.setProperty("display", "none");
      }
    },
    [menuMobile, size.width]
  );

  const scrollUp = useCallback(() => {
    const scroll_up = document.getElementById("scroll_up");
    if (currentScroll > 100) {
      scroll_up?.classList.add("show-scroll");
    } else scroll_up?.classList.remove("show-scroll");
  }, [currentScroll]);

  const changeRouter = useCallback(() => {
    const routerPath = router.pathname;
    const list = refMenu?.current?.style;
    if (size?.width! > 760) {
      setMenuMobile(false);
      list?.setProperty("display", "flex");
    }
  }, [router.pathname, size?.width]);

  useEffect(() => {
    scrollUp();
    changeRouter();
  }, [changeRouter, scrollUp]);
  return (
    <>
      <Head>
        <title>CEMIC</title>
        <meta
          name="description"
          content="Centro Médico e de Implantes Comunitário"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles["header-container"]}>
        <img
          src="/images/cemicLogo.png"
          alt="cemic logo"
          className={styles.logocemic}
        />

        <ul className={styles["list-container"]} ref={refMenu}>
          {headerData.map((item, index) => (
            <li key={index} className={styles["list-item"]}>
              <a href={item.path}>{item.title}</a>
            </li>
          ))}
        </ul>

        <GiHamburgerMenu className={styles["icon-menu"]} onClick={openMenu} />
      </div>

      <section className={styles.informations}>
        <div className={styles.sideTitle}>
          <h2>
            A Oportunidade perfeita para você realizar o sonho de novamente
            sorrir está na <span>CEMIC</span>
          </h2>
          <h2>Que conta com uma história de:</h2>
          <p>
            <span>+5</span> mil pacientes restaurados
          </p>
          <p>
            <span>+10</span> mil implantes instalados
          </p>
          <p>
            <span>+50</span> atendimentos por dia
          </p>
        </div>
        <div className={styles["icone-seta"]} />
      </section>

      <About />

      <ContactForm />

      <footer className={styles.footer}>
        <div className={styles["container-footer"]}>
          <img
            src="images/logo.png"
            alt="sua logo"
            className={styles["logo-footer"]}
          />
          <h3>CEMIC© Compartilhe essa ideia!</h3>
          <p>Todos os direitos reservados.</p>
          <p>Contato: (61) 3083-3075 | (61) 98657-3056</p>
        </div>
      </footer>

      <a
        href={zapHref}
        className="scrollup"
        id="scroll_up"
        target={"_blank"}
        rel="noreferrer"
      >
        <IoLogoWhatsapp className="whatsapp" color="#7f5" />
      </a>
    </>
  );
}
