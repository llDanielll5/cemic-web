import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/layouts/dashboard/layout";
import { Container, Stack, Typography } from "@mui/material";
import { PatientToBudgetTable } from "@/components/table/budget-patient-table";
import { useLoading } from "@/contexts/LoadingContext";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import axiosInstance from "@/axios";

interface ExtendedPatientToBudgetProps extends PatientInterface {
  budgetToPatientId: number;
}

const DentistBudgetPage = () => {
  const { push, asPath, replace } = useRouter();
  const { handleLoading } = useLoading();
  const [patients, setPatients] = useState<
    StrapiRelationData<ExtendedPatientToBudgetProps>[]
  >([]);

  const fetchBudgets = async () => {
    try {
      handleLoading(true, "Buscando avaliações...");
      const response = await axiosInstance.get(
        `patient-budget-dentists?filters[isCompleted][$eq]=false&populate[patient]=*`
      );
      const budgets =
        response.data as StrapiListRelationData<PatientToBudgetInterface>;

      const mappedPatients = budgets?.data.map((b) => {
        return {
          data: {
            attributes: {
              ...(b.attributes.patient as StrapiRelationData<PatientInterface>)
                .data.attributes,
              budgetToPatientId: b.id,
            },
            id: b.id,
          },
        };
      });

      setPatients(mappedPatients || []);
    } catch (error) {
      toast.error("Erro ao buscar avaliações.");
      console.error(error);
    } finally {
      handleLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  const handleClickPatient = (cardId: string) => {
    push("/dentist/budget/patients/" + cardId);
  };

  const updatePage = () => replace(asPath);

  const onBackToAdministration = async (
    patientToBudget: StrapiData<ExtendedPatientToBudgetProps>
  ) => {
    const id = patientToBudget?.id;
    handleLoading(true, "Atualizando dados de encaminhamento do paciente!");
    try {
      await axiosInstance.put(`/patient-budget-dentists/${String(id)}`, {
        data: { isCompleted: true },
      });
      toast.success("Sucesso ao retornar paciente para a CEMIC!");
      fetchBudgets();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao retornar o paciente para a CEMIC!");
    } finally {
      handleLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ p: 2 }}>
      <Typography variant="h4">Avaliações</Typography>

      <Stack py={4}>
        <PatientToBudgetTable
          items={patients}
          onBudgetForward={onBackToAdministration}
          onClick={handleClickPatient}
          onEdit={() => {}}
        />
      </Stack>
    </Container>
  );
};

DentistBudgetPage.getLayout = (page: React.ReactElement) => (
  <DashboardLayout>{page}</DashboardLayout>
);

export default DentistBudgetPage;
