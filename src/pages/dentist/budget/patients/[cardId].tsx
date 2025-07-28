/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */

import React, { useEffect, useState } from "react";
import {
  Container,
  Divider,
  Stack,
  styled,
  Tabs,
  Typography,
} from "@mui/material";
import { GetServerSidePropsContext } from "next";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { getCookie } from "cookies-next";
import axiosInstance from "@/axios";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import UserData from "@/atoms/userData";
import AnamneseTab from "@/components/dentists/_components/anamnese-tab";
import { DashboardLayout } from "@/layouts/dashboard/layout";
import HeaderPatientInformations from "@/components/admin/patient/components/header-informations";
import PatientTreatmentDentistBudgetTab from "@/components/dentists/_components/patient-treatment-budget";
import PatientData from "@/atoms/patient";
import PatientExams from "@/components/admin/patient/tabs/exams";

const currTabs = ["Anamnese", "Tratamentos", "Exames"];

const PatientBudgetDetails = ({
  patient,
}: {
  patient: StrapiData<PatientInterface>;
}) => {
  const adminData = useRecoilValue(UserData);
  const [tabIndex, setTabIndex] = useState(0);
  const setPatientData = useSetRecoilState(PatientData);

  const handleChangeTab = (
    e: React.SyntheticEvent<Element, Event>,
    nVal: string
  ) => setTabIndex(parseInt(nVal));

  useEffect(() => {
    setPatientData(patient);
  }, []);

  const renderPatientTabs = (tabIndex: string) => {
    switch (tabIndex) {
      case "0":
        return <AnamneseTab patient={patient} />;
      case "1":
        return <PatientTreatmentDentistBudgetTab patient={patient} />;
      case "2":
        return <PatientExams />;
    }
  };

  return (
    <Container sx={{ pb: 8, pt: 4 }}>
      <Stack>
        <Typography variant="h5">Detalhes do Paciente</Typography>
      </Stack>
      <TabContainer value={tabIndex.toString()}>
        {patient !== null && (
          <HeaderPatientInformations clientData={patient.attributes} />
        )}

        <Divider sx={{ mt: 2 }} />

        <InnerTabContainer
          onChange={handleChangeTab}
          variant="scrollable"
          scrollButtons="auto"
        >
          {currTabs.map((v, i) => (
            <Tab
              key={i}
              label={v}
              value={i.toString()}
              sx={{
                color: tabIndex === i ? "primary.main" : "text.secondary",
                fontWeight: tabIndex === i ? 800 : 500,
                textTransform: "none",
              }}
            />
          ))}
        </InnerTabContainer>

        {renderPatientTabs(tabIndex.toString())}
      </TabContainer>
    </Container>
  );
};

PatientBudgetDetails.getLayout = (page: React.ReactElement) => (
  <DashboardLayout>{page}</DashboardLayout>
);

const TabContainer = styled(TabContext)`
  overflow: auto;
  width: 100%;
`;
const InnerTabContainer = styled(Tabs)`
  border-bottom: 1px solid ${({ theme }) => theme.palette.divider};
`;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { cardId } = context.query as { cardId: string };
  const jwt = context
    ? getCookie("jwt", { req: context.req, res: context.res })
    : undefined;

  const user = context
    ? getCookie("user", { req: context.req, res: context.res })
    : undefined;

  const userJson: AdminType = JSON.parse(user as string);
  const jwtHeader = {
    headers: {
      ...(jwt && { Authorization: `Bearer ${jwt}` }),
    },
  };

  if (userJson.userType === "DENTIST") {
    const { data } = await axiosInstance.get(
      `patients?filters[cardId][$eq]=${cardId}&populate[odontogram][populate]=*&populate[patient_budget_dentists][filters][isCompleted][$eq]=false`,
      jwtHeader
    );

    return { props: { patient: data.data[0] } };
  }

  return { props: { patient: null } };
}

export default PatientBudgetDetails;
