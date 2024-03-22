//@ts-nocheck
import React, { useEffect, useState } from "react";
import { useOnSnapshotQuery } from "@/hooks/useOnSnapshotQuery";
import { ClientTreatmentsProps, ScreeningInformations } from "types";
import { Box, styled, Typography, Button } from "@mui/material";

import Modal from "@/components/modal";
import AddIcon from "@mui/icons-material/Add";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import TreatmentPlanUpdate from "./treatmentPlan";
import EditNoteIcon from "@mui/icons-material/EditNote";
import {
  closeIcon,
  successIcon,
} from "@/components/dynamicAdminBody/screening/screeningDetails";
import {
  Timestamp,
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";

interface ScreeningDetailsProfessionalProps {
  infos: ScreeningInformations;
  setIsCreateTreatment: (e: boolean) => void;
}

const buttonStyle = {
  border: "2px solid var(--dark-blue)",
  color: "var(--dark-blue)",
  margin: "4px",
};

const today = new Date();
const todayIso = today.toISOString().substring(0, 10);

const ScreeningDetailsProfessional = (
  props: ScreeningDetailsProfessionalProps
) => {
  const { infos, setIsCreateTreatment } = props;
  const hasId = infos?.patientId ?? "";
  const [data, setData] = useState<ScreeningInformations | null>(null);
  const [treatments, setTreatments] = useState<
    ClientTreatmentsProps | null | undefined
  >(null);
  const screeningRef = collection(db, "screenings");
  const q = query(screeningRef, where("patientId", "==", hasId));
  const snapUser = useOnSnapshotQuery("screenings", q, [hasId]);
  const [treatmentPlansVisible, setTreatmentPlansVisible] = useState(false);
  const hasOldScreening = todayIso >= infos?.date;

  useEffect(() => {
    setData(snapUser[0]);
  }, [snapUser]);

  useEffect(() => {
    if (
      data?.patientId === "" ||
      data?.patientId === null ||
      data?.patientId === undefined
    )
      return;
    const getSnapTreatments = async () => {
      const ref = collection(db, "clients_treatments");
      const qSnap = query(ref, where("client", "==", data!.patientId));
      const docs = await getDocs(qSnap);
      if (docs.docs.length > 0) {
        const document: any = docs.docs[0].data();
        setTreatments(document);
      } else
        setTreatments({
          treatments: { treatment_plan: [], forwardeds: [], realizeds: [] },
        });
    };
    getSnapTreatments();
  }, [data, data?.patientId]);

  if (!infos) return null;
  if (treatments === null) return null;
  if (data === null || snapUser.length === 0) return null;

  const hasTreatmentPlan = treatments?.treatments?.treatment_plan?.length > 0;
  const notHasPlanTreat = treatments?.treatments?.treatment_plan?.length === 0;

  const backgroundcolor = data?.isMissed
    ? { backgroundColor: "red" }
    : { backgroundColor: "green" };

  const handleUpdateValue = async (field: string, value: any) => {
    const reference = doc(db, "screenings", infos.id!);
    return await updateDoc(reference, { [field]: value }).catch((err) => {
      return alert("Erro ao realizar atualização, " + err.code);
    });
  };

  const handleSaveTreatments = async (field: string, values: any[]) => {
    setIsCreateTreatment(true);
    await handleUpdateValue(field, values).finally(async () => {
      const timestamp = Timestamp.now().seconds;
      const clientId = data!.patientId;
      const id = `${clientId}-${timestamp}`;
      const treatRef = collection(db, "clients_treatments");
      const q = query(treatRef, where("screeningId", "==", infos!.id));
      const findTreatment = await getDocs(q);
      if (findTreatment.size === 0) {
        const ref = doc(db, "clients_treatments", id);
        const dataTreatments: ClientTreatmentsProps = {
          treatments: {
            treatment_plan: values,
            realizeds: [],
            forwardeds: [],
            toRealize: values,
          },
          client: clientId,
          updatedAt: Timestamp.now(),
          actualProfessional: "",
          screeningId: data!.id!,
          professionalScreening: data!.professionalId,
          medias: [],
          negotiateds: [],
          id,
        };
        return await setDoc(ref, dataTreatments)
          .then(() => {
            setIsCreateTreatment(false);
            setTreatmentPlansVisible(false);
            return alert("Sucesso ao gerar o plano de tratamento");
          })
          .catch(() => {
            setIsCreateTreatment(false);
            return alert("Erro ao atualizar informações do cliente");
          });
      } else {
        const currDoc = findTreatment.docs[0].data();
        const ref = doc(db, "clients_treatments", currDoc.id);
        return await updateDoc(ref, {
          "treatments.treatment_plan": values,
          "treatments.toRealize": values,
        })
          .then(() => {
            setIsCreateTreatment(false);
            setTreatmentPlansVisible(false);
            return alert("Sucesso ao gerar o plano de tratamento");
          })
          .catch(() => {
            setIsCreateTreatment(false);
            return alert("Erro ao atualizar informações do cliente");
          });
      }
    });
  };

  function handleCloseTreatmentPlans() {
    setTreatmentPlansVisible(false);
    return;
  }
  return (
    <Container>
      <Modal
        visible={treatmentPlansVisible}
        closeModal={handleCloseTreatmentPlans}
      >
        <TreatmentPlanUpdate
          onSaveTreatments={handleSaveTreatments}
          setVisible={setTreatmentPlansVisible}
        />
      </Modal>

      <Name variant="subtitle1">{data?.name}</Name>
      <Typography
        my={1}
        variant="caption"
        display={"flex"}
        alignSelf={"center"}
        columnGap={"4px"}
      >
        ID de triagem: <span> {data?.id}</span>
      </Typography>
      <Typography
        mb={1}
        variant="caption"
        display={"flex"}
        alignSelf={"center"}
        columnGap={"4px"}
      >
        Paciente agendado por: {data?.reporter_name}
      </Typography>

      <Form px={2}>
        <BoolContainer>
          <Hours variant="subtitle1">
            <AccessTimeIcon /> {data?.hour}h
          </Hours>
          {data?.isMissed === null ? (
            <HasMissed>
              <Typography variant="subtitle1">Compareceu?</Typography>
              {successIcon({
                onClick: () => handleUpdateValue("isMissed", false),
              })}
              {closeIcon({
                onClick: () => handleUpdateValue("isMissed", true),
              })}
            </HasMissed>
          ) : (
            <BoolsOptions
              variant="subtitle1"
              color={"white"}
              sx={backgroundcolor}
            >
              {data?.isMissed ? "Faltou" : "Presente"}
            </BoolsOptions>
          )}
        </BoolContainer>

        <DoubleColumn>
          <Box display={"flex"} alignItems={"center"} columnGap={"4px"}>
            <Typography variant="subtitle1">Dentista: </Typography>
            <Typography variant="body2">{data?.professional_name}</Typography>
          </Box>
          <Box display={"flex"} alignItems={"center"} columnGap={"4px"}>
            <Typography variant="subtitle1">ID Dentista: </Typography>
            <Typography variant="body2">{data?.professionalId}</Typography>
          </Box>
        </DoubleColumn>

        {hasTreatmentPlan && (
          <Box>
            <Typography
              variant="subtitle1"
              alignSelf={"center"}
              textAlign={"center"}
              mb={2}
            >
              Plano de Tratamento:
            </Typography>
            {treatments?.treatments?.treatment_plan?.map((v, i) => (
              <Box
                key={i}
                display={"flex"}
                alignItems={"center"}
                columnGap={"4px"}
                width={"100%"}
                mb={1}
              >
                <Typography variant="subtitle1">{v?.region} - </Typography>
                <Typography variant="subtitle1">
                  {v?.treatments?.name}
                </Typography>
              </Box>
            ))}
            {hasOldScreening && (
              <Button
                variant="outlined"
                color="secondary"
                sx={{ ...buttonStyle, width: "100%" }}
                endIcon={<EditNoteIcon />}
                onClick={() => setTreatmentPlansVisible(true)}
              >
                Atualizar Plano de Tratamento
              </Button>
            )}
          </Box>
        )}

        {notHasPlanTreat && (
          <Button
            variant="outlined"
            color="secondary"
            sx={buttonStyle}
            endIcon={<AddIcon />}
            onClick={() => setTreatmentPlansVisible(true)}
          >
            Adicionar Plano de Tratamento
          </Button>
        )}
      </Form>
    </Container>
  );
};

const Container = styled(Box)`
  padding: 6px;
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;

const Name = styled(Typography)`
  text-align: center;
  width: 100%;
  margin: 12px 0 4px 0;
`;

const Form = styled(Box)`
  display: flex;
  flex-direction: column;
  border: 1.5px solid var(--dark-blue);
`;

const BoolContainer = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  column-gap: 4px;
  padding: 0 4px;
  width: 100%;
  margin: 12px 0;
  @media screen and (max-width: 900px) {
    flex-direction: column;
    width: 100%;
    align-items: center;
    justify-content: center;
  }
`;

const HasMissed = styled(Box)`
  display: flex;
  align-items: center;
  border: 1.3px solid var(--dark-blue);
  margin: 8px 0;
  border-radius: 4px;
  padding: 0 2px 0 8px;
  @media screen and (max-width: 900px) {
    margin: 4px 0;
    padding: 0 1px 0 4px;
    justify-content: center;
    font-size: 12px;
  }
`;

const BoolsOptions = styled(Typography)`
  padding: 2px 4px;
  border-radius: 4px;
  margin: 4px 0;
`;

const Hours = styled(Typography)`
  display: flex;
  align-items: center;
`;

const Button50 = styled(Button)`
  width: 50%;
  align-self: center;
  margin: 8px 0;
  @media screen and (max-width: 900px) {
    width: 90%;
  }
`;

const DoubleColumn = styled(Box)`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  @media screen and (max-width: 500px) {
    flex-direction: column;
  }
`;

export default ScreeningDetailsProfessional;
