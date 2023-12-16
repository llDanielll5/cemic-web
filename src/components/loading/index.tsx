import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";

const Loading = (props: { message: string }) => {
  return (
    <Box
      position="fixed"
      display="flex"
      alignItems={"center"}
      justifyContent={"center"}
      flexDirection={"column"}
      width={"100vw"}
      height="100vh"
      sx={{ backgroundColor: "rgba(0,0,0,0.2)" }}
    >
      <CircularProgress size={50} sx={{ color: "var(--red)" }} />
      <Typography
        variant="subtitle1"
        sx={{ color: "var(--dark-blue)", fontSize: "18px", mt: "8px" }}
      >
        {props.message}
      </Typography>
    </Box>
  );
};

export default Loading;
