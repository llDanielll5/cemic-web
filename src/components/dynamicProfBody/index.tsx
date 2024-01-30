/* eslint-disable @next/next/no-img-element */
import React from "react";
import ProfileProfessional from "./profile";
import ScreeningProfessional from "./screening";
import { useOnSnapshotQuery } from "@/hooks/useOnSnapshotQuery";
import { collection, query, where } from "firebase/firestore";
import { db } from "@/services/firebase";

interface DynamicProfessionalBodyProps {
  page: number;
  userData: any | undefined;
  setIsCreateTreatment: (e: boolean) => void;
  setDate: (e: string) => void;
}

const DynamicProfBody = (props: DynamicProfessionalBodyProps) => {
  const hasId = props.userData?.id ?? "";
  const professionalRef = collection(db, "professionals");
  const q = query(professionalRef, where("id", "==", hasId));
  const snapUser = useOnSnapshotQuery("professionals", q, [hasId]);

  if (props.page === 1) return <ProfileProfessional userData={snapUser?.[0]} />;
  else if (props.page === 2) return;
  // <AttendanceProfessional />
  else if (props.page === 3)
    return (
      <ScreeningProfessional
        setDate={props.setDate}
        setIsCreateTreatment={props.setIsCreateTreatment}
      />
    );
  else return null;
};

export default DynamicProfBody;
