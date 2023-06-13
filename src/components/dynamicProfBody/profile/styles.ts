import { styled, Box, Typography, Avatar, TextField } from "@mui/material";

export const Container = styled(Box)`
  display: flex;
  width: 100%;
  flex-direction: column;
`;

export const Title = styled(Typography)`
  font-size: 20px;
  text-align: center;
  margin: 16px auto;
  @media screen and (max-width: 760px) {
    font-size: 16px;
  }
  @media screen and (max-width: 450px) {
    font-size: 14px;
  }
`;

export const Form = styled(Box)`
  width: 100%;
  padding: 16px;
  margin: 0 auto;
  max-width: 1000px;
  background-color: white;
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.06);
`;

export const FieldForm = styled(Box)`
  border: 1.6px solid var(--dark-blue);
  padding: 8px;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
`;

export const AvatarContainer = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  position: relative;
`;

export const ProfileImage = styled(Avatar)`
  width: 60px;
  height: 60px;
  background-color: orangered;
  font-size: 30px;
  font-weight: 500;
`;

export const OptionsSpecialties = styled(TextField)`
  border-color: var(--dark-blue);
  border-radius: 8px;
  outline: none;
  margin: 8px 0;
`;

export const DoubleInputs = styled(Box)`
  display: flex;
  align-items: center;
  column-gap: 16px;
  row-gap: 8px;
  @media screen and (max-width: 550px) {
    flex-direction: column;
  }
`;
