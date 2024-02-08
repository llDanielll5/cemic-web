import React from "react";
import { InputsContainer } from "@/components/userForm";
import {
  Box,
  Button,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";

interface PatientAddressInterface {
  clientAddress?: any;
  handleChangeAddress: any;
  handleEditAddress: any;
  setClientAddress: any;
}

const PatientAddress = (props: PatientAddressInterface) => {
  const {
    handleChangeAddress,
    handleEditAddress,
    clientAddress,
    setClientAddress,
  } = props;

  const handleGetCep = async (e: any) => {
    setClientAddress((prev: any) => ({ ...prev, cep: e.target.value }));
    let val = e.target.value;
    if (val.length === 8) {
      //   setIsLoading(true);
      //   setLoadingMessage("Carregando informações de CEP");
      try {
        const res = await axios.get(`https://viacep.com.br/ws/${val}/json/`);
        let json = res.data;
        if (json) {
          setClientAddress((prev: any) => ({
            neighbor: json.bairro,
            city: json.localidade,
            complement: json.complemento,
            line1: json.logradouro,
            uf: json.uf,
            cep: val,
            number: json.number,
            address: `${json.logradouro}, ${json.bairro} ${json.complemento}, ${json.localidade} - ${json.uf}`,
          }));
          //   setIsLoading(false);
        }
      } catch (error) {
        // setIsLoading(false);
      }
    }
  };

  return (
    <Box display="flex" flexDirection="column">
      <Stack alignItems="center">
        <Typography variant="h6" mb={1}>
          Endereço
        </Typography>
      </Stack>
      <Divider variant="middle" />

      <InputsContainer>
        <TextField
          label="CEP*:"
          value={clientAddress?.cep!}
          onChange={handleGetCep}
          inputProps={{ maxLength: 8 }}
          sx={{ width: "100%" }}
        />
        <TextField
          label="Logradouro:"
          value={clientAddress?.line1!}
          InputLabelProps={{ shrink: true }}
          sx={{ width: "100%" }}
          onChange={(e) => handleChangeAddress(e.target.value, "line1")}
        />
      </InputsContainer>

      <InputsContainer>
        <TextField
          label="Bairro:"
          value={clientAddress?.neighbor!}
          InputLabelProps={{ shrink: true }}
          sx={{ width: "80%" }}
          onChange={(e) => handleChangeAddress(e.target.value, "neighbor")}
        />

        <TextField
          label="Número:"
          value={clientAddress?.number!}
          sx={{ width: "20%" }}
          onChange={(e) => handleChangeAddress(e.target.value, "number")}
        />
      </InputsContainer>

      <InputsContainer>
        <TextField
          label="Cidade:"
          value={clientAddress?.city!}
          InputLabelProps={{ shrink: true }}
          onChange={(e) => handleChangeAddress(e.target.value, "city")}
          sx={{ width: "80%" }}
        />

        <TextField
          label="UF:"
          value={clientAddress?.uf!}
          InputLabelProps={{ shrink: true }}
          sx={{ width: "20%" }}
          onChange={(e) => handleChangeAddress(e.target.value, "uf")}
        />
      </InputsContainer>

      <TextField
        label="Complemento:"
        value={clientAddress?.complement!}
        InputLabelProps={{ shrink: true }}
        sx={{ width: "100%", mt: "16px" }}
        onChange={(e) => handleChangeAddress(e.target.value, "complement")}
      />

      <Button
        variant="contained"
        color="primary"
        onClick={handleEditAddress}
        sx={{ mt: 2 }}
      >
        Salvar
      </Button>
    </Box>
  );
};

export default PatientAddress;
