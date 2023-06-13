/* eslint-disable @next/next/no-img-element */
import React from "react";
import { ClientType } from "types";
import ProfilePatient from "../patient/profile";
import UserPayments from "./payments";
import UserExams from "./exams";
import PatientSchedules from "./schedules";

interface DynamicUserBodyProps {
  page: number;
  userData: ClientType | undefined;
  setIsLoading: (e: boolean) => void;
}

const DynamicUserBody = (props: DynamicUserBodyProps) => {
  if (props.page === 1)
    return (
      <ProfilePatient
        userData={props?.userData}
        setIsLoading={props.setIsLoading}
      />
    );
  if (props.page === 2) return <PatientSchedules />;
  if (props.page === 3) return <UserPayments />;
  if (props.page === 4) return <UserExams />;
  else return null;
};

export default DynamicUserBody;
