/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import useWindowSize from "@/hooks/useWindowSize";
import styles from "@/styles/Landing.module.css";
import { Box, IconButton, Typography } from "@mui/material";
import Left from "@mui/icons-material/ChevronLeft";
import Right from "@mui/icons-material/ChevronRight";
import FormLanding from "../form";

const imagesBanner = [
  //   "/images/banner.png",
  "/images/banner1.png",
  "/images/banner2.png",
];
const imgStyle: React.CSSProperties = {
  width: "100%",
  height: "100vh",
  maxHeight: "100vh",
  transition: "0.3s",
};
const iconStyle = {
  transform: { translateY: "-50%" },
  backgroundColor: "white",
  position: "absolute",
  top: "50%",
};

const BannerLanding = () => {
  const [imgIndex, setImgIndex] = useState(0);

  const handleNextImg = () => {
    if (imgIndex === imagesBanner.length - 1) return setImgIndex(0);
    else return setImgIndex((prev) => prev + 1);
  };
  const handlePreviousImg = () => {
    if (imgIndex === 0) return setImgIndex(imagesBanner.length - 1);
    else return setImgIndex((prev) => prev - 1);
  };

  const renderImageBanner = () => (
    <Box position="relative">
      <Box
        top={0}
        left={0}
        width={"100%"}
        height={"100vh"}
        position="absolute"
        sx={{ backgroundColor: "black", opacity: "0.3" }}
      />
      <img src={imagesBanner[imgIndex]} alt="" style={{ ...imgStyle }} />;
      <FormLanding />
      <IconButton
        sx={{ ...iconStyle, left: "16px" }}
        onClick={handlePreviousImg}
      >
        <Left fontSize="large" />
      </IconButton>
      <IconButton sx={{ ...iconStyle, right: "16px" }} onClick={handleNextImg}>
        <Right fontSize="large" />
      </IconButton>
      <Box>
        <h1>
          <span>I</span>
          <span>N</span>
          <span>F</span>
          <span>O</span>
          <span>R</span>
          <span>M</span>
          <span>A</span>
          <span>T</span>
          <span>I</span>
          <span>V</span>
          <span>O</span>
          <span>S</span>
        </h1>
      </Box>
      <h2 style={{ textAlign: "center", margin: "1rem 0 1rem 0" }}>
        Ainda não há informativos ou blogs
      </h2>
    </Box>
  );

  return (
    <Box mb={2}>
      <section>{renderImageBanner()}</section>
    </Box>
  );
};

export default BannerLanding;
