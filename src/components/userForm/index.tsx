import React from "react";
import { Box, styled } from "@mui/material";
import { StyledTextField } from "../patient/profile";
import styles from "../../styles/Selected.module.css";
import { StyledButton } from "../dynamicAdminBody/receipts";

interface UserFormProps {
  userData: any;
  setUserData: any;
  handleChange: any;
  handleMasked: any;
  locationData: any;
  setLocationData: any;
  handleGetCep: any;
  handleNextPage: any;
}

const UserForm = (props: UserFormProps) => {
  const {
    handleChange,
    handleMasked,
    userData,
    setUserData,
    locationData,
    setLocationData,
    handleGetCep,
    handleNextPage,
  } = props;
  return (
    <>
      <h2>Dados do Paciente</h2>

      <StyledTextField
        label="Nome Completo:"
        value={userData?.name!}
        onChange={(e) => handleChange(e.target.value, "name", setUserData)}
        margin="dense"
      />
      <InputsContainer>
        <StyledTextField
          label="CPF:"
          value={userData?.cpf!}
          disabled
          sx={{ width: "70%" }}
        />
        <StyledTextField
          label="RG:"
          value={userData?.rg!}
          sx={{ width: "30%" }}
          inputProps={{ maxLength: 7 }}
          onChange={(e) => handleChange(e.target.value, "rg", setUserData)}
        />
      </InputsContainer>

      <InputsContainer>
        <StyledTextField
          label="Celular*:"
          value={userData?.phone!}
          onChange={(e) => handleMasked(e.target.value, "phone", setUserData)}
          inputProps={{ maxLength: 15 }}
          sx={{ width: "70%" }}
        />
        <StyledTextField
          type={"date"}
          sx={{ width: "30%" }}
          label="Nascimento*:"
          value={userData?.bornDate!}
          InputLabelProps={{ shrink: true }}
          onChange={(e) =>
            handleChange(e.target.value, "bornDate", setUserData)
          }
        />
      </InputsContainer>

      <h3 className={styles.local}>Dados de Localidade</h3>

      <InputsContainer>
        <StyledTextField
          label="CEP*:"
          value={locationData?.cep!}
          onChange={handleGetCep}
          inputProps={{ maxLength: 8 }}
          sx={{ width: "100%" }}
        />
        <StyledTextField
          label="Logradouro:"
          value={locationData?.line1!}
          InputLabelProps={{ shrink: true }}
          sx={{ width: "100%" }}
          onChange={(e) =>
            handleChange(e.target.value, "line1", setLocationData)
          }
        />
      </InputsContainer>

      <InputsContainer>
        <StyledTextField
          label="Bairro:"
          value={locationData?.neighbor!}
          InputLabelProps={{ shrink: true }}
          sx={{ width: "80%" }}
          onChange={(e) =>
            handleChange(e.target.value, "neighbor", setLocationData)
          }
        />

        <StyledTextField
          label="Número:"
          value={locationData?.number!}
          sx={{ width: "20%" }}
          onChange={(e) =>
            handleChange(e.target.value, "number", setLocationData)
          }
        />
      </InputsContainer>

      <InputsContainer>
        <StyledTextField
          label="Cidade:"
          value={locationData?.city!}
          InputLabelProps={{ shrink: true }}
          onChange={(e) =>
            handleChange(e.target.value, "city", setLocationData)
          }
          sx={{ width: "80%" }}
        />

        <StyledTextField
          label="UF:"
          value={locationData?.uf!}
          InputLabelProps={{ shrink: true }}
          sx={{ width: "20%" }}
          onChange={(e) => handleChange(e.target.value, "uf", setLocationData)}
        />
      </InputsContainer>

      <StyledTextField
        label="Complemento:"
        value={locationData?.complement!}
        InputLabelProps={{ shrink: true }}
        sx={{ width: "100%", mt: "16px" }}
        onChange={(e) =>
          handleChange(e.target.value, "complement", setLocationData)
        }
      />

      <Box display="flex" width="100%" justifyContent="flex-end" mt={1}>
        <StyledButton onClick={handleNextPage}>Próximo</StyledButton>
      </Box>
    </>
  );
};

const InputsContainer = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  column-gap: 16px;
  margin: 16px 0;
`;

export default UserForm;
