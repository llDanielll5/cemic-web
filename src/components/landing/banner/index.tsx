/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import styles from "@/styles/Landing.module.css";
import { Box, Button, Typography, styled } from "@mui/material";
import Left from "@mui/icons-material/ChevronLeft";
import Right from "@mui/icons-material/ChevronRight";
import FormLanding from "../form";

const imagesBanner = [
  //   "/images/banner.png",
  "/images/banner1.png",
  "/images/banner2.png",
  "/images/clients7.jpg",
];

const textStyle = {
  margin: "16px 0",
};

const iconStyle = {
  transform: { translateY: "-50%" },
  backgroundColor: "white",
  position: "absolute",
  top: "50%",
};

const BannerLanding = (props: { setTabIndex: any }) => {
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
      <BannerContainer>
        <Informations>
          <Box display="flex" flexDirection="column">
            <h2 style={textStyle}>
              O maior projeto social de Implantes do Brasil
            </h2>
            <h3 style={textStyle}>
              Já são mais de 15 mil implantes instalados
            </h3>
            <h4 style={textStyle}>Venha fazer parte desse grande projeto!</h4>
            <Typography variant="semibold">
              CEMIC. Compartilhe essa ideia
            </Typography>

            <Button
              variant="outlined"
              onClick={() => props.setTabIndex(1)}
              sx={{ borderRadius: "20px", width: "50%", marginTop: "16px" }}
            >
              Saber Mais
            </Button>
          </Box>
          <img src={imagesBanner[0]} alt="" className={styles.imgLanding} />;
        </Informations>
      </BannerContainer>

      {/* <FormContainer>
        <FormLanding />
      </FormContainer> */}
      {/* <IconButton
        sx={{ ...iconStyle, left: "16px" }}
        onClick={handlePreviousImg}
      >
        <Left fontSize="large" />
      </IconButton>
      <IconButton sx={{ ...iconStyle, right: "16px" }} onClick={handleNextImg}>
        <Right fontSize="large" />
      </IconButton> */}
      <Box mt={2}>
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

const FormContainer = styled(Box)`
  width: 100%;
  padding: 16px 0;
  background-color: var(--blue);
`;

const BannerContainer = styled(Box)`
  width: 100%;
  height: 100vh;
  background-color: white;
  @media screen and (max-width: 760px) {
    height: auto;
  }
`;

const Informations = styled(Box)`
  display: flex;
  padding: 32px;
  align-items: center;
  justify-content: space-between;

  @media screen and (max-width: 760px) {
    justify-content: center;
    flex-direction: column;
  }
`;

export default BannerLanding;
