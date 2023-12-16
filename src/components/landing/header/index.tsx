/* eslint-disable @next/next/no-img-element */
//@ts-nocheck
import React, { useState } from "react";
import { headerData } from "data";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import CloseIcon from "@mui/icons-material/Close";
import { useRouter } from "next/router";
import useWindowSize from "@/hooks/useWindowSize";
import { Box, styled, Typography } from "@mui/material";
import Image from "next/image";
import { width } from "@mui/system";
import Link from "next/link";

interface HeaderLandingProps {
  refMenu: any;
  setTabIndex: (e: number) => void;
  activeTab: any;
}

const HeaderLanding = (props: HeaderLandingProps) => {
  const router = useRouter();
  const size = useWindowSize();
  const [iconMenu, setIconMenu] = useState(true);
  const list = props.refMenu?.current?.style;

  const HeaderContainer = styled(Box)`
    width: 45%;
    display: flex;
    align-items: flex-start;
    position: relative;
    min-height: ${router.pathname !== "/" ? "0px" : "500px"};
    background-color: white;
    @media screen and (max-width: 1200px) {
      width: 56%;
    }
    @media screen and (max-width: 900px) {
      width: 100%;
    }
  `;

  const openMenu = (e?: any) => setIconMenu(!iconMenu);

  const listItem = ({ item, index }: any) => {
    return (
      <ListBox key={index} passhref href={item.path}>
        <List variant="subtitle1" sx={{ cursor: "pointer" }}>
          {item.title}
        </List>
      </ListBox>
    );
  };

  const renderIconMenu = () => {
    if (!iconMenu) return <CloseIcon fontSize="large" onClick={openMenu} />;
    else return <MenuOpenIcon fontSize="large" onClick={openMenu} />;
  };

  const ListContainer = styled("ul")`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    transition: 0.7s;
    @media screen and (max-width: 900px) {
      display: ${iconMenu ? "none" : "flex"};
      flex-direction: column;
      background-color: white;
      z-index: 10;
      position: absolute;
      top: 100px;
      left: 0;
      width: 100%;
    }
  `;

  return (
    <HeaderContainer>
      <HeaderListContainer>
        <StyledImg
          alt="cemic logo"
          src={size?.width < 900 ? "/images/cemicLogo.png" : "/images/logo.png"}
          onClick={async () => await router.push("/")}
        />
        <ListContainer ref={props.refMenu}>
          {headerData.map((item, index) => listItem({ item, index }))}
        </ListContainer>

        {router.pathname === "/" && size?.width > 900 && (
          <SVGImage
            priority
            src={"/images/middle-landing.svg"}
            width={300}
            height={500}
            alt=""
          />
        )}

        {size.width < 900 && renderIconMenu()}
      </HeaderListContainer>
    </HeaderContainer>
  );
};

const HeaderListContainer = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: white;
  width: 100%;
  padding: 1.5rem 4rem;
`;

const ListBox = styled(Link)`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: space-around;
  margin: 0 16px;
  transition: 0.3s;
  text-decoration: none;
  color: var(--dark-blue);
  :hover {
    color: var(--blue);
    font-weight: bold;
  }

  @media screen and (max-width: 900px) {
    border-top: 1.3px solid #bbb;
    width: 100%;
    :last-child {
      border-bottom: 1.5px solid #aaa;
    }
  }
`;
const List = styled(Typography)`
  @media screen and (max-width: 900px) {
    padding: 8px 0;
    z-index: 100000;
    :last-child {
      margin-bottom: 6px;
    }
  }
`;

const StyledImg = styled("img")`
  cursor: pointer;
  width: 50px;
  :hover {
    opacity: 0.8;
  }
  @media screen and (max-width: 900px) {
    width: 150px;
  }
`;

const SVGImage = styled(Image)`
  position: absolute;
  left: 100%;
  z-index: 2;
  top: 0;

  @media screen and (max-width: 1200px) {
    left: 95%;
  }
  @media screen and (max-width: 900px) {
    display: none;
  }

  @media screen and (min-width: 1600px) {
    left: 105%;
  }
  @media screen and (min-width: 1700px) {
    left: 110%;
  }
`;

export default HeaderLanding;
