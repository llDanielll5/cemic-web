import { handleOpenWhatsappMessage } from "@/services/services";
import { Box, Button, Typography } from "@mui/material";
import { motion } from "framer-motion";

export default function MapSection() {
  return (
    <Box
      id={"address"}
      component={motion.section}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      sx={{
        backgroundColor: "#1e2a38",
        color: "#fff",
        textAlign: "center",
        py: 8,
        px: 2,
      }}
    >
      <Typography
        variant="h2"
        component="h2"
        sx={{ mb: 2, fontWeight: 600 }}
        color="white"
      >
        Onde estamos localizados{" "}
        <Box component="span" sx={{ color: "#bfa98c" }}>
          ?
        </Box>
      </Typography>

      <Typography variant="subtitle1" sx={{ mb: 4, fontWeight: 300 }}>
        📍 Conjunto Nacional Brasília, 5º andar, sala 5092
      </Typography>
      <Typography variant="subtitle1" sx={{ mb: 4, fontWeight: 300 }}>
        📍 Rua Tenente Virmondes, 77, Centro, Uberlândia - MG
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "center",
          alignItems: "center",
          gap: 4,
          flexWrap: "wrap",
          mb: 6,
        }}
      >
        <iframe
          src="https://www.google.com/maps?q=-15.7916087,-47.8830865&z=15&output=embed"
          width="100%"
          height="300"
          style={{ border: 0, borderRadius: 8, maxWidth: 500 }}
          loading="lazy"
          allowFullScreen
        ></iframe>

        <iframe
          src="https://www.google.com/maps?q=-18.9161087,-48.2821009&z=15&output=embed"
          width="100%"
          height="300"
          style={{ border: 0, borderRadius: 8, maxWidth: 500 }}
          loading="lazy"
          allowFullScreen
        ></iframe>
      </Box>

      <Button
        variant="contained"
        onClick={handleOpenWhatsappMessage}
        sx={{
          background: "white",
          color: "#0c1c30",
          fontWeight: 600,
          fontFamily: "Poppins",
          fontSize: "1rem",
          textTransform: "none",
          "&:hover": {
            background: "#dbdbdb",
          },
        }}
      >
        Agendar consulta
      </Button>
    </Box>
  );
}
