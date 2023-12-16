import React from "react";
import { Box, styled, Autocomplete, TextField } from "@mui/material";
import { StyledButton } from "../dynamicAdminBody/receipts";
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

      <TextField
        label="Nome Completo:"
        value={userData?.name!}
        sx={{ width: "100%" }}
        onChange={(e) => handleChange(e.target.value, "name", setUserData)}
        margin="dense"
      />
      <TextField
        label="Email:"
        value={userData?.email!}
        sx={{ width: "100%" }}
        onChange={(e) => handleChange(e.target.value, "email", setUserData)}
        margin="dense"
      />
      <InputsContainer>
        <TextField
          label="CPF:"
          value={cpfMask(userData?.cpf!)}
          onChange={(e) => handleChange(e.target.value, "cpf", setUserData)}
          inputProps={{ maxLength: 14 }}
          sx={{ width: "70%" }}
        />
        <TextField
          label="RG:"
          value={userData?.rg!}
          sx={{ width: "30%" }}
          inputProps={{ maxLength: 11 }}
          onChange={(e) => handleChange(e.target.value, "rg", setUserData)}
        />
      </InputsContainer>

      <InputsContainer>
        <TextField
          label="Celular*:"
          value={userData?.phone!}
          onChange={(e) => handleMasked(e.target.value, "phone", setUserData)}
          inputProps={{ maxLength: 15 }}
          sx={{ width: "70%" }}
        />
        <TextField
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

      <h3>Dados de Localidade</h3>

      <InputsContainer>
        <TextField
          label="CEP*:"
          value={locationData?.cep!}
          onChange={handleGetCep}
          inputProps={{ maxLength: 8 }}
          sx={{ width: "100%" }}
        />
        <TextField
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
        <TextField
          label="Bairro:"
          value={locationData?.neighbor!}
          InputLabelProps={{ shrink: true }}
          sx={{ width: "80%" }}
          onChange={(e) =>
            handleChange(e.target.value, "neighbor", setLocationData)
          }
        />

        <TextField
          label="Número:"
          value={locationData?.number!}
          sx={{ width: "20%" }}
          onChange={(e) =>
            handleChange(e.target.value, "number", setLocationData)
          }
        />
      </InputsContainer>

      <InputsContainer>
        <TextField
          label="Cidade:"
          value={locationData?.city!}
          InputLabelProps={{ shrink: true }}
          onChange={(e) =>
            handleChange(e.target.value, "city", setLocationData)
          }
          sx={{ width: "80%" }}
        />

        <TextField
          label="UF:"
          value={locationData?.uf!}
          InputLabelProps={{ shrink: true }}
          sx={{ width: "20%" }}
          onChange={(e) => handleChange(e.target.value, "uf", setLocationData)}
        />
      </InputsContainer>

      <TextField
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
