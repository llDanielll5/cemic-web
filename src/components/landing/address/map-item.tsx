import { Box, Button, Typography, styled } from "@mui/material";
import React from "react";
import { AddressText } from ".";
import useWindowSize from "@/hooks/useWindowSize";

interface MapItemProps {
  addressText: string;
  children: React.ReactNode;
}

const MapItem = (props: MapItemProps) => {
  const { width } = useWindowSize();
  return (
    <Container>
      <Typography
        variant="subtitle1"
        fontWeight={"bold"}
        fontSize={`${width! > 760 ? width! / 60 : width! / 30}px`}
        textAlign={"center"}
        pt={2}
      >
        {props.addressText}
      </Typography>

      <Box my={5} borderRadius={5}>
        {props.children}
      </Box>

      {/* <Button
        variant="contained"
        sx={{ backgroundColor: "var(--dark-blue)" }}
      ></Button> */}
    </Container>
  );
};

const Container = styled(Box)`
  width: 100%;
  min-height: 570px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: white;
  border-radius: 2rem;
  padding: 1.5rem;
  border: 5px solid var(--dark-blue);
`;

export default MapItem;
