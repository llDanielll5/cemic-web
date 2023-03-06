import { useRouter } from "next/router";
import React from "react";

const PatientScreen = () => {
  const router = useRouter();
  const userid = router?.query?.userid;
  return <div />;
};

export default PatientScreen;
