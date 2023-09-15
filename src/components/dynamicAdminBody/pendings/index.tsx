import React, { useState } from "react";
import { Box, Typography, styled } from "@mui/material";
import { StyledButton } from "../receipts";

const PendingsTab = (props: any) => {
  const [pendingTitle, setPendingTitle] = useState("");
  const [pendingContent, setPendingContent] = useState("");
  return (
    <Box>
      <StyledButton>Nova Pendência</StyledButton>
    </Box>
  );
};

export default PendingsTab;
