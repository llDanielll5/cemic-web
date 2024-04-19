import { Box, Typography, styled } from "@mui/material";
import dynamic from "next/dynamic";
import React from "react";
import MapItem from "./map-item";

const BrasiliaMap = dynamic(
  () => import("../../../services/maps/brasilia-map"),
  {
    ssr: false,
  }
);
const UberlandiaMap = dynamic(
  () => import("../../../services/maps/uberlandia-map"),
  {
    ssr: false,
  }
);

const AddressLanding: React.FC = () => {
  return (
    <section id={"address"} style={{ backgroundColor: "var(--blue)" }}>
      <Container>
        <Typography variant="h3" color="white" mb={3}>
          Endereços
        </Typography>

        <MapsContainer>
          <MapItem addressText="Conjunto Nacional, Torre Amarela, Sala 5092, 5º Andar, Brasília - DF">
            <BrasiliaMap />
          </MapItem>

          <MapItem addressText="Rua Tenente Virmondes, 77, Centro, Uberlândia - MG">
            <UberlandiaMap />
          </MapItem>
        </MapsContainer>
      </Container>
    </section>
  );
};

const Container = styled(Box)`
  padding: 2rem 4rem;
  @media screen and (max-width: 760px) {
    padding: 2rem;
  }
`;

export const AddressText = styled(Typography)`
  font-size: 1.5rem;
  text-align: center;
  width: 100%;
  @media screen and (max-width: 760px) {
    font-size: 14px;
  }
`;

const MapsContainer = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  column-gap: 2rem;
  width: 100%;
  margin: 2rem;

  @media screen and (max-width: 900px) {
    flex-direction: column;
    row-gap: 2rem;
    column-gap: 0;
    margin: 0;
  }
`;

export default AddressLanding;
