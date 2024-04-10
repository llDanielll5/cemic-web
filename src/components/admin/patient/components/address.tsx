import React, { useCallback, useEffect } from "react";
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
import { getViaCepInfo } from "@/axios/viacep";

interface PatientAddressInterface {
  clientAddress?: any;
  handleChangeAddress: any;
  setClientAddress: any;
}

const PatientAddress = (props: PatientAddressInterface) => {
  const { handleChangeAddress, clientAddress, setClientAddress } = props;

  const handleGetCep = useCallback(async () => {
    if (clientAddress.cep === null) return;
    if (clientAddress?.cep?.length > 7) {
      getViaCepInfo(clientAddress.cep).then((res) => {
        if (res) {
          const { address, city, complement, line1, neighbor, uf } = res;

          setClientAddress((prev: any) => ({
            ...prev,
            neighbor,
            city,
            complement,
            line1,
            uf,
            address,
          }));
        }
      });
    }
  }, [clientAddress.cep]);

  useEffect(() => {
    handleGetCep();
  }, [handleGetCep]);

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
          onChange={({ target }) =>
            setClientAddress((prev: any) => ({ ...prev, cep: target.value }))
          }
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
    </Box>
  );
};

export default PatientAddress;
