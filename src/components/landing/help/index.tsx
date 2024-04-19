/* eslint-disable @next/next/no-img-element */
import React from "react";
import { Box, Button, Typography, styled } from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

const Help = () => {
  return (
    <section id={"help"}>
      <Box my={5} px={"4rem"}>
        <Typography variant="h3">Ajude-nos</Typography>

        <DoubleContainer>
          <W50>
            <Typography variant="subtitle2" fontWeight={"bold"}>
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

      <PixContainer>
        <PixImage src="/images/qrcodepix.png" alt="qrcode pix" />
        <PixName variant="subtitle2" fontWeight={"bold"}>
          Centro Médico e de Implantes Comunitário <br /> Pix CNPJ:
          23.147.717/0001-66
        </PixName>
        <PixInfos>
          <Typography variant="subtitle2" fontWeight={"bold"}>
            <p>
              <br />
              Ao realizar a doação, favor entrar em contato no nosso whatsapp.
            </p>
          </Typography>
          <Button
            fullWidth
            variant="contained"
            sx={{ backgroundColor: "var(--dark-blue)", borderRadius: 5, mt: 2 }}
            startIcon={<WhatsAppIcon />}
          >
            Fiz a doação
          </Button>
        </PixInfos>
      </PixContainer>
    </section>
  );
};

const DoubleContainer = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  column-gap: 8rem;
  margin-top: 2rem;

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

const PixContainer = styled(Box)`
  width: 85%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid var(--blue);
  border-radius: 1rem;
  padding: 1.5rem;
  margin: 3rem 4rem;
  column-gap: 1.4rem;

  @media screen and (max-width: 760px) {
    flex-direction: column;
    width: 80%;
    margin: 2rem 10%;
  }
`;

const PixImage = styled("img")`
  border: 3px solid var(--blue);
  border-radius: 1rem;
  width: 170px;
  height: 170px;
`;

const PixName = styled(Typography)`
  width: 20%;

  @media screen and (max-width: 760px) {
    width: 100%;
    text-align: center;
    margin-top: 1rem;
  }
`;

const PixInfos = styled(Box)`
  width: 20%;

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
