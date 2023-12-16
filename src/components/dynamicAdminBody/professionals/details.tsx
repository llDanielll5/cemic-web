import React from "react";
import { Box, Typography, styled } from "@mui/material";
import { SpecialtyType } from "types";
import { cpfMask, phoneMask } from "@/services/services";

interface ProfessionalAdminDetailsProps {
  informations: any;
}

const ProfessionalsAdminDetails: React.FC<ProfessionalAdminDetailsProps> = (
  props
) => {
  const { informations } = props;

  const getSpecialty = (spec?: SpecialtyType) => {
    if (!spec || spec === undefined) return "";
    if (spec === "implant") return "Implante";
    if (spec === "general") return "Clínico Geral";
    if (spec === "orthodontic") return "Ortodontia";
    if (spec === "prosthesis") return "Próteses";
  };
  return (
    <Box>
      <DoubleFlex>
        <Typography variant="subtitle1">Nome: </Typography>
        <Typography variant="subtitle1">{informations?.name}</Typography>
      </DoubleFlex>
      <DoubleFlex>
        <Typography variant="subtitle1">CRO: </Typography>
        <Typography variant="subtitle1">{informations?.cro}</Typography>
      </DoubleFlex>
      <DoubleFlex>
        <Typography variant="subtitle1">Especialidade: </Typography>
        <Typography variant="subtitle1">
          {getSpecialty(informations?.specialty)}
        </Typography>
      </DoubleFlex>
      <DoubleFlex>
        <Typography variant="subtitle1">Telefone: </Typography>
        <Typography variant="subtitle1">
          {phoneMask(informations?.phone)}
        </Typography>
      </DoubleFlex>
      <DoubleFlex>
        <Typography variant="subtitle1">CPF: </Typography>
        <Typography variant="subtitle1">
          {cpfMask(informations?.cpf)}
        </Typography>
      </DoubleFlex>
    </Box>
  );
};

const DoubleFlex = styled(Box)`
  display: flex;
  align-items: center;
  flex-direction: row;
  width: 100%;
  column-gap: 8px;
  margin: 8px 0;
`;
const DoubleRow = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  width: 100%;
  column-gap: 8px;
`;

export default ProfessionalsAdminDetails;
