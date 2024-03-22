//@ts-check
import React, { useState, useEffect } from "react";
import styles from "../../../styles/Admin.module.css";
import "react-calendar/dist/Calendar.css";
import { Box, styled, IconButton, Button, TextField } from "@mui/material";
import { parseDateIso, phoneMask } from "@/services/services";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { useOnSnapshotQuery } from "@/hooks/useOnSnapshotQuery";
import { ScreeningInformations } from "types";
import Modal from "@/components/modal";
import UserData from "@/atoms/userData";
import SearchIcon from "@mui/icons-material/Search";
import ScreeningDetailsAdmin from "./screeningDetails";
import { useRecoilValue } from "recoil";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ScreeningModal from "@/components/admin/screening/screeningModal";

interface ScreeningProps {
  screeningModal: any;
  setClientID: (e: string) => void;
  setClientDetailsVisible: (e: boolean) => void;
  setIsGeneratePayment: (e: boolean) => void;
}

// const momentIso = new Date().toISOString().substring(0, 10);
// const screeningRef = collection(db, "screenings");

const ScreeningAdmin = (props: ScreeningProps) => {
  const { setClientDetailsVisible, setClientID, setIsGeneratePayment } = props;

  const [idFind, setIdFind] = useState("");
  const [client, setClient] = useState<any | null>(null);
  const [patientFind, setPatientFind] = useState<any[]>([]);
  // const [dateSelected, setDateSelected] = useState(momentIso);
  const [findModal, setFindModal] = useState<boolean>(false);
  const [clientModalVisible, setClientModalVisible] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);
  const [screeningModal, setScreeningModal] = useState(false);
  const [screeningList, setScreeningList] = useState<
    ScreeningInformations[] | null
  >(null);

  const userData: any = useRecoilValue(UserData);

  // SNAPSHOT QUERY FOR SCREENINGS COLLECTION
  // const q = query(
  //   screeningRef,
  //   where("date", "==", dateSelected),
  //   orderBy("hour", "asc")
  // );
  // const snapScreening = useOnSnapshotQuery("screenings", q, [dateSelected]);

  const getByClientID = async () => {
    if (idFind.length < 7) return alert("Digite um ID Válido");

    // const qry = query(screeningRef, where(`patientId`, "==", idFind));

    // const getScreeningByID = async () => {
    //   return await getDocs(qry)
    //     .then((res) => {
    //       if (res.size > 0) {
    //         const arr: any[] = [];
    //         res.docs.forEach((v) => {
    //           arr.push(v.data());
    //         });
    //         setPatientFind(arr);
    //         setFindModal(true);
    //         return;
    //       } else {
    //         return alert("Paciente não encontrado na base de dados de Triados");
    //       }
    //     })
    //     .catch((err) => {
    //       alert("Não encontrado ou código incorreto!");
    //       return;
    //     });
    // };
    // return await getScreeningByID();
  };
  // ******

  // useEffect(() => {
  //   setScreeningList(snapScreening);
  // }, [snapScreening]);

  // const handleCreateScreening = () => {
  //   if (dateSelected === momentIso)
  //     return alert("Não é possível agendar para hoje");
  //   else if (dateSelected > momentIso) return setScreeningModal(true);
  //   else return alert("Não é possível em dias anteriores");
  // };

  const handleCloseClientDetails = () => {
    setClientModalVisible(false);
    setClient(null);
    return;
  };

  const renderTableItem = ({ item, index }: any) => {
    const handleGetPatientInfos = () => {
      setClientID(item?.patientId);
      setClientDetailsVisible(true);
      return;
    };
    const handleGetDetails = (item: any) => {
      setClient(item);
      setClientModalVisible(true);
      return;
    };
    return (
      <div key={index} className={styles["table-item"]}>
        <p>{item?.hour}</p>
        <p>
          Nome: <span>{item?.name}</span>
        </p>
        <p>
          Telefone: <span>{phoneMask(item?.phone)}</span>
        </p>
        {userData?.role !== "professional" && (
          <Button onClick={() => handleGetDetails(item)}>Detalhes</Button>
        )}
        <Button onClick={handleGetPatientInfos}>Infos</Button>
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
      <div>
        <h2>Pacientes</h2>

        <div className={styles.table}>
          {screeningList !== null &&
            screeningList?.map((item, index) =>
              renderTableItem({ item, index })
            )}
        </div>
      </div>
    );
  };

  const renderScreening = () => {
    const notScreenings = screeningList?.length === 0;
    // const momentLess = notScreenings && dateSelected < momentIso;
    // const momentMore = notScreenings && dateSelected >= momentIso;

    // if (momentLess) return renderPassedDayNotSchedule();
    // if (momentMore) return renderNotHaveSchedules();
    if (screeningList !== null) return renderHaveSchedule();
  };

  return (
    <div className={styles.screening}>
      <Modal
        visible={screeningModal}
        closeModal={() => setScreeningModal(false)}
      >
        <ScreeningModal
          date={new Date().toISOString()}
          setVisible={setScreeningModal}
          setIsScheduling={setIsScheduling}
          clientDetailsVisible={setClientDetailsVisible}
          setClientID={setClientID}
        />
      </Modal>

      <Modal closeModal={() => setFindModal(false)} visible={findModal}>
        <div className={styles["find-modal-container"]}>
          <h4>Informações da busca de Triagens</h4>
          <div className={styles.border}>
            <p>
              Este paciente possui <span> {patientFind.length}</span>{" "}
              {patientFind.length > 1 ? "triagens" : "triagem"} nos seguintes
              dias agendados:
              {patientFind?.map((v, i) => (
                <p key={i}>
                  <span> {parseDateIso(v?.date)}</span> às
                  <span> {v?.hour}h</span>
                </p>
              ))}
            </p>
          </div>
        </div>
      </Modal>

      <Modal closeModal={handleCloseClientDetails} visible={clientModalVisible}>
        {client !== null && (
          <ScreeningDetailsAdmin
            infos={client}
            onClose={handleCloseClientDetails}
            setIsGeneratePayment={setIsGeneratePayment}
          />
        )}
      </Modal>

      <Button
        onClick={() => {}}
        sx={{ height: "55px" }}
        color="info"
        endIcon={<PersonAddIcon />}
      >
        Agendar Paciente
      </Button>

      <Box
        display="flex"
        alignItems={"center"}
        justifyContent={"center"}
        my={2}
        columnGap={2}
      >
        <TextField
          sx={{ width: "fit-content", backgroundColor: "white" }}
          value={new Date().toISOString()}
          onChange={(e) => {}}
          InputLabelProps={{ shrink: true }}
          label="Selecionar Data"
          type={"date"}
        />

        <Box display="flex" columnGap={1} alignItems="center">
          <TextField
            type="text"
            placeholder={"Buscar por ID de cliente"}
            label="Buscar por ID"
            sx={{ backgroundColor: "white", height: "55px" }}
            inputProps={{ maxLength: 11 }}
            value={idFind}
            onChange={({ target }) => setIdFind(target.value)}
            onKeyDown={({ key }) => {
              if (key === "Enter") return getByClientID();
            }}
          />
          <IconButton
            onClick={getByClientID}
            sx={{ height: "55px" }}
            title="Buscar paciente pelo ID"
          >
            <SearchIcon />
          </IconButton>
        </Box>
      </Box>

      <div className={styles["screening-container"]}>{renderScreening()}</div>
    </div>
  );
};

export default ScreeningAdmin;
