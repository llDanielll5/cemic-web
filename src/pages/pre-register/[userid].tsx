/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import Loading from "@/components/loading";
import styles from "../../styles/PreRegister.module.css";
import "react-calendar/dist/Calendar.css";
import { MdOutlineLogout } from "react-icons/md";
import { TfiAgenda } from "react-icons/tfi";
import { AiOutlineHistory } from "react-icons/ai";
import { ClientType } from "types";
import { useRouter } from "next/router";
import { auth, db } from "@/services/firebase";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { scheduleLecture } from "@/services/requests/firestore";
import Modal from "@/components/modal";

const defaultHours = [
  {
    hour: "11:00",
    selected: false,
  },
  {
    hour: "15:00",
    selected: false,
  },
  {
    hour: "17:00",
    selected: false,
  },
];

const FirstStep = () => {
  const router = useRouter();
  const userid = router.query.userid;
  const userRef = collection(db, "clients");
  const [dateSelected, setDateSelected] = useState(new Date());
  const [userData, setUserData] = useState<ClientType | null>(null);
  const [pagination, setPagination] = useState("Agendar");
  const [daysScheduleds, setDaysScheduleds] = useState<any[]>([]);
  const [hoursSelected, setHoursSelected] = useState(defaultHours);
  const [hour, setHour] = useState<string | null>(null);
  const [scheduleModal, setScheduleModal] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLogout, setIsLogout] = useState(false);

  const handleLogout = async () => {
    setIsLogout(true);
    await auth
      .signOut()
      .then(() => {
        setIsLogout(false);
      })
      .finally(() => {
        router.push("/");
      });
  };

  const handleOpenScheduleModal = () => {
    const today = new Date();
    if (hour === null) {
      return alert("Você tem que selecionar um horário!");
    }
    if (dateSelected <= today) {
      return alert("Não é possível agendar para hoje ou dias anteriores");
    }
    if (dateSelected.getDay() === 0 || dateSelected.getDay() === 6) {
      return alert("Não é possivel agendar para Finais de Semana");
    }
    return setScheduleModal(true);
  };

  const handleSchedule = async () => {
    setScheduleModal(false);
    const dateSelect = dateSelected.toISOString().substring(0, 10);
    setIsScheduling(true);
    await scheduleLecture(dateSelect, userData?.id!, hour!).then(
      async (res) => {
        if (res === "Sucesso") {
          await getUserData();
          setIsScheduling(false);
          return alert("Sucesso ao agendar sua palestra");
        } else {
          setIsScheduling(false);
        }
      }
    );
  };

  const handleSelectHour = ({ item, index }: any) => {
    const clone = [...hoursSelected];
    for (let i = 0; i < clone.length; i++) {
      if (i !== index) {
        clone[i].selected = false;
      }
    }
    clone[index].selected = !clone[index].selected;
    setHoursSelected(clone);
    if (hoursSelected[index].selected === false) {
      setHour(null);
      return;
    } else {
      setHour(item.hour);
      return;
    }
  };

  const getUserData = async () => {
    setIsLoading(true);
    const q = query(userRef, where("id", "==", userid));
    const getUserData = async () => {
      onSnapshot(q, (querySnapshot) => {
        if (querySnapshot.docs.length > 0) {
          const result: any = querySnapshot.docs[0].data();
          setUserData(result);
          setIsLoading(false);
        } else {
          setIsLoading(false);
          alert("Usuário não encontrado");
          router.push("/");
        }
      });
    };
    getUserData();
  };

  const getUserSchedules = async () => {
    if (userData?.lectureDays?.length! > 0) {
      const lecturesRef = collection(db, "lectures");
      const q = query(
        lecturesRef,
        where("id", "in", [...userData?.lectureDays!])
      );
      onSnapshot(q, (querySnap) => {
        if (querySnap.docs.length > 0) {
          const schedules: any[] = [];
          querySnap.forEach((querySnapshot) => {
            schedules.push(querySnapshot.data());
          });
          setDaysScheduleds(schedules);
        }
      });
    }
  };

  const parseDate = (v: string) => {
    if (!v) return;
    const [y, m, d] = v?.split("-");
    return `${d}/${m}/${y}`;
  };

  useEffect(() => {
    if (userid) getUserData();
  }, [userid]);

  useEffect(() => {
    if (userData !== null) getUserSchedules();
  }, [userData]);

  return (
    <>
      {isLoading && <Loading message="Verificando usuário..." />}
      {isLogout && <Loading message="Estamos deslogando sua conta..." />}
      {isScheduling && <Loading message="Estamos agendando sua palestra..." />}
      <Modal closeModal={() => setScheduleModal(false)} visible={scheduleModal}>
        <div className={styles["modal-container"]}>
          <h2>Tem certeza que deseja fazer o agendamento nesse dia?</h2>
          <div className={styles["buttons-container"]}>
            <button onClick={handleSchedule}>Sim</button>
            <button onClick={() => setScheduleModal(false)}>Não</button>
          </div>
        </div>
      </Modal>

      <div className={styles.header}>
        <img
          src="/images/cemicLogo.png"
          alt="logo-cemic"
          className={styles.logo}
        />
      </div>
      <div className={styles.container}>
        {daysScheduleds?.length > 0 && (
          <div className={styles["important-container"]}>
            <div className={styles["inner-important"]}>
              <h3>IMPORTANTE!</h3>
              <p>Você possui horário(s) agendado(s)!</p>

              {daysScheduleds.map((item, index) => (
                <p key={index}>
                  {parseDate(item.day)} às {item.hour}
                </p>
              ))}
            </div>
          </div>
        )}
        <div className={styles.navigation}>
          <button
            className={styles["button-nav"]}
            onClick={() => setPagination("Agendar")}
          >
            Agendar <TfiAgenda className={styles["icon-nav"]} />
          </button>
          <button
            className={styles["button-nav"]}
            onClick={() => setPagination("Histórico")}
          >
            Histórico <AiOutlineHistory className={styles["icon-nav"]} />
          </button>
          <button onClick={handleLogout} className={styles["button-nav"]}>
            Sair <MdOutlineLogout className={styles["icon-nav"]} />
          </button>
        </div>

        <br />

        {pagination === "Agendar" && (
          <div>
            <h1>
              Obrigado por fazer o registro na CEMIC {userData?.name ?? ""}
            </h1>
            <p>Seu código do cliente é o {userData?.id ?? ""}</p>
            <br />
            <h2>
              Para que você possa concorrer a sua vaga, é necessário comparecer
              para uma Palestra Informativa, da qual nós estaremos te falando
              tudo sobre o procedimento na CEMIC, e o passo a passo de como
              concorrer a vaga!
            </h2>
            <br />
            <br />
            <p>
              Você pode agendar para as palestras informativas aqui no seu
              painel do Cliente
            </p>
            <p>SELECIONE UM DIA DA SEMANA ENTRE SEGUNDA E SEXTA</p>
            <br />
            <div className={styles["calendar-container"]}>
              <Calendar onChange={setDateSelected} value={dateSelected} />
            </div>

            <div className={styles["hours-container"]}>
              <p>Qual desses horários deseja agendar?</p>
              <div className={styles["inner-hours"]}>
                {hoursSelected.map((item, index) => (
                  <button
                    key={index}
                    className={styles["buttton-hours"]}
                    onClick={() => handleSelectHour({ item, index })}
                    style={
                      item.selected
                        ? { backgroundColor: "#1b083e", color: "white" }
                        : undefined
                    }
                  >
                    {item.hour}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles["button-schedule"]}>
              <button onClick={handleOpenScheduleModal}>Agendar</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default FirstStep;
