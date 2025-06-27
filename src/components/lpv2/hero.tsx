/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import useWindowSize from "@/hooks/useWindowSize";
import styled from "@emotion/styled";
import { headerData } from "data";
import Link from "next/link";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import CloseIcon from "@mui/icons-material/Close";
import { useRouter } from "next/router";
import { handleOpenWhatsappMessage } from "@/services/services";

const people = [
  "https://images.pexels.com/photos/8528708/pexels-photo-8528708.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  "https://images.pexels.com/photos/6336244/pexels-photo-6336244.jpeg",
  "https://images.pexels.com/photos/30609683/pexels-photo-30609683/free-photo-of-jovem-sorrindo-ao-ar-livre-a-noite.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
];

const HeroHeader = () => {
  const router = useRouter();
  const { width } = useWindowSize();
  const [mobileOpen, setMobileOpen] = useState(false);
  const toggleDrawer = () => setMobileOpen(!mobileOpen);

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
          fontWeight={router.pathname === item.path ? "bold" : undefined}
        >
          {item.title}
        </List>
      </ListBox>
    );
  };

  const ListContainer = styled("ul")`
    display: flex;
    flex-direction: row;
    align-items: center;
    transition: 0.7s;
    @media screen and (max-width: 760px) {
      display: ${!mobileOpen ? "none" : "flex"};
      flex-direction: column;
      background-color: #0c1c30;
      z-index: 10;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
    }
  `;

  return (
    <Box
      component="header"
      sx={{
        position: "relative",
        height: { xs: "auto" },
        background: "linear-gradient(180deg, #0c1c30 0%, #1b2738 100%)",
        color: "white",
      }}
    >
      {/* Background Image Sutil */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          backgroundImage: `url(/images/lpv2/bg.jpg)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.07,
          pointerEvents: "none",
        }}
      />

      {/* Brilho em cima */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "100%",
          height: "100%",
          background:
            "radial-gradient(circle at top center, rgba(255,255,255,0.2), transparent)",
          zIndex: 1,
          pointerEvents: "none", // 🚨 adiciona isso
        }}
      />

      {/* NAVBAR */}
      <AppBar
        position="static"
        elevation={100}
        sx={{
          background: "transparent",
          zIndex: 100,
          px: { xs: 2, md: 4 },
          pt: 2,
        }}
      >
        <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
          <StyledLogo src={"/images/lpv2/cemicLogo.png"} alt="Realce Logo" />

          {width! > 760 && (
            <Box
              sx={{
                display: "flex",
                gap: { md: 4, xs: 2 },
                alignItems: "center",
              }}
            >
              <Typography variant="body1" component={"a"} href="/">
                Início
              </Typography>
              <Typography variant="body1" component={"a"} href="#aboutus">
                Sobre
              </Typography>
              <Typography variant="body1" component={"a"} href="#help">
                Ajudar
              </Typography>
              <Typography variant="body1" component={"a"} href="#address">
                Endereços
              </Typography>
            </Box>
          )}

          {width! < 760 && (
            <IconButton
              sx={{ display: { xs: "flex", md: "none" }, color: "white" }}
              onClick={toggleDrawer}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      {/* HERO CONTENT */}
      <Container
        maxWidth="lg"
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
          alignItems: "center",
          height: "100%",
          py: { xs: 1, md: 5 },
          position: "relative",
          zIndex: 2,
          columnGap: { md: 5, xs: 1 },
        }}
      >
        {/* LEFT TEXT */}
        <Box
          maxWidth={{ md: "50%", xs: "100%" }}
          display={"flex"}
          flexDirection={"column"}
        >
          {width! < 760 && (
            <ListContainer>
              {headerData.map((item, index) => listItem({ item, index }))}
            </ListContainer>
          )}

          <Typography variant="h4" sx={{ mb: 2 }} color="white">
            Transforme{" "}
            <Box component="span" sx={{ color: "#d6b88d" }}>
              sua vida <br />
            </Box>{" "}
            com o tratamento de <br />
            <Box component="span" sx={{ color: "#d6b88d" }}>
              Implantes Dentários!
            </Box>
          </Typography>

          <Typography variant="body1" sx={{ mb: 2 }} color="white">
            A CEMIC trabalha com a reabilitação oral de diversos pacientes. Por
            meio de seu projeto social, a CEMIC devolveu mais de 15 mil sorrisos
            para diversos paciente, e também pode devolver a você!
          </Typography>

          <Button
            variant="contained"
            onClick={handleOpenWhatsappMessage}
            sx={{
              background: "linear-gradient(to right, white, white)",
              color: "#1b2738",
              px: 4,
              py: 1.5,
              fontWeight: 700,
              textTransform: "uppercase",
              fontSize: "18px",
              borderRadius: 1,
              mb: 2,

              ":hover": {
                background: "#999",
              },
            }}
          >
            Saiba Mais
          </Button>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 2 }}>
            {/* Exemplo de avatars simulados */}
            <Box sx={{ display: "flex" }}>
              {people.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`${i}`}
                  width={40}
                  height={40}
                  style={{
                    borderRadius: "50%",
                    border: "2px solid white",
                    marginLeft: i !== 0 ? -10 : 0,
                    objectFit: "cover",
                  }}
                />
              ))}
            </Box>
            <Typography variant="body1" color="white">
              +550 Clientes Satisfeitos
            </Typography>
          </Box>
        </Box>

        {/* RIGHT IMAGE */}
        <Box sx={{ mt: { xs: 4, md: 0 } }}>
          <img
            src={"/images/lpv2/implante2.png"}
            alt="Implante Dentário"
            style={{
              maxWidth: "90%",
              height: "auto",
              borderRadius: "12px",
            }}
          />
        </Box>
      </Container>
    </Box>
  );
};

const StyledLogo = styled("img")`
  height: 70px;

  @media screen and (max-width: 760px) {
    height: 45px;
  }
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

export default HeroHeader;
