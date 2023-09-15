import React from "react";
import { Box, styled, Autocomplete } from "@mui/material";
import { StyledTextField } from "../patient/profile";
import { StyledButton } from "../dynamicAdminBody/receipts";
import styles from "../../styles/Selected.module.css";
import { OptionsSpecialties } from "../dynamicProfBody/profile/styles";

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

const options = [
  { label: "Paciente", option: "patient" },
  { label: "Pré-registro", option: "pre-register" },
  { label: "Selecionado", option: "selected" },
];

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

  const cpfMask = (value: any) => {
    if (!value) return "";
    value = value.replace(/\D/g, "");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    return value;
  };

  const getRole =
    userData?.role === "patient"
      ? "Paciente"
      : userData?.role === "pre-register"
      ? "Pré-registro"
      : userData?.role === "selected"
      ? "Selecionado"
      : "";

  return (
    <Box position="relative" pt={1}>
      <h2>Dados do Paciente</h2>

      <StyledTextField
        label="Nome Completo:"
        value={userData?.name!}
        sx={{ width: "100%" }}
        onChange={(e) => handleChange(e.target.value, "name", setUserData)}
        margin="dense"
      />
      <StyledTextField
        label="Email:"
        value={userData?.email!}
        sx={{ width: "100%" }}
        onChange={(e) => handleChange(e.target.value, "email", setUserData)}
        margin="dense"
      />
      <InputsContainer>
        <StyledTextField
          label="CPF:"
          value={cpfMask(userData?.cpf!)}
          onChange={(e) => handleChange(e.target.value, "cpf", setUserData)}
          inputProps={{ maxLength: 14 }}
          sx={{ width: "70%" }}
        />
        <StyledTextField
          label="RG:"
          value={userData?.rg!}
          sx={{ width: "30%" }}
          inputProps={{ maxLength: 11 }}
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
      <Autocomplete
        disablePortal
        options={options}
        sx={{ width: "100%" }}
        onChange={(e, v) => handleChange(v?.option, "role", setUserData)}
        value={{
          label: getRole,
          option: userData?.role,
        }}
        isOptionEqualToValue={(option, value) => option.option === value.option}
        renderInput={(params) => (
          <OptionsSpecialties
            {...params}
            label="Tipo de cadastro"
            color="primary"
          />
        )}
      />

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
    </Box>
  );
};

export const InputsContainer = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  column-gap: 16px;
  margin: 16px 0;
`;

export default UserForm;
