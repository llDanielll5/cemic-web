/* eslint-disable @next/next/no-img-element */
import React from "react";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import Link from "next/link";
import { Box, styled, SvgIcon, Typography } from "@mui/material";

const Footer = (props: any) => {
  let sofx = "https://sofx.vercel.app";

  return (
    <FooterContainer>
      <FooterLogo src={"/images/logo.png"} alt="" />
      <Typography variant="subtitle1">
        CEMIC © Compartilhe essa ideia!
      </Typography>
      <Typography variant="caption">Todos Direitos Reservados.</Typography>

      <LinksContainer>
        <LinkSingle href="/#about">Sobre</LinkSingle>
        <LinkSingle href="/#help">Ajude-nos</LinkSingle>
        <LinkSingle href="/auth/login">Já é parceiro?</LinkSingle>
      </LinksContainer>

      <LinksSocials>
        <Link
          passHref
          href="https://facebook.com/tratamentocemic"
          target="_blank"
        >
          <IconStyle fontSize="large">
            <Facebook />
          </IconStyle>
        </Link>
        <Link passHref href="https://instagram.com/cemic_" target="_blank">
          <IconStyle fontSize="large">
            <Instagram sx={{ color: "var(--dark-blue)" }} />
          </IconStyle>
        </Link>
      </LinksSocials>

      <Typography variant="caption" fontWeight={"bold"}>
        © 2024 desenvolvido por <Link href={sofx}>SOFX - Softwares</Link>
      </Typography>
    </FooterContainer>
  );
};

const FooterContainer = styled("footer")`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 2rem 0 5rem 0;
`;
const FooterLogo = styled("img")`
  width: 70px;
  height: 70px;
`;
const LinksContainer = styled(Box)`
  background-color: var(--blue);
  width: 100%;
  justify-content: center;
  display: flex;
  column-gap: 5rem;
  padding: 1rem 0;
  margin: 2rem 0;
  @media screen and (max-width: 550px) {
    column-gap: 2rem;
  }
  @media screen and (max-width: 400px) {
    flex-direction: column;
    align-items: center;
  }
`;
const LinkSingle = styled(Link)`
  text-decoration: none;
  font-family: "Quicksand", sans-serif;
  font-weight: 700;
  color: white;
  :hover {
    opacity: 0.8;
  }
`;
const LinksSocials = styled(Box)`
  width: 30%;
  justify-content: center;
  display: flex;
  column-gap: 1rem;
`;

const IconStyle = styled(SvgIcon)`
  transition: 0.3s;
  :hover {
    scale: 2;
  }
  :hover :first-child {
    color: var(--blue);
  }
`;
const Facebook = styled(FacebookIcon)`
  color: var(--dark-blue);
  font-size: 16px;
`;
const Instagram = styled(InstagramIcon)`
  color: var(--dark-blue);
  font-size: 16px;
`;

export default Footer;
