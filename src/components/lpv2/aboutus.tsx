import { handleOpenWhatsappMessage } from "@/services/services";
import { Box, Typography, Button, Grid, Paper } from "@mui/material";
import { motion } from "framer-motion";

export default function AboutUsSection() {
  return (
    <Box
      id={"aboutus"}
      sx={{
        py: 8,
        backgroundColor: "#1e2a38",
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: "white",
        px: { md: 4, xs: 4 },
        textAlign: "center",
        position: "relative",
        backgroundImage: "linear-gradient(180deg, white 0%, #1e2a38 2%)",
      }}
    >
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6}>
          <Paper
            component="img"
            src="/images/lpv2/bg.jpg"
            alt="Foto do profissional"
            sx={{
              borderRadius: "10%",
              width: "100%",
              objectFit: "cover",
              marginBottom: 3,
              boxShadow: 3,
            }}
          />
        </Grid>

        <Grid
          item
          xs={12}
          sm={6}
          display={"flex"}
          flexDirection={"column"}
          alignItems={"flex-start"}
        >
          <Typography
            variant="h4"
            gutterBottom
            color="white"
            textAlign={"left"}
          >
            Sobre nós
          </Typography>
          <Typography
            variant="body1"
            sx={{ mb: 4, textAlign: "left" }}
            color="white"
          >
            A CEMIC é uma ONG que atua na reabilitação oral a quase 10 anos, por
            meio de um dos maiores projetos sociais do Brasil com Implantes
            Dentários ou Próteses dentárias.
            <br />
            <br />A CEMIC foi fundada em 2015 com o objetivo de diminuir o
            grande número de pessoas desdentadas no país, que segundo o IBGE
            2020 temos mais de 34 milhões de brasileiros desdentados.
            <br />
            <br />A CEMIC por meio de dentistas parceiros e na sua clínica
            própria já realizou mais de 15 mil atendimentos, devolvendo o
            sorriso, alegria e auto-estima dessas pessoas. Devido o governo
            local ou federal não possuir projetos de reabilitação com implantes
            dentários e o alto custo do tratamento em clínicas particulares,
            cada vez mais, aumentam as estatísticas de pessoas desdentadas,
            principalmente as mais carentes, fazendo assim com que seja muito
            importante o trabalho das ONGs e escolas de pós-graduação no país.
          </Typography>
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Button
              variant="contained"
              onClick={handleOpenWhatsappMessage}
              sx={{
                bgcolor: "white",
                color: "#0c1c30",
                px: 6,
                py: 1.5,
                borderRadius: 2,
                textTransform: "none",
                fontSize: "1rem",
                ":hover": {
                  bgcolor: "white",
                },
              }}
            >
              Agendar consulta
            </Button>
          </motion.div>
        </Grid>
      </Grid>
    </Box>
  );
}
