/* eslint-disable react-hooks/exhaustive-deps */
//@ts-nocheck
import React, { useState, useEffect } from "react";
import styles from "../../../styles/Admin.module.css";
import "react-calendar/dist/Calendar.css";
import Button from "@/components/button";
import {
  BsFillArrowLeftSquareFill,
  BsFillArrowRightSquareFill,
  BsFillCalendar2EventFill,
} from "react-icons/bs";
import { MdOutlineFindInPage } from "react-icons/md";
import { parseDateBr, parseDateIso, phoneMask } from "@/services/services";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { useOnSnapshotQuery } from "@/hooks/useOnSnapshotQuery";
import { ScreeningInformations } from "types";
import { db } from "@/services/firebase";
import Modal from "@/components/modal";
import Calendar from "react-calendar";
import ScreeningDetailsAdmin from "./screeningDetails";
import { useRecoilValue } from "recoil";
import UserData from "@/atoms/userData";

interface ScreeningProps {
  screeningModal: any;
  setDate: (e: string) => void;
  setClientID: (e: string) => void;
  setClientDetailsVisible: (e: boolean) => void;
  setIsGeneratePayment: (e: boolean) => void;
}

const momentIso = new Date().toISOString().substring(0, 10);
const screeningRef = collection(db, "screenings");

const ScreeningAdmin = (props: ScreeningProps) => {
  const {
    screeningModal,
    setDate,
    setClientDetailsVisible,
    setClientID,
    setIsGeneratePayment,
  } = props;

  const [idFind, setIdFind] = useState("");
  const [client, setClient] = useState<any | null>(null);
  const [patientFind, setPatientFind] = useState<any[]>([]);
  const [dateSelected, setDateSelected] = useState(new Date());
  const [currentDay, setCurrentDay] = useState<number>(new Date().getDate());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [findModal, setFindModal] = useState<boolean>(false);
  const [clientModalVisible, setClientModalVisible] = useState(false);
  const [calendarVisible, setCalendarVisible] = useState<boolean>(false);
  const lastDayOfMonth = new Date(currentYear, currentMonth, 0).getDate();
  const date = new Date(currentYear, currentMonth, currentDay);
  const datePickerValue = date.toISOString().substring(0, 10);
  const yesterday = datePickerValue < momentIso;
  const dateBr = date.toLocaleDateString();
  const [screeningList, setScreeningList] = useState<
    ScreeningInformations[] | null
  >(null);

  const userData = useRecoilValue(UserData);

  // SNAPSHOT QUERY FOR SCREENINGS COLLECTION
  const q = query(
    screeningRef,
    where("date", "==", datePickerValue),
    orderBy("hour", "asc")
  );
  const snapScreening = useOnSnapshotQuery("screenings", q, [
    currentDay,
    currentMonth,
    currentYear,
  ]);

  const getByClientID = async () => {
    if (idFind.length < 7) return alert("Digite um ID Válido");

    const qry = query(screeningRef, where(`patientId`, "==", idFind));

    const getScreeningByID = async () => {
      return await getDocs(qry)
        .then((res) => {
          if (res.size > 0) {
            const arr: any[] = [];
            res.docs.forEach((v) => {
              arr.push(v.data());
            });
            setPatientFind(arr);
            setFindModal(true);
            return;
          } else {
            return alert("Paciente não encontrado na base de dados de Triados");
          }
        })
        .catch((err) => {
          alert("Não encontrado ou código incorreto!");
          return;
        });
    };
    return await getScreeningByID();
  };
  // ******

  useEffect(() => {
    setScreeningList(snapScreening);
  }, [snapScreening]);

  useEffect(() => {
    setDate(datePickerValue);
  }, [currentDay, currentYear, currentMonth, datePickerValue]);

  useEffect(() => {
    setDate(momentIso);
  }, []);

  const previousMonth = () => {
    if (currentMonth === 0) {
      setCurrentDay(0);
      setCurrentMonth(11);
      setCurrentYear((prev) => prev - 1);
      return;
    }
    setCurrentMonth((prev) => prev - 1);
    setCurrentDay(lastDayOfMonth + 1);
    return;
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((prev) => prev + 1);
      return;
    }
    setCurrentMonth((prev) => prev + 1);
    setCurrentDay(0);
    return;
  };

  const onChangeDate = (e: Date) => {
    setDateSelected(e);
    setCurrentYear(e.getFullYear());
    setCurrentMonth(e.getMonth());
    setCurrentDay(e.getDate());
    setCalendarVisible(false);
    return;
  };

  const handleNextDay = () => {
    if (currentDay === lastDayOfMonth - 1) nextMonth();
    setCurrentDay((prev) => prev + 1);
  };

  const handlePreviousDay = () => {
    if (currentDay === 1) previousMonth();
    setCurrentDay((prev) => prev - 1);
  };

  const handleCreateScreening = () => {
    if (!yesterday) return screeningModal(true);
    else return alert("Não é possível em dias anteriores");
  };

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
    const momentLess = notScreenings && datePickerValue < momentIso;
    const momentMore = notScreenings && datePickerValue >= momentIso;

    if (momentLess) return renderPassedDayNotSchedule();
    if (momentMore) return renderNotHaveSchedules();
    if (screeningList !== null) return renderHaveSchedule();
  };

  return (
    <div className={styles.screening}>
      <Modal
        visible={calendarVisible}
        closeModal={() => setCalendarVisible(false)}
      >
        <div className={styles["date-select-container"]}>
          <h4>Selecione uma data</h4>
          <Calendar onChange={onChangeDate} value={dateSelected} />
        </div>
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

      <Button onClick={handleCreateScreening}>Agendar Paciente</Button>
      <div className={styles["date-container"]}>
        <BsFillArrowLeftSquareFill
          className={styles["arrow"]}
          onClick={handlePreviousDay}
        />
        <div className={styles.calendar}>
          <span>{parseDateBr(dateBr)}</span>
        </div>
        <BsFillArrowRightSquareFill
          className={styles["arrow"]}
          onClick={handleNextDay}
        />
      </div>

      <div className={styles["have-schedule-container"]}>
        <div className={styles["have-schedule-item"]}>
          <h5>{parseDateBr(date.toLocaleDateString())}</h5>
        </div>
        <div className={styles["find-container"]}>
          <input
            type="text"
            placeholder={"Buscar por ID de cliente"}
            maxLength={7}
            value={idFind}
            onChange={({ target }) => setIdFind(target.value)}
          />
          <MdOutlineFindInPage
            className={styles.icon}
            onClick={getByClientID}
            title="Buscar paciente pelo ID"
          />
        </div>
        <div className={styles["have-schedule-item"]}>
          <BsFillCalendar2EventFill
            className={styles.icon}
            onClick={() => setCalendarVisible(true)}
          />
        </div>
      </div>

      <div className={styles["screening-container"]}>{renderScreening()}</div>
    </div>
  );
};

export default ScreeningAdmin;
