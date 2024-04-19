/* eslint-disable @next/next/no-img-element */
//@ts-nocheck
import React, { useState } from "react";
import { headerData } from "data";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import CloseIcon from "@mui/icons-material/Close";
import { useRouter } from "next/router";
import useWindowSize from "@/hooks/useWindowSize";
import { Box, IconButton, styled, Typography } from "@mui/material";
import { Carousel } from "react-responsive-carousel";
import Image from "next/image";
import Link from "next/link";
import BannerLanding from "../banner";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import "react-responsive-carousel/lib/styles/carousel.min.css";

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
  const [hasIp, setHasIp] = useState<boolean | null>(null);

  const HeaderContainer = styled(Box)`
    position: relative;
    min-height: ${router.pathname !== "/" ? "0px" : "100vh"};
    max-height: 100vh;
  `;

  const openMenu = (e?: any) => setIconMenu(!iconMenu);

  const listItem = ({ item, index }: any) => {
    return (
      <ListBox
        key={index}
        passHref
        href={item.path}
        hasPath={router.pathname === item.path}
      >
        <List
          variant="subtitle1"
          sx={{ cursor: "pointer" }}
          fontWeight={router.pathname === item.path && "bold"}
        >
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
    transition: 0.7s;
    @media screen and (max-width: 900px) {
      display: ${iconMenu ? "none" : "flex"};
      flex-direction: column;
      background-color: #222;
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
          src={"/images/cemicLogo.png"}
          onClick={async () => await router.push("/")}
        />
        <ListContainer ref={props.refMenu}>
          {headerData.map((item, index) => listItem({ item, index }))}
        </ListContainer>

        {size.width! < 900 && renderIconMenu()}
      </HeaderListContainer>
      <Box>
        <Carousel
          autoPlay
          animationHandler={"fade"}
          infiniteLoop
          showStatus={false}
          showIndicators={false}
          renderArrowNext={(handleClick) => (
            <IconArrow direction="right" onClick={handleClick}>
              <ArrowForwardIcon sx={{ color: "white" }} />
            </IconArrow>
          )}
          renderArrowPrev={(handleClick) => (
            <IconArrow direction="left" onClick={handleClick}>
              <ArrowBackIcon sx={{ color: "white" }} />
            </IconArrow>
          )}
        >
          <BannerLanding coverImage="/images/v2/background.png" />
        </Carousel>
      </Box>
    </HeaderContainer>
  );
};

const IconArrow = styled(IconButton)<{ direction: "left" | "right" }>`
  position: absolute;
  z-index: 10;
  top: 50%;
  left: ${({ direction }) => (direction === "left" ? 0 : undefined)};
  right: ${({ direction }) => (direction === "right" ? 0 : undefined)};
  transform: translateY(-50%);
`;

const HeaderListContainer = styled(Box)`
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 4;
  width: 100%;
  padding: 1.5rem 4rem;
`;

const ListBox = styled(Link)<{ hasPath: boolean }>`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: space-around;
  margin: 0 16px;
  transition: 0.3s;
  text-decoration: none;
  color: ${({ hasPath }) => (hasPath ? "var(--dark-blue)" : "white")};
  :hover {
    color: var(--blue);
    font-weight: bold;
    background-color: #555;
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
    color: white;
    :last-child {
      margin-bottom: 6px;
    }
  }
`;

const StyledImg = styled("img")`
  cursor: pointer;
  width: 208px;
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
