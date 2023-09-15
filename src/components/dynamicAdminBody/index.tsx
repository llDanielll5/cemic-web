import React, { useState } from "react";
import ClientsAdmin from "./clients";
import ProfessionalsAdmin from "./professionals";
import LecturesAdmin from "./lectures";
import ScreeningAdmin from "./screening";
import DashboardAdmin from "../admin/dashboard";
import TreatmentsAdmin from "./treatments";
import ReceiptPageAdmin from "./receipts";
import ProfileAdmin from "./profile";
import AdminBlog from "./blog";
import AdminPayments from "./payments";
import PendingsTab from "./pendings";

export interface AdminBodyProps {
  page: number;
  setClientDetailsVisible: (e: boolean) => void;
  setIsCreateTreatment: (e: boolean) => void;
  setScreeningVisible: (e: boolean) => void;
  setIsGeneratePayment: (e: boolean) => void;
  setClientID: (e: string) => void;
}
export type ClientTypes = "pre-register" | "patient" | "selected" | "";

const DynamicAdminBody = (props: AdminBodyProps) => {
  const [professionalFilterType, setProfessionalFilterType] = useState("");
  const [professionalFilterValue, setProfessionalFilterValue] = useState("");

  const handleSetContentProfessionals = (e: string) => {
    if (e === "CRO") setProfessionalFilterType("cro");
    else setProfessionalFilterType("cpf");
  };

  if (props.page === 1) {
    return <DashboardAdmin />;
  }

  if (props.page === 2) {
    return (
      <ClientsAdmin
        setClientID={props.setClientID}
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
  if (props.page === 8) return <AdminPayments />;
  if (props.page === 9) return <PendingsTab />;
  if (props.page === 10) return <AdminBlog />;
  if (props.page === 11) {
    return <ProfileAdmin />;
  }
};

export default DynamicAdminBody;
