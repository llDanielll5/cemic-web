/* eslint-disable @next/next/no-img-element */
import React from "react";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { Box, Button, Card, Stack, Typography, styled } from "@mui/material";
import { WHATSAPP_CEMIC } from "../banner";
import { motion } from "framer-motion";

const Help = () => {
  const msg = `Olá!! Realizei uma doação para a CEMIC, para ajudar no projeto social!`;
  const zapHref = `https://api.whatsapp.com/send?phone=${WHATSAPP_CEMIC}&text=${encodeURIComponent(
    msg
  )}`;
  return (
    <section id={"help"} style={{ padding: "2rem" }}>
      <Box>
        <Typography variant="h3">Ajude-nos</Typography>

        <DoubleContainer>
          <W50>
            <Typography variant="subtitle1" fontWeight={"bold"}>
              Se você acha nosso trabalho importante, ajude-nos a multiplicar
              nossos atendimentos. <br />
              <br />
              Faça uma doação de R$30, R$50 ou R$100 reais, a sua doação pode
              mudar a vida de alguém que sofre com problemas dentários.
              <br />
              <br />
            </Typography>
            <Typography variant="subtitle1">
              Juntos somos mais fortes. <br />
              <br />
            </Typography>
            <Typography variant="h6">CEMIC. Compartilhe essa ideia!</Typography>
          </W50>

          <HandsImage>
            <StyledImg src="/images/maos.png" alt="mãos que ajudam" />
          </HandsImage>
        </DoubleContainer>
      </Box>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <PixContainer elevation={10}>
          <PixImage src="/images/qrcodepix.png" alt="qrcode pix" />
          <Stack direction={"column"} width={"100%"}>
            <PixName variant="h5" fontWeight={"bold"}>
              Centro Médico e de Implantes Comunitário <br /> Pix CNPJ:
              23.147.717/0001-66
            </PixName>
            <PixInfos>
              <Typography variant="subtitle2" fontWeight={"bold"}>
                <p>
                  <br />
                  Ao realizar a doação, favor entrar em contato no nosso
                  whatsapp.
                </p>
              </Typography>
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
                style={{ marginTop: "3rem" }}
              >
                <Button
                  variant="contained"
                  startIcon={<WhatsAppIcon />}
                  onClick={() => window.open(zapHref, "_blank")}
                  sx={{
                    background: "linear-gradient(to right, #0c1c30, #0c1c30)",
                    color: "white",
                    px: 6,
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: "none",
                    fontSize: "1rem",
                  }}
                >
                  Fiz a doação
                </Button>
              </motion.div>
            </PixInfos>
          </Stack>
        </PixContainer>
      </motion.div>
    </section>
  );
};

const DoubleContainer = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  column-gap: 8rem;
  margin-top: 0.5rem;

  @media screen and (max-width: 760px) {
    flex-direction: column;
    align-items: center;
  }
`;

const StyledImg = styled("img")`
  border-radius: 50%;
  border: 10px solid var(--red);
  width: 100%;
  max-width: 270px;
  height: 270px;
`;

const PixContainer = styled(Card)`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 1rem;

  @media screen and (max-width: 760px) {
    flex-direction: column;
    width: 80%;
    margin: 2rem 10%;
  }
`;

const PixImage = styled("img")`
  border-radius: 1rem;
  width: 40%;
`;

const PixName = styled(Typography)`
  width: 90%;
  @media screen and (max-width: 760px) {
    width: 100%;
    text-align: center;
    margin-top: 1rem;
  }
`;

const PixInfos = styled(Box)`
  width: 90%;
  @media screen and (max-width: 760px) {
    width: 100%;
    text-align: center;
  }
`;

const W50 = styled(Box)`
  width: 50%;

  @media screen and (max-width: 760px) {
    width: 100%;
    margin-bottom: 1rem;
  }
`;

const HandsImage = styled(Box)`
  width: 50%;
  display: flex;
  align-items: center;
  justify-content: center;

  @media screen and (max-width: 760px) {
    width: 100%;
  }
`;

export default Help;
