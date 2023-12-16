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
      <Typography variant="subtitle2">
        CEMIC © Compartilhe essa ideia!
      </Typography>
      <Typography variant="caption">Todos Direitos Reservados.</Typography>

      <LinksContainer>
        <LinkSingle href="#about">Sobre</LinkSingle>
        <LinkSingle href="" onClick={(e) => props.setActiveTab(1)}>
          Ajude-nos
        </LinkSingle>
        <LinkSingle href="/auth/login">Já é parceiro?</LinkSingle>
      </LinksContainer>

      <LinksSocials>
        <Link
          passHref
          href="https://facebook.com/tratamentocemic"
          target="_blank"
        >
          <SvgIcon fontSize="large">
            <Facebook />
          </SvgIcon>
        </Link>
        <Link passHref href="https://instagram.com/cemic_" target="_blank">
          <SvgIcon fontSize="large">
            <Instagram sx={{ color: "var(--dark-blue)" }} />
          </SvgIcon>
        </Link>
      </LinksSocials>

      <Typography variant="caption">
        © 2023 desenvolvido por <Link href={sofx}>SOFX - Softwares</Link>
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
  width: 50px;
  height: 50px;
`;
const LinksContainer = styled(Box)`
  background-color: #e4e4e4;
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
  color: var(--dark-blue);
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
const Facebook = styled(FacebookIcon)`
  color: var(--dark-blue);
  font-size: 1rem;
  :hover {
    color: var(--red);
  }
`;
const Instagram = styled(InstagramIcon)`
  color: var(--dark-blue);
  :hover {
    color: var(--red);
  }
`;

export default Footer;
