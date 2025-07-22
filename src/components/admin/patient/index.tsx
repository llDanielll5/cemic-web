/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
// TODO REFACTOR THIS PAGE

import React, { useCallback, useEffect, useState } from "react";
import { PatientAttributes } from "types/patient";
import { AddressType } from "types";
import { Divider, styled, Tabs } from "@mui/material";
import { useRecoilState, useRecoilValue } from "recoil";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import PatientInformations from "./tabs/informations";
import UserData from "@/atoms/userData";
import PatientData from "@/atoms/patient";
import HeaderPatientInformations from "./components/header-informations";
import AnamneseTab from "./tabs/anamnese";
import SchedulesPatient from "./tabs/schedules";
import {
  handleGetSinglePatient,
  handleUpdatePatient,
} from "@/axios/admin/patients";
import {
  adminTabs,
  defaultAddress,
  defaultClientData,
  professionalTabs,
} from "data";
import PatientTreatmentsTab from "./tabs/treatments";
import PatientFinanceTab from "./tabs/finance";
import PatientExams from "./tabs/exams";
import PatientProblems from "./tabs/problems";
import PatientAttachments from "./tabs/attachments";
import { AdminInfosInterface } from "types/admin";

const PatientDetails = (props: { cardId: string }) => {
  const adminData = useRecoilValue(UserData);
  const [patientData, setPatientData] = useRecoilState(PatientData);
  const [clientData, setClientData] =
    useState<PatientAttributes>(defaultClientData);
  const [clientAddress, setClientAddress] =
    useState<AddressType>(defaultAddress);

  const [addressModal, setAddressModal] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const currTabs: string[] =
    adminData?.userType !== "DENTIST" ? adminTabs : professionalTabs;
  const adminUpdate: { adminInfos: AdminInfosInterface } = {
    adminInfos: {
      ...(((patientData?.attributes?.adminInfos as
        | AdminInfosInterface
        | undefined) ?? []) as AdminInfosInterface),
      updated: adminData?.id,
      updateTimestamp: new Date(),
    },
  };

  const handleChange = (val: string, field: string) =>
    setClientData((prev) => ({ ...prev, [field]: val }));
  const handleChangeAddress = (val: string, field: string) =>
    setClientAddress((prev) => ({ ...prev, [field]: val }));
  const handleChangeTab = (
    e: React.SyntheticEvent<Element, Event>,
    nVal: string
  ) => setTabIndex(parseInt(nVal));

  const handleGetPatient = async () => {
    return await handleGetSinglePatient(props.cardId).then(
      (res) => setPatientData(res.data.data[0]),
      (err) => console.log(err.response)
    );
  };

  const handleSubmit = async () => {
    const { name, email, dateBorn, phone, rg } = clientData;
    if (email === "" || dateBorn === "" || phone === "" || rg === "")
      return alert("Preencha os campos");

    const { cep, city, line1, neighbor, uf } = clientAddress;
    const notLocationCompleted =
      city === undefined ||
      line1 === undefined ||
      neighbor === undefined ||
      uf === undefined ||
      cep?.length! < 8;

    if (notLocationCompleted) return alert("Preencha os campos de endereço!");

    let data = {
      data: {
        rg,
        name,
        email,
        phone,
        dateBorn,
        role: clientData?.role,
        address: clientAddress,
        ...adminUpdate,
      },
    };
    await handleUpdatePatient(String(patientData?.id!), data).then(
      (res) => handleGetPatient(),
      (err) => console.log(err.response)
    );
  };

  const updateClientStatus = useCallback(() => {
    if (patientData === null) return;

    let attr = patientData?.attributes;

    setClientData({
      name: attr?.name,
      email: attr?.email,
      dateBorn: attr?.dateBorn,
      phone: attr?.phone,
      cpf: attr?.cpf,
      rg: attr?.rg,
      role: attr?.role,
      address: attr?.address?.address!,
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
  }, [patientData]);

  useEffect(() => {
    updateClientStatus();
  }, [updateClientStatus]);

  useEffect(() => {
    handleGetPatient();
  }, []);

  // if (isLoading)
  //   return (
  //     <Box position="fixed" top={0} left={0} zIndex={200}>
  //       <Loading message={loadingMessage} />
  //     </Box>
  //   );

  const renderPatientTabs = (tabIndex: string) => {
    switch (tabIndex) {
      case "0":
        return (
          <PatientInformations
            clientAddress={clientAddress}
            handleChangeAddress={handleChangeAddress}
            setClientAddress={setClientAddress}
            clientData={clientData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
          />
        );
      case "1":
        return <AnamneseTab />;
      case "2":
        return <PatientFinanceTab onUpdatePatient={handleGetPatient} />;
      case "3":
        return <PatientTreatmentsTab onUpdatePatient={handleGetPatient} />;
      case "4":
        return <PatientExams />;
      case "5":
        return <SchedulesPatient onUpdatePatient={handleGetPatient} />;
      case "6":
        return <PatientProblems />;
      case "7":
        return <PatientAttachments />;
    }
  };

  return (
    <TabContainer value={tabIndex.toString()}>
      {patientData !== null && (
        <HeaderPatientInformations clientData={clientData} />
      )}

      <Divider sx={{ mt: 2 }} />

      <InnerTabContainer
        onChange={handleChangeTab}
        variant="scrollable"
        scrollButtons="auto"
      >
        {currTabs.map((v, i) => (
          <Tab key={i} label={v} value={i.toString()} />
        ))}
      </InnerTabContainer>

      {renderPatientTabs(tabIndex.toString())}
    </TabContainer>
  );
};

const TabContainer = styled(TabContext)`
  overflow: auto;
  width: 100%;
`;
const InnerTabContainer = styled(Tabs)`
  border-bottom: 1px solid ${({ theme }) => theme.palette.divider};
`;

export default PatientDetails;
