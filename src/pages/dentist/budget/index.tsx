import React from "react";
import { DashboardLayout } from "@/layouts/dashboard/layout";
import { Container, Divider, Stack, Typography } from "@mui/material";
import { PatientToBudgetTable } from "@/components/table/budget-patient-table";
import { contextUserAdmin } from "src/services/server-props";
import { useLoading } from "@/contexts/LoadingContext";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import axiosInstance from "@/axios";

interface ExtendedPatientToBudgetProps extends PatientInterface {
  budgetToPatientId: number;
}

const DentistBudgetPage = ({
  budgets,
}: {
  budgets: StrapiListRelationData<PatientToBudgetInterface>;
}) => {
  const { push, asPath, replace } = useRouter();
  const { handleLoading } = useLoading();
  const patients = budgets.data.map((b, ind) => {
    return {
      data: {
        attributes: {
          ...(b.attributes.patient as StrapiRelationData<PatientInterface>).data
            .attributes,
          budgetToPatientId: b.id,
        },
        id: b.id,
      },
    };
  }) as StrapiRelationData<ExtendedPatientToBudgetProps>[];

  const handleClickPatient = (cardId: string) => {
    push("/dentist/budget/patients/" + cardId);
  };

  const updatePage = () => replace(asPath);

  const onBackToAdministration = async (
    patientToBudget: StrapiData<ExtendedPatientToBudgetProps>
  ) => {
    const id = patientToBudget?.id;
    handleLoading(true, "Atualizando dados de encaminhamento do paciente!");
    const data = { isCompleted: true };
    try {
      await axiosInstance.put(`/patient-budget-dentists/${String(id)}`, {
        data,
      });
      toast.success("Sucesso ao retornar paciente para a CEMIC!");
      updatePage();
    } catch (error) {
      console.log({ error });
      toast.error("Erro ao retornar o paciente para a CEMIC!");
    } finally {
      handleLoading(false);
    }
  };

  return (
    <Container maxWidth={"lg"} sx={{ p: 2 }}>
      <Typography variant="h4">Avaliações</Typography>

      <Stack py={4}>
        <PatientToBudgetTable
          items={patients}
          onBudgetForward={onBackToAdministration}
          onClick={(cardId) => handleClickPatient(cardId)}
          onEdit={() => {}}
        />
      </Stack>
    </Container>
  );
};

DentistBudgetPage.getLayout = (page: React.ReactElement) => (
  <DashboardLayout>{page}</DashboardLayout>
);

export async function getServerSideProps(context: GetServerSidePropsContext) {
  try {
    const { jwtHeader, userJson } = contextUserAdmin(context);

    if (userJson?.userType === "DENTIST") {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000); // 15s

      try {
        const { data } = await axiosInstance.get(
          `patient-budget-dentists?filters[isCompleted][$eq]=false&populate[patient]=*`,
          {
            ...jwtHeader,
            signal: controller.signal,
          }
        );
        clearTimeout(timeout);
        return { props: { budgets: data } };
      } catch (err: any) {
        clearTimeout(timeout);
        if (err.name === "AbortError") {
          console.error("Requisição abortada por timeout");
        } else {
          console.error("Erro na requisição:", err);
        }
        return {
          props: { budgets: null, error: "Erro na requisição de dados" },
        };
      }
    }

    return { props: { budgets: null } };
  } catch (error) {
    console.error("Erro no getServerSideProps:", error);
    return {
      props: {
        budgets: null,
        error: "Erro ao carregar dados do servidor",
      },
    };
  }
}

export default DentistBudgetPage;
