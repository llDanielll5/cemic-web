"use client";

import { handleOpenWhatsappMessage } from "@/services/services";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
} from "@mui/material";
import { motion } from "framer-motion";

const items = [
  {
    icon: "/images/lpv2/audience/mirror.png",
    text: "Quer aumentar a Autoestima",
  },
  {
    icon: "/images/lpv2/audience/broken-tooth.png",
    text: "Corrigir Problemas Dentários",
  },
  {
    icon: "/images/lpv2/audience/mouth.png",
    text: "Melhorar sua Saúde Bucal",
  },
  {
    icon: "/images/lpv2/audience/smile.png",
    text: "Sorrir com toda Alegria Novamente",
  },
];

export default function TargetAudienceSection() {
  return (
    <Box
      sx={{
        py: 8,
        background: "#f5f5f5",
        textAlign: "center",
        px: 8,
      }}
    >
      <Typography variant="h4" gutterBottom>
        Para quem é ?
      </Typography>
      <Typography variant="subtitle1" sx={{ mb: 6 }}>
        O tratamento com Implante Dentário serve para quem:
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        {items.map((item, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card
                elevation={4}
                sx={{
                  p: 3,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  borderRadius: 3,
                  minHeight: "250px",
                  maxHeight: "250px",
                }}
              >
                <Box
                  component="img"
                  src={item.icon}
                  alt={item.text}
                  sx={{ height: 100, mb: 2 }}
                />
                <CardContent>
                  <Typography variant="body1" color="textSecondary">
                    {item.text}
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      <motion.div
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300 }}
        style={{ marginTop: "3rem" }}
      >
        <Button
          variant="contained"
          onClick={handleOpenWhatsappMessage}
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
          Agendar consulta
        </Button>
      </motion.div>
    </Box>
  );
}
