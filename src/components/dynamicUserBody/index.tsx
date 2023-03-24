/* eslint-disable @next/next/no-img-element */
import React from "react";
import { ClientType } from "types";
import useWindowSize from "@/hooks/useWindowSize";
import ProfilePatient from "../patient/profile";

interface DynamicUserBodyProps {
  page: number;
  userData: ClientType | undefined;
  setIsLoading: (e: boolean) => void;
}

const DynamicUserBody = (props: DynamicUserBodyProps) => {
  const size = useWindowSize();

  if (props.page === 1)
    return (
      <ProfilePatient
        userData={props?.userData}
        setIsLoading={props.setIsLoading}
      />
    );
};

export default DynamicUserBody;
