/* eslint-disable @next/next/no-img-element */
import React, { useCallback, useEffect, useState } from "react";
import { AddressType } from "types";
import ClientInformationsProfessional from "./informationsProfessional";
import ClientInformationsAdmin from "./informations";
import Loading from "@/components/loading";
import { handleUpdatePatient } from "@/axios/admin/patients";
import { Box, styled, Button } from "@mui/material";
import { PatientAttributes } from "types/patient";
import EditPatientAddressModal from "./modals/editAddress";
import PatientInformations from "./components/patientInformations";
import {
  adminTabs,
  defaultAddress,
  defaultClientData,
  professionalTabs,
} from "data";

interface ClientInfoProps {
  client?: any;
  onUpdate: any;
  adminData: any;
}

const ClientInfos = (props: ClientInfoProps) => {
  const { client, onUpdate, adminData }: any = props;
  const [clientData, setClientData] =
    useState<PatientAttributes>(defaultClientData);
  const [clientAddress, setClientAddress] =
    useState<AddressType>(defaultAddress);

  const [addressModal, setAddressModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [tabIndex, setTabIndex] = useState(0);
  const currTabs =
    adminData?.userType !== "DENTIST" ? adminTabs : professionalTabs;

  const getAddressValues = () => setAddressModal(!addressModal);
  const handleChange = (val: any, field: any) =>
    setClientData((prev) => ({ ...prev, [field]: val }));
  const handleChangeAddress = (val: any, field: any) =>
    setClientAddress((prev) => ({ ...prev, [field]: val }));

  const adminUpdate = {
    adminInfos: { updated: adminData?.id, updateTimestamp: new Date() },
  };

  const handleEditAddress = async () => {
    const { cep, city, line1, neighbor, uf } = clientAddress;
    const notLocationCompleted =
      city === undefined ||
      line1 === undefined ||
      neighbor === undefined ||
      uf === undefined ||
      cep?.length! < 8;

    if (notLocationCompleted) return alert("Preencha os campos de endereço!");
    let data = { data: { address: clientAddress, ...adminUpdate } };

    setLoadingMessage("Alterando Endereço do Paciente!");
    return await handleUpdatePatient(client?.id, data).then(
      (res) => {
        setIsLoading(false);
        setAddressModal(!addressModal);
        onUpdate();
      },
      (err) => {
        setIsLoading(false);
        console.log(err.response);
      }
    );
  };

  const updateClientStatus = useCallback(() => {
    if (!client || client === undefined) return;
    let attr = client?.attributes;

    setClientData({
      name: attr?.name,
      email: attr?.email,
      dateBorn: attr?.dateBorn,
      phone: attr?.phone,
      cpf: attr?.cpf,
      rg: attr?.rg,
      role: attr?.role,
      address: attr?.address?.address,
    });
    setClientAddress({
      address: attr?.address?.address,
      cep: attr?.address?.cep,
      city: attr?.address?.city,
      complement: attr?.address?.complement,
      line1: attr?.address?.line1,
      neighbor: attr?.address?.neighbor,
      number: attr?.address?.number,
      uf: attr?.address?.uf,
    });
  }, [client]);

  useEffect(() => {
    updateClientStatus();
  }, [updateClientStatus]);

  if (isLoading)
    return (
      <Box position="fixed" top={0} left={0} zIndex={200}>
        <Loading message={loadingMessage} />
      </Box>
    );

  return (
    <Box>
      <TabsContainer>
        {currTabs.map((item, index) => {
          const style = tabIndex === index ? "primary" : "inherit";
          return (
            <StyledButton
              key={index}
              color={style}
              variant="contained"
              sx={{ height: "30px" }}
              onClick={() => setTabIndex(index)}
              title={`Aba ${item}`}
            >
              {item}
            </StyledButton>
          );
        })}
      </TabsContainer>

      <EditPatientAddressModal
        visible={addressModal}
        clientAddress={clientAddress}
        setClientAddress={setClientAddress}
        handleEditAddress={handleEditAddress}
        closeModal={() => setAddressModal(false)}
        handleChangeAddress={handleChangeAddress}
      />

      {tabIndex === 0 && (
        <PatientInformations
          getAddressValues={getAddressValues}
          handleChange={handleChange}
          onUpdate={onUpdate}
          setIsLoading={setIsLoading}
          setLoadingMessage={setLoadingMessage}
          updateClientStatus={updateClientStatus}
          client={client}
          clientData={clientData}
        />
      )}

      {adminData?.userType === "DENTIST" ? (
        <ClientInformationsProfessional tabIndex={tabIndex} client={client} />
      ) : adminData?.userType === "ADMIN" ? (
        <ClientInformationsAdmin tabIndex={tabIndex} client={client} />
      ) : null}
    </Box>
  );
};

const TabsContainer = styled(Box)`
  display: flex;
  width: 100%;
  column-gap: 0.5rem;
  padding: 1rem;
  flex-wrap: wrap;
  border-radius: 0.3rem;
  row-gap: 6px;
`;

const StyledButton = styled(Button)`
  -webkit-box-shadow: 4px 5px 13px -7px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 4px 5px 13px -7px rgba(0, 0, 0, 0.75);
  box-shadow: 4px 5px 13px -7px rgba(0, 0, 0, 0.75);
`;

export default ClientInfos;
