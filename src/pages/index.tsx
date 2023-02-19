/* eslint-disable @next/next/no-img-element */
import Head from "next/head";
import styles from "@/styles/Landing.module.css";
import { headerData } from "data";
import { GrMoney } from "react-icons/gr";
import { BsWhatsapp } from "react-icons/bs";
import { IoMdBusiness } from "react-icons/io";
import { GiHamburgerMenu } from "react-icons/gi";
import { HiOutlineIdentification } from "react-icons/hi";
import { useGetScrollPosition } from "@/hooks/useGetScrollPosition";
import { useCallback, useEffect } from "react";
import { useRouter } from "next/router";

export default function LandingPage() {
  const router = useRouter();
  const currentScroll = useGetScrollPosition();
  const msg = `Olá!! 
Gostaria de realizar o agendamento para conhecer melhor o projeto social que a CEMIC faz.`;
  const zapHref = `https://api.whatsapp.com/send?phone=5561986573056&text=${encodeURIComponent(
    msg
  )}`;

  const openMenu = () => {
    const list = document.getElementById("list-container");
    if (list?.style.display === "none") {
      list?.style.setProperty("display", "flex");
      list?.style.setProperty("opacity", "1");
    } else {
      list?.style?.setProperty("display", "none");
      list?.style.setProperty("opacity", "0");
    }
  };

  const scrollUp = useCallback(() => {
    const scroll_up = document.getElementById("scroll_up");
    if (currentScroll > 100) {
      scroll_up?.classList.add("show-scroll");
    } else scroll_up?.classList.remove("show-scroll");
  }, [currentScroll]);

  const changeRouter = useCallback(() => {
    const routerPath = router.pathname;
    if (routerPath !== "/") {
      openMenu();
    } else null;
  }, [router]);

  useEffect(() => {
    scrollUp();
    changeRouter();
  }, [scrollUp, changeRouter]);
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

        <ul className={styles["list-container"]} id="list-container">
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

      <section className={styles.about} id={"about"}>
        <h3>O que é a CEMIC?</h3>

        <div className={styles["about-container"]}>
          <IoMdBusiness className={styles["about-icon"]} />
          <p>
            A CEMIC é uma Organização Não Governamental, voltada para a
            reabilitação oral de pacientes que não possuem dentes ou perderam,
            por meio de implantes dentários.
          </p>
        </div>
        <div className={styles["about-container"]}>
          <HiOutlineIdentification className={styles["about-icon"]} />
          <p>
            Funcionando como intermediador do paciente, a CEMIC, realiza a
            compra de materiais para uma cirurgia, com a ajuda de dentistas
            voluntários.
          </p>
        </div>
        <div className={styles["about-container"]}>
          <GrMoney className={styles["about-icon"]} />
          <p>
            Com isso a CEMIC pode então realizar os procedimentos, com a ajuda
            do paciente, pagando apenas o material completo de sua cirurgia.
          </p>
        </div>
      </section>

      <section className={styles.banner}>
        <div className={styles["double-column-banner"]}>
          <img
            src="/images/pedro.jpg"
            alt="consultório"
            className={styles["img-founder"]}
          />
          <p>
            Fundada por Pedro Benevides em 2013, a CEMIC, vem desde então
            reabilitando pacientes nas diversas áreas da odontologia, com foco
            em reabillitações por Implantes Dentários!
          </p>
        </div>
      </section>

      <section className={styles.contact} id={"contact"}>
        <h2>
          Preencha o formulário abaixo para se cadastrar na <span>CEMIC</span>,
          e tentar a sua vaga.
        </h2>
        <div className={styles["contact-container"]}>
          <form>
            <h4>
              Qual tratamento você necessita? <span>*</span>
            </h4>
            <input type="text" />

            <h4>
              Qual desses dias da semana têm disponibilidade? <span>*</span>
            </h4>
            <p>dropdown</p>

            <h4>
              Informe seu nome completo <span>*</span>
            </h4>
            <input type="text" />

            <h4>
              Informe seu telefone <span>*</span>
            </h4>
            <input type="text" />

            <input type="submit" value={"Perguntar"} />
          </form>
        </div>

        <p>Campos * são obrigatórios!</p>
      </section>

      <footer className={styles.footer}>
        <div className={styles["container-footer"]}>
          <img
            src="images/logo.png"
            alt="sua logo"
            className={styles["logo-footer"]}
          />
          <p>CEMIC© Todos os direitos reservados.</p>
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
        <BsWhatsapp className="whatsapp" stopColor="#c5c5c5" color="#7f5" />
      </a>
    </>
  );
}
