import React, { useState, useEffect } from "react";
import styles from "../../../styles/ClientDetails.module.css";
import { StyledButton } from "@/components/dynamicAdminBody/receipts";
import Modal from "@/components/modal";
import { InputsContainer } from "@/components/userForm";
import { StyledTextField } from "@/components/patient/profile";
import { AddressType } from "types";

interface ClientAnamneseProps {
  client: any;
  anamneseKeys?: any;
  anamneseValues: any;
}

const defaultAddress: AddressType = {
  neighbor: "",
  cep: "",
  city: "",
  complement: "",
  line1: "",
  uf: "",
  address: "",
};

const ClientAnamneseInfos = (props: ClientAnamneseProps) => {
  const { client, anamneseKeys, anamneseValues } = props;
  const [anamneseModal, setAnamneseModal] = useState(false);
  const [locationData, setLocationData] = useState(defaultAddress);
  const [isLoading, setIsLoading] = useState(false);

  let anamneseNull = anamneseValues.filter((v: any) => v == "");

  const handleChange = (val: string, field: any) =>
    setLocationData((prev) => ({ ...prev, [field]: val }));
  const closeModal = () => setAnamneseModal(false);

  const handleGetCep = async (e: any) => {
    let val = e.target.value;
    setLocationData((prev) => ({ ...prev, cep: val }));
    if (val.length === 8) {
      setIsLoading(true);
      try {
        const res = await fetch(`https://viacep.com.br/ws/${val}/json/`);
        const json = await res.json();
        if (json) {
          setLocationData((prev: any) => ({
            neighbor: json.bairro,
            city: json.localidade,
            complement: json.complemento,
            line1: json.logradouro,
            uf: json.uf,
            cep: val,
            address: `${json.logradouro}, ${json.bairro} ${json.complemento}, ${json.localidade} - ${json.uf}`,
          }));
          setIsLoading(false);
        }
      } catch (error) {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    if (client !== null || client !== undefined)
      setLocationData(client?.address);
  }, [client]);

  return (
    <div className={styles["client-infos"]}>
      <Modal visible={anamneseModal} closeModal={closeModal}>
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
            onChange={(e) => handleChange(e.target.value, "line1")}
          />
        </InputsContainer>

        <InputsContainer>
          <StyledTextField
            label="Bairro:"
            value={locationData?.neighbor!}
            InputLabelProps={{ shrink: true }}
            sx={{ width: "80%" }}
            onChange={(e) => handleChange(e.target.value, "neighbor")}
          />

          <StyledTextField
            label="Número:"
            value={locationData?.number!}
            sx={{ width: "20%" }}
            onChange={(e) => handleChange(e.target.value, "number")}
          />
        </InputsContainer>

        <InputsContainer>
          <StyledTextField
            label="Cidade:"
            value={locationData?.city!}
            InputLabelProps={{ shrink: true }}
            onChange={(e) => handleChange(e.target.value, "city")}
            sx={{ width: "80%" }}
          />

          <StyledTextField
            label="UF:"
            value={locationData?.uf!}
            InputLabelProps={{ shrink: true }}
            sx={{ width: "20%" }}
            onChange={(e) => handleChange(e.target.value, "uf")}
          />
        </InputsContainer>

        <StyledTextField
          label="Complemento:"
          value={locationData?.complement!}
          InputLabelProps={{ shrink: true }}
          sx={{ width: "100%", mt: "16px" }}
          onChange={(e) => handleChange(e.target.value, "complement")}
        />
      </Modal>

      {anamneseKeys?.map((item: any, index: number) => (
        <p className={styles["p-anamnese"]} key={index}>
          {item} <span>{anamneseValues![index]}</span>
        </p>
      ))}
      <p className={styles["p-anamnese"]}>
        Observações: <span>{client?.observations}</span>
      </p>
      {anamneseNull.length === 10 && (
        <StyledButton onClick={() => setAnamneseModal(true)}>
          Editar Anamnese
        </StyledButton>
      )}
    </div>
  );
};

export default ClientAnamneseInfos;
