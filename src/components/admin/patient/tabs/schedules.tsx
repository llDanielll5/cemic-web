/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useState } from "react";
import Modal from "@/components/modal";
import UserData from "@/atoms/userData";
import { useRecoilValue } from "recoil";
import { parseToothRegion } from "@/services/services";
import { ForwardPatientTable } from "@/components/table/forward-patient-table";
import { FinishedsTreatmentsPatientTable } from "@/components/table/finisheds-treatments-patient-table";
import RunCircleOutlinedIcon from "@mui/icons-material/RunCircleOutlined";
import TransferWithinAStationIcon from "@mui/icons-material/TransferWithinAStation";
import FinishPatientTreatmentsModal from "../modals/finish-treatments";
import CheckIcon from "@mui/icons-material/Check";
import PatientData from "@/atoms/patient";
import {
  getListOfDentists,
  handleCreateForwardPatientTreatments,
} from "@/axios/admin/dentists";
import {
  handleFinishTreatmentsOfPatient,
  handleGetFinishedTreatmentsOfPatient,
} from "@/axios/admin/patient-treatments";
import {
  Box,
  Typography,
  Autocomplete,
  TextField,
  Button,
  styled,
  Stack,
  Paper,
} from "@mui/material";

const SchedulesPatient = (props: { onUpdatePatient: () => void }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [dentists, setDentists] = useState<any[]>([]);
  const adminData: any = useRecoilValue(UserData);
  const patientData = useRecoilValue(PatientData);
  const [patientFinishedTreatments, setPatientFinishedTreatments] = useState<
    any[]
  >([]);
  const [finishTreatmentsModal, setFinishTreatmentsModal] = useState(false);
  const [forwardModalVisible, setForwardModalVisible] = useState(false);
  const [treatmentsToForward, setTreatmentsToForward] = useState<any[]>([]);
  const [selectedProfessional, setSelectedProfessional] = useState<any | null>(
    null
  );

  const patient: any = patientData?.attributes;
  const patientTreatments = patient?.treatments?.data;
  console.log({ patientTreatments });
  // const notConcludeds = useMemo(
  //   () =>
  //     patientTreatments?.filter(
  //       (treat: any) =>
  //         treat.attributes.finishedBy.data === null &&
  //         treat.attributes.payment.data !== null &&
  //         treat.attributes.finishedHistory.data === null
  //     ),
  //   [patientTreatments]
  // );

  const forwardedTreatmentsOfPatient = patient?.forwardedTreatments?.data;
  const [patientTreatmentsArr, setPatientTreatmentsArr] = useState<any[]>([]);

  const handleCloseForwardModal = () => {
    setForwardModalVisible(false);
    setPatientTreatmentsArr([]);
    setTreatmentsToForward([]);
    setSelectedProfessional(null);
    return;
  };

  const handleGetAllDentists = async () => {
    return await getListOfDentists().then(
      (res) => {
        const dentists = res.data;
        const map = dentists.map((v: any) => {
          return { name: v.name, id: v.id };
        });

        setDentists(map);
      },
      (err) => console.log(err.response)
    );
  };

  const handleAddForwardTreatments = (item: any) => {
    const filter = patientTreatmentsArr.filter((treat) => treat !== item);
    setPatientTreatmentsArr(filter);
    return setTreatmentsToForward((prev) => [...(prev ?? []), item]);
  };
  const handleDeleteForward = (item: any) => {
    const filter = treatmentsToForward.filter((treat) => treat !== item);
    setTreatmentsToForward(filter);
    return setPatientTreatmentsArr((prev) => [...(prev ?? []), item]);
  };

  const handleSendPatient = async () => {
    const treatmentsToSend = treatmentsToForward.map((v) => v.id);
    const adminInfos = { created: adminData?.id, createTimestamp: new Date() };
    const data = {
      treatments: treatmentsToSend,
      dentist: selectedProfessional.id,
      patient: patientData?.id,
      date: new Date(),
      adminInfos,
      obs: "",
    };

    return await handleCreateForwardPatientTreatments(data).then(
      (res) => {
        handleCloseForwardModal();
        props.onUpdatePatient();
      },
      (err) => console.log(err.response)
    );
  };

  const getFinishedTreatmentsOfPatient = async () => {
    return await handleGetFinishedTreatmentsOfPatient(
      String(patientData?.id!)
    ).then(
      (res) => setPatientFinishedTreatments(res.data.data),
      (err) => console.log(err.response)
    );
  };

  const handleFinishTreatments = async (values: any) => {
    const data = {
      dentist: values.dentist,
      treatments: values.treatments,
      patient: patientData?.id!,
      paymentDentist: null,
      date: new Date(),
      obs: "",
    };

    return await handleFinishTreatmentsOfPatient(data).then(
      (res) => {
        //update finishedBy of treatments
        getFinishedTreatmentsOfPatient();
      },
      (err) => console.log(err.response)
    );
  };

  useEffect(() => {
    handleGetAllDentists();
    getFinishedTreatmentsOfPatient();
  }, []);

  // useEffect(() => {
  //   if (forwardModalVisible) setPatientTreatmentsArr(notConcludeds);
  // }, [forwardModalVisible]);

  return (
    <Box mt={2}>
      <Modal
        visible={forwardModalVisible}
        closeModal={handleCloseForwardModal}
        styles={{ width: "90vw", height: "90vh", overflow: "auto" }}
      >
        <Typography variant="subtitle1" mb={1}>
          Escolha o dentista:
        </Typography>
        <Autocomplete
          options={dentists}
          sx={{ width: "85%" }}
          fullWidth
          limitTags={2}
          getOptionLabel={(option) => option.name}
          isOptionEqualToValue={(option, value) => option.name === value.name}
          onChange={(e, v) => setSelectedProfessional(v)}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Selecione o dentista."
              variant="outlined"
            />
          )}
        />
        <Typography variant="subtitle1" mt={1}>
          Escolha os tratamentos:
        </Typography>

        <Stack alignItems={"center"} justifyContent="center" mt={2}>
          {patientTreatmentsArr?.length === 0 && (
            <Typography variant="h6" textAlign="center" sx={{ width: "100%" }}>
              Não há mais tratamentos para se escolher
            </Typography>
          )}
        </Stack>
        <GridContainer elevation={9}>
          {patientTreatmentsArr?.map((v: any, i: number) => (
            <Button
              key={i}
              onClick={() => handleAddForwardTreatments(v)}
              variant="contained"
              fullWidth
              color={"success"}
            >
              {parseToothRegion(v?.attributes?.region)} - {v?.attributes?.name}
            </Button>
          ))}
        </GridContainer>

        <Typography variant="subtitle1" my={1}>
          Tratamentos escolhidos:
        </Typography>

        <Stack alignItems={"center"} justifyContent="center" mt={2}>
          {treatmentsToForward?.length === 0 && (
            <Typography variant="h6" textAlign="center" sx={{ width: "100%" }}>
              Você não escolheu nenhum tratamento para encaminhar!
            </Typography>
          )}
        </Stack>

        <GridContainer elevation={9}>
          {treatmentsToForward?.length > 0 &&
            treatmentsToForward.map((v: any, i: number) => (
              <Button
                key={i}
                onClick={() => handleDeleteForward(v)}
                variant="contained"
                fullWidth
                color="warning"
              >
                {parseToothRegion(v?.attributes?.region)} -{" "}
                {v?.attributes?.name}
              </Button>
            ))}
        </GridContainer>

        {selectedProfessional !== null && treatmentsToForward?.length > 0 ? (
          <Stack mt={4} alignItems="center" justifyContent="center">
            <Button
              variant="contained"
              onClick={handleSendPatient}
              endIcon={<RunCircleOutlinedIcon />}
              fullWidth
            >
              Encaminhar Paciente
            </Button>
          </Stack>
        ) : null}
      </Modal>

      <FinishPatientTreatmentsModal
        closeModal={() => setFinishTreatmentsModal(false)}
        visible={finishTreatmentsModal}
        dentists={dentists}
        onSubmitEffect={(submitValues) => handleFinishTreatments(submitValues)}
      />

      {forwardedTreatmentsOfPatient !== null && (
        <Box>
          <InlinePaper elevation={9}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              width="100%"
            >
              <Typography variant="h5">Encaminhamentos</Typography>
              {patientData?.attributes?.role === "PATIENT" ? (
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  mt={1}
                >
                  <Button
                    variant="contained"
                    onClick={() => setForwardModalVisible(true)}
                    endIcon={<TransferWithinAStationIcon />}
                    fullWidth
                  >
                    Encaminhar Paciente
                  </Button>
                </Box>
              ) : null}
            </Stack>

            <ForwardPatientTable
              items={forwardedTreatmentsOfPatient}
              onGetDetails={(id) => console.log(id)}
            />
          </InlinePaper>
        </Box>
      )}

      <Box my={2}>
        <InlinePaper elevation={9}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            width="100%"
          >
            <Typography variant="h5">Tratamentos Finalizados</Typography>
            {adminData?.userType === "ADMIN" &&
              adminData?.userType === "SUPERADMIN" && (
                <Button
                  variant="contained"
                  endIcon={<CheckIcon />}
                  onClick={() => setFinishTreatmentsModal(true)}
                >
                  Finalizar Tratamentos
                </Button>
              )}
          </Stack>

          <FinishedsTreatmentsPatientTable
            items={patientFinishedTreatments}
            onGetDetails={(id) => console.log(id)}
          />
        </InlinePaper>
      </Box>

      <Typography variant="h6" textAlign="center" color="grey" my={6}>
        Agendamentos em breve...
      </Typography>

      {/* <Box mt={2}>
        <InlinePaper elevation={9}>
          <Typography variant="h5">Agendamentos</Typography>
          <Button variant="contained" endIcon={<CalendarMonthOutlinedIcon />}>
            Agendar Paciente
          </Button>
        </InlinePaper>
        <SchedulePatientTable
          items={[]}
          onGetDetails={(id) => console.log(id)}
        />
      </Box> */}
    </Box>
  );
};

const GridContainer = styled(Paper)`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-column-gap: 1rem;
  grid-row-gap: 1rem;
  padding: 1rem;
  @media screen and (max-width: 760px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media screen and (max-width: 500px) {
    grid-template-columns: repeat(1, 1fr);
    grid-row-gap: 0.5rem;
  }
`;

const InlinePaper = styled(Paper)`
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
`;

export default SchedulesPatient;
