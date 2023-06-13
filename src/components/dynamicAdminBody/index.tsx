import React, { useState, useEffect } from "react";
import { useOnSnapshotQuery } from "@/hooks/useOnSnapshotQuery";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/services/firebase";
import { ClientType } from "types";
import ClientsAdmin from "./clients";
import ProfessionalsAdmin from "./professionals";
import LecturesAdmin from "./lectures";
import ScreeningAdmin from "./screening";
import DashboardAdmin from "../admin/dashboard";
import TreatmentsAdmin from "./treatments";
import ReceiptPageAdmin from "./receipts";
import ProfileAdmin from "./profile";
import AdminBlog from "./blog";

export interface AdminBodyProps {
  page: number;
  setClientDetailsVisible: (e: boolean) => void;
  setIsCreateTreatment: (e: boolean) => void;
  setScreeningVisible: (e: boolean) => void;
  setIsGeneratePayment: (e: boolean) => void;
  setClientID: (e: string) => void;
  setDate: (e: string) => void;
}
export type ClientTypes = "pre-register" | "patient" | "selected";

const patientsRef = collection(db, "clients");

const DynamicAdminBody = (props: AdminBodyProps) => {
  const [patientFilterValue, setPatientFilterValue] = useState("");
  const [professionalFilterType, setProfessionalFilterType] = useState("");
  const [professionalFilterValue, setProfessionalFilterValue] = useState("");
  const [filterLetter, setFilterLetter] = useState<string | null>("A");
  const [patientsData, setPatientsData] = useState<ClientType[] | []>([]);
  const [filterByClientType, setFilterByClientType] =
    useState<ClientTypes>("patient");

  /**  ONSNAPSHOT FOR LETTER FILTER   */
  const qPatientLetter = query(
    patientsRef,
    where("firstLetter", "==", filterLetter),
    where("role", "==", filterByClientType)
  );
  const filterPatientByLetter = useOnSnapshotQuery("clients", qPatientLetter, [
    filterLetter,
    filterByClientType,
  ]);
  /** ********** */

  const handleSetContentProfessionals = (e: string) => {
    if (e === "CRO") setProfessionalFilterType("cro");
    else setProfessionalFilterType("cpf");
  };

  const handleFilterPatient = async () => {
    const qPatientFilter = (type: "id" | "cpf") => {
      return query(patientsRef, where(type, "==", patientFilterValue));
    };
    const queryFunction = async (type: "id" | "cpf") => {
      const querySnapshot = await getDocs(qPatientFilter(type));
      querySnapshot.forEach((doc) => {
        documents.push(doc.data());
      });
      setPatientsData(documents);
    };
    const documents: any[] = [];
    return queryFunction("cpf");
  };

  useEffect(() => {
    setPatientsData(filterPatientByLetter);
  }, [filterPatientByLetter, patientFilterValue, filterByClientType]);

  useEffect(() => {
    setFilterLetter("A");
    setPatientFilterValue("");
  }, [props.page]);

  if (props.page === 1) {
    return <DashboardAdmin />;
  }

  if (props.page === 2) {
    return (
      <ClientsAdmin
        setClientID={props.setClientID}
        patientsData={patientsData}
        filterLetter={filterLetter}
        setFilterLetter={setFilterLetter}
        patientFilterValue={patientFilterValue}
        filterByClientType={filterByClientType}
        handleFilterPatient={handleFilterPatient}
        setFilterByClientType={setFilterByClientType}
        setPatientFilterValue={setPatientFilterValue}
        setClientDetailsVisible={props.setClientDetailsVisible}
      />
    );
  }

  if (props.page === 3) {
    return <ReceiptPageAdmin />;
  }
  if (props.page === 4) {
    return (
      <ProfessionalsAdmin
        professionalFilterType={professionalFilterType}
        professionalFilterValue={professionalFilterValue}
        setProfessionalFilterValue={setProfessionalFilterValue}
        handleSetContentProfessionals={handleSetContentProfessionals}
      />
    );
  }

  if (props.page === 5) {
    return (
      <ScreeningAdmin
        setClientDetailsVisible={props.setClientDetailsVisible}
        setIsGeneratePayment={props.setIsGeneratePayment}
        screeningModal={props.setScreeningVisible}
        setClientID={props.setClientID}
        setDate={props.setDate}
      />
    );
  }

  if (props.page === 6) {
    return <LecturesAdmin />;
  }

  if (props.page === 7) {
    return (
      <TreatmentsAdmin setIsCreateTreatment={props.setIsCreateTreatment} />
    );
  }
  if (props.page === 8) return <AdminBlog />;
  if (props.page === 9) {
    return <ProfileAdmin />;
  }
};

export default DynamicAdminBody;
