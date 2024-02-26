import React, { useEffect, useState } from "react";
import { Box, Button, TextField, Typography, styled } from "@mui/material";
import { BankCheckInformationsInterface } from "types/payments";
import { maskValue } from "@/services/services";
import DoneOutlineIcon from "@mui/icons-material/DoneOutline";
import CModal from "@/components/modal";

interface BankCheckInfosInterface {
  onChangeCheckInformations: (v: any) => void;
  splitTimes: string;
  paymentShape: any;
  visible: any;
  closeModal: any;
}

const RenderBankCheckInfos = (props: BankCheckInfosInterface) => {
  const {
    onChangeCheckInformations,
    splitTimes,
    paymentShape,
    closeModal,
    visible,
  } = props;

  const [bankCheckInfos, setBankCheckInfos] = useState<
    BankCheckInformationsInterface[]
  >([]);

  const getBankCheckInfos = () => {
    const splitNum = parseInt(splitTimes!);
    let bankCheckArr: any[] = [];

    if (splitNum > 0 && paymentShape === "BANK_CHECK") {
      bankCheckArr = [];
      const defaultValues: BankCheckInformationsInterface = {
        bank_check_number: "",
        date_compensation: "",
        name: "",
        serie_number: "",
        price: "0,00",
      };
      for (let i = 0; i < splitNum; i++) {
        bankCheckArr.push(defaultValues);
      }
      setBankCheckInfos(bankCheckArr);
    }
  };

  const handleChangeValues = (field: any, e: any, i: number) => {
    const position = bankCheckInfos.findIndex((v, index) => index === i);
    const value = e.target.value;
    const clone = [...bankCheckInfos];
    clone[position] = {
      ...clone[position],
      [field]: value,
    };
    setBankCheckInfos(clone);
  };

  const handleChangePrice = (e: any, i: number) => {
    const position = bankCheckInfos.findIndex((v, index) => index === i);
    const value = e.target.value;
    const clone = [...bankCheckInfos];
    clone[position] = {
      ...clone[position],
      price: maskValue(value),
    };
    setBankCheckInfos(clone);
  };

  useEffect(() => {
    getBankCheckInfos();
  }, [splitTimes]);

  useEffect(() => {
    onChangeCheckInformations(bankCheckInfos);
  }, [bankCheckInfos, onChangeCheckInformations]);

  return (
    <CModal
      visible={visible}
      closeModal={closeModal}
      styles={{ height: "90vh", width: "90vw", overflowY: "auto" }}
    >
      <Typography variant="h5" textAlign="center">
        Informações dos Cheques
      </Typography>
      {bankCheckInfos.map((v, i) => (
        <MapContainer key={i}>
          <Typography variant="h6" sx={{ pl: 2, pt: 1 }}>
            Cheque {i + 1}:
          </Typography>
          <Container>
            <TextField
              fullWidth
              id={"input"}
              label="Nome do Pagador"
              value={v.name}
              onChange={(e) => handleChangeValues("name", e, i)}
            />
            <TextField
              id={"input"}
              label="Série do Cheque"
              value={v.serie_number}
              onChange={(e) => handleChangeValues("serie_number", e, i)}
            />
            <TextField
              id={"input"}
              label="Número do Cheque"
              value={v.bank_check_number}
              onChange={(e) => handleChangeValues("bank_check_number", e, i)}
            />
            <TextField
              id={"input"}
              type="date"
              label="Data"
              InputLabelProps={{ shrink: true }}
              value={v.date_compensation}
              onChange={(e) => handleChangeValues("date_compensation", e, i)}
            />
            <TextField
              id={"input"}
              label="Valor"
              value={v.price}
              onChange={(e) => handleChangePrice(e, i)}
              inputProps={{ maxLength: 10 }}
            />
          </Container>
        </MapContainer>
      ))}

      <Button
        variant="contained"
        sx={{ my: 2 }}
        onClick={closeModal}
        fullWidth
        endIcon={<DoneOutlineIcon />}
      >
        Salvar
      </Button>
    </CModal>
  );
};

const Container = styled(Box)`
  display: grid;
  grid-template-columns: repeat(3, auto);
  grid-template-rows: repeat(2, auto);
  grid-column-gap: 0.4rem;
  grid-row-gap: 0.4rem;
  padding: 1rem;
  #input {
    background-color: white;
  }
`;

const MapContainer = styled(Box)`
  background-color: #f5f5f4;
  border-radius: 0.5rem;
  margin: 0.4rem 0;
`;

export default RenderBankCheckInfos;
