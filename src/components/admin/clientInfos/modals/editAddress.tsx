import React from "react";
import CModal from "@/components/modal";
import { InputsContainer } from "@/components/userForm";
import { Button, TextField, Typography } from "@mui/material";

interface EditPatientAddressInterface {
  visible: any;
  closeModal: any;
  clientAddress?: any;
  handleChangeAddress: any;
  handleEditAddress: any;
  setClientAddress: any;
}

const EditPatientAddressModal = (props: EditPatientAddressInterface) => {
  const {
    closeModal,
    handleChangeAddress,
    handleEditAddress,
    visible,
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
        const res = await fetch(`https://viacep.com.br/ws/${val}/json/`);
        const json: any = await res.json();
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
    <CModal visible={visible} closeModal={closeModal}>
      <Typography variant="h5" fontSize={"1rem"} textAlign={"center"}>
        Alterar Endereço
      </Typography>
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
    </CModal>
  );
};

export default EditPatientAddressModal;
