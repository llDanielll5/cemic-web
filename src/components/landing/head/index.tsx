import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";

const HeadLanding = () => {
  const router = useRouter();

  const dynamicTitle =
    router.pathname === "/"
      ? "CEMIC - Centro Médico e de Implantes Comunitário"
      : router.pathname === "/#about"
      ? "Conheça um pouco mais sobre a maior ONG de serviços odontológicos de BSB"
      : router.pathname === "/help"
      ? "Ajude a construir o sonho de alguém aqui na CEMIC."
      : "Entre em contato conosco";
  return (
    <Head>
      <title>{dynamicTitle}</title>

      <meta
        name="description"
        content="Centro Médico e de Implantes Comunitário"
      />
      <meta name="author" content="Sofx Softwares Inteligentes" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta
        name="keywords"
        content="cemic, cemicdf, implantes, implante comunitario, brasilia, cemic brasilia, ong, ongcemic, ong brasilia, ong dentes, dentes, protese, ortodontia"
      />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
};

export default HeadLanding;
