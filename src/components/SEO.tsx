import Head from "next/head";

interface SEOProps {
  title: string;
  description?: string;
}

const defaultDescription =
  "CEMIC · Tratamento de Implante em Brasília; Tratamento de Implante em Minas Gerais; Implantes Dentários é com a CEMIC; Faça seu implante e pague só o material! Implantes Dentários;";
const defaultSiteName = "CEMIC - Centro Médico e de Implantes Comunitários"; // personalize

const SEO = ({ title, description = defaultDescription }: SEOProps) => {
  return (
    <Head>
      <title>{`${title} | ${defaultSiteName}`}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
  );
};

export default SEO;
