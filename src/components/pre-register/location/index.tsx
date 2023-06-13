import React from "react";
import { Box, Typography } from "@mui/material";
import { AddressText } from "@/components/about";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("../../../services/map"), { ssr: false });

const LocationPreRegister = () => {
  return (
    <Box>
      <AddressText variant="bold">
        Conjunto Nacional, Torre Amarela, Sala 5092, 5º Andar, Brasília - DF
      </AddressText>

      <Box my={5}>
        <Map />
      </Box>
    </Box>
  );
};

export default LocationPreRegister;
