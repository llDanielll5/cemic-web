/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import { headerData } from "data";
import { GiHamburgerMenu } from "react-icons/gi";
import { AiOutlineClose } from "react-icons/ai";
import styles from "@/styles/Landing.module.css";
import { useRouter } from "next/router";
import useWindowSize from "@/hooks/useWindowSize";
import { Box, styled, Typography } from "@mui/material";

interface HeaderLandingProps {
  refMenu: any;
  setTabIndex: (e: number) => void;
}

const HeaderLanding = (props: HeaderLandingProps) => {
  const router = useRouter();
  const size = useWindowSize();
  const [iconMenu, setIconMenu] = useState(true);
  const list = props.refMenu?.current?.style;

  const openMenu = (e?: any) => {
    if (list?.display === "none" && size?.width! < 900) {
      list?.setProperty("display", "flex");
      setIconMenu(false);
    } else if (list?.display === "flex" && size?.width! < 900) {
      list?.setProperty("display", "none");
      setIconMenu(true);
    }
  };

  const listItem = ({ item, index }: any) => {
    const handlePress = () => {
      props.setTabIndex(index);
      if (size?.width! < 900) {
        list?.setProperty("display", "none");
        setIconMenu(true);
      }
      return;
    };
    return (
      <ListBox key={index} onClick={handlePress}>
        <List
          variant="semibold"
          onClick={handlePress}
          sx={{ cursor: "pointer" }}
        >
          {item.title}
        </List>
      </ListBox>
    );
  };

  const renderIconMenu = () => {
    if (!iconMenu)
      return (
        <AiOutlineClose className={styles["icon-menu"]} onClick={openMenu} />
      );
    else
      return (
        <GiHamburgerMenu className={styles["icon-menu"]} onClick={openMenu} />
      );
  };
  return (
    <HeaderContainer>
      <img
        alt="cemic logo"
        src="/images/cemicLogo.png"
        className={styles.logocemic}
        style={{ cursor: "pointer" }}
        onClick={async () => await router.push("/")}
      />
      <ul className={styles["list-container"]} ref={props.refMenu}>
        {headerData.map((item, index) => listItem({ item, index }))}
      </ul>
      {renderIconMenu()}
    </HeaderContainer>
  );
};

const HeaderContainer = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 24px;
`;
const ListBox = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin: 0 16px;

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

export default HeaderLanding;
