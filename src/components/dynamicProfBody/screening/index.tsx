import React, { useState, useEffect } from "react";
import styles from "../../../styles/Admin.module.css";
import Modal from "@/components/modal";
import UserData from "@/atoms/userData";
import ScreeningDetailsProfessional from "./details";
import EditNoteIcon from "@mui/icons-material/EditNote";
import ClientInfos from "@/components/admin/clientInfos";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import "react-calendar/dist/Calendar.css";
import { useRecoilValue } from "recoil";
import { Button, IconButton } from "@mui/material";
import { ScreeningInformations } from "types";
import { Box, Typography, TextField } from "@mui/material";

import { parseDateBr, parseDateIso, phoneMask } from "@/services/services";

interface ScreeningProps {
  setDate: (e: string) => void;
  setIsCreateTreatment: (e: boolean) => void;
}

const momentIso = new Date().toISOString().substring(0, 10);

const ScreeningProfessional = (props: ScreeningProps) => {
  const { setIsCreateTreatment } = props;
  const [dateSelected, setDateSelected] = useState(momentIso);
  const [clientDetailsVisible, setClientDetailsVisible] = useState(false);
  const [clientInfos, setClientInfos] = useState<any | null>(null);
  const [clientUpdateModal, setClientUpdateModal] = useState(false);
  const [clientUpdateInfos, setClientUpdateInfos] = useState(null);
  const [clientID, setClientID] = useState(null);
  const [screeningList, setScreeningList] = useState<
    ScreeningInformations[] | null
  >(null);

  const userData: any = useRecoilValue(UserData);
  const hasId = userData?.id ?? "";

  // SNAPSHOT QUERY FOR SCREENINGS COLLECTION

  useEffect(() => {
    // const getClientInfo = async () => {
    //   const document = doc(db, "clients", clientID!);
    //   await getDoc(document)
    //     .then((res) => {
    //       return setClientInfos(res.data());
    //     })
    //     .catch(() => {
    //       return alert("Não foi possível recuperar informações do paciente");
    //     });
    // };
    // if (clientID !== null) getClientInfo();
  }, [clientID]);

  // useEffect(() => {
  //   setScreeningList(snapScreening);
  // }, [snapScreening]);

  const closeClientDetailsModal = () => {
    setClientDetailsVisible(false);
    setClientInfos(null);
    setClientID(null);
    return;
  };

  const handleCloseClientUpdateModal = () => {
    setClientUpdateInfos(null);
    setClientUpdateModal(false);
    return;
  };

  const renderTableItem = ({ item, index }: any) => {
    const handleGetDetails = () => {
      setClientID(item?.patientId);
      setClientDetailsVisible(true);
      return;
    };
    const handleUpdate = () => {
      setClientUpdateInfos(item);
      setClientUpdateModal(true);
      return;
    };
    return (
      <div className={styles["table-item"]} key={index}>
        <p>{item?.hour}</p>
        <p>
          Nome: <span>{item?.name}</span>
        </p>
        <p>
          Telefone: <span>{phoneMask(item?.phone)}</span>
        </p>

        <Button onClick={handleUpdate}>
          <EditNoteIcon />
        </Button>
        <IconButton onClick={handleGetDetails}>
          <PersonSearchIcon />
        </IconButton>
      </div>
    );
  };

  const renderNotHaveSchedules = () => (
    <div className={styles["not-schedules"]}>
      <h3>Não há agendamento de triagem para este dia!</h3>
    </div>
  );
  const renderPassedDayNotSchedule = () => (
    <div className={styles["not-schedules"]}>
      <h3>Não houve triagem nesse dia que passou!</h3>
    </div>
  );
  const renderHaveSchedule = () => {
    return (
      <Box>
        <h2>Pacientes</h2>

        <div className={styles.table}>
          {screeningList !== null &&
            screeningList?.map((item, index) =>
              renderTableItem({ item, index })
            )}
        </div>
      </Box>
    );
  };

  const renderScreening = () => {
    const notScreenings = screeningList?.length === 0;
    const momentLess = notScreenings && dateSelected < momentIso;
    const momentMore = notScreenings && dateSelected >= momentIso;

    if (momentLess) return renderPassedDayNotSchedule();
    if (momentMore) return renderNotHaveSchedules();
    if (screeningList !== null) return renderHaveSchedule();
  };

  return (
    <div className={styles.screening}>
      {/* <Modal
        visible={clientInfos !== null}
        closeModal={closeClientDetailsModal}
      >
        {clientInfos !== null && <ClientInfos client={clientInfos} />}
      </Modal> */}

      <Modal
        closeModal={handleCloseClientUpdateModal}
        visible={clientUpdateModal}
      >
        <ScreeningDetailsProfessional
          infos={clientUpdateInfos!}
          setIsCreateTreatment={setIsCreateTreatment}
          // onClose={handleCloseClientUpdateModal}
        />
      </Modal>

      <Box
        display="flex"
        alignItems={"center"}
        justifyContent={"center"}
        my={2}
      >
        <TextField
          sx={{ width: "fit-content", backgroundColor: "white" }}
          value={dateSelected}
          onChange={(e) => setDateSelected(e.target.value)}
          InputLabelProps={{ shrink: true }}
          label="Selecionar Data"
          type={"date"}
        />
      </Box>

      <Box display="flex" alignItems="center" justifyContent="center" my={2.3}>
        <Typography variant="subtitle1" fontSize="1.3rem">
          {parseDateBr(parseDateIso(dateSelected))}
        </Typography>
      </Box>

      <div className={styles["screening-container"]}>{renderScreening()}</div>
    </div>
  );
};

export default ScreeningProfessional;
