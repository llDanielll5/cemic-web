/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */

import React, { useCallback, useEffect, useState } from "react";
import { PatientAttributes } from "types/patient";
import { AddressType } from "types";
import { Box, Button, Divider } from "@mui/material";
import Tab from "@mui/material/Tab";
import TabList from "@mui/lab/TabList";
import Loading from "@/components/loading";
import TabContext from "@mui/lab/TabContext";
import PatientInformations from "./tabs/informations";
import SaveIcon from "@mui/icons-material/Save";
import { useRecoilState, useRecoilValue } from "recoil";
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

const PatientDetails = (props: { cardId: any }) => {
  const adminData: any = useRecoilValue(UserData);
  const [patientData, setPatientData] = useRecoilState(PatientData);
  const [clientData, setClientData] =
    useState<PatientAttributes>(defaultClientData);
  const [clientAddress, setClientAddress] =
    useState<AddressType>(defaultAddress);

  const [addressModal, setAddressModal] = useState(false);
  // const [isLoading, setIsLoading] = useState(false);
  // const [loadingMessage, setLoadingMessage] = useState("");
  const [tabIndex, setTabIndex] = useState(0);
  const currTabs =
    adminData?.userType !== "DENTIST" ? adminTabs : professionalTabs;
  const adminUpdate = {
    adminInfos: {
      ...(patientData?.attributes?.adminInfos ?? []),
      updated: adminData.id,
      updateTimestamp: new Date(),
    },
  };

  const handleChange = (val: any, field: any) =>
    setClientData((prev) => ({ ...prev, [field]: val }));
  const handleChangeAddress = (val: any, field: any) =>
    setClientAddress((prev) => ({ ...prev, [field]: val }));
  const handleChangeTab = (e: any, nVal: string) => setTabIndex(parseInt(nVal));

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
    await handleUpdatePatient(patientData?.id!, data).then(
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
    <TabContext value={tabIndex.toString()}>
      {patientData !== null && (
        <HeaderPatientInformations clientData={clientData} />
      )}

      <Divider sx={{ mt: 2 }} />
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <TabList onChange={handleChangeTab}>
          {currTabs.map((v, i) => (
            <Tab key={i} label={v} value={i.toString()} />
          ))}
        </TabList>
      </Box>

      {renderPatientTabs(tabIndex.toString())}
    </TabContext>
  );
};

export default PatientDetails;
