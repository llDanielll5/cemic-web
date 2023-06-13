//@ts-nocheck
/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import Anamnese from "@/components/anamnese";
import { Typography, Box } from "@mui/material";
import styles from "../../styles/Selected.module.css";
import { auth, db } from "@/services/firebase";
import { useRouter } from "next/router";
import Loading from "@/components/loading";
import LogoutIcon from "@mui/icons-material/Logout";
import { parseDateIso } from "@/services/services";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { StyledButton } from "@/components/dynamicAdminBody/receipts";
import { useRecoilState } from "recoil";
import UserData from "@/atoms/userData";

interface ScreeningSchedule {
  date: string;
  hour: string;
}

const defaultSchedule: ScreeningSchedule = {
  date: "",
  hour: "",
};

const SelectedScreen = () => {
  const router = useRouter();
  const userid = router.query.userid;
  const userRef = collection(db, "clients");
  const [userData, setUserData] = useRecoilState(UserData);
  const [screening, setScreening] =
    useState<ScreeningSchedule>(defaultSchedule);
  const [isLoading, setIsLoading] = useState(false);
  const [isLogout, setIsLogout] = useState(false);
  const [isAddressLoading, setIsAddressLoading] = useState(false);
  const [isUserUpdating, setIsUserUpdating] = useState(false);
  const dateIso = new Date().toISOString().substring(0, 10);

  const handleLogout = async () => {
    setIsLogout(true);
    await auth.signOut().then(async () => {
      const finish = await router.push("/login");
      if (finish) setIsLogout(false);
    });
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
          handleLogout();
        }
      });
    };
    getUserData();
  };

  const getScreeningDate = async () => {
    const screeningRef = collection(db, "screenings");
    const querySnap = query(
      screeningRef,
      where("patientId", "==", userData!.id)
    );

    await getDocs(querySnap)
      .then((res) => {
        const size = res.size;
        return setScreening({
          date: res.docs[size - 1].data().date,
          hour: res.docs[size - 1].data().hour,
        });
      })
      .catch(() => {
        return alert("erro ao recuperar data de triagem");
      });
  };

  useEffect(() => {
    if (userid) getUserData();
  }, [userid]);

  useEffect(() => {
    if (userData !== null && !!userid) getScreeningDate();
  }, [userData]);

  return (
    <div className={styles["container-all"]}>
      {isAddressLoading && (
        <Loading message="Estamos carregando seu endereço..." />
      )}
      {isLogout && <Loading message="Estamos deslogando da sua conta..." />}
      {isLoading && <Loading message="Carregando informações de usuário..." />}
      {isUserUpdating && (
        <Loading message="Estamos atualizando as informações de usuário..." />
      )}
      <div className={styles.header}>
        <img
          src="/images/cemicLogo.png"
          alt="logo-cemic"
          className={styles.logo}
        />
      </div>
      <div className={styles.container}>
        <StyledButton
          sx={{ alignSelf: "flex-end" }}
          endIcon={<LogoutIcon />}
          onClick={handleLogout}
        >
          Sair
        </StyledButton>

        {screening?.date >= dateIso ? (
          <>
            <h1>
              Parabéns! Você foi selecionado para concorrer a uma vaga na CEMIC.
            </h1>

            <br />
            <h2>
              A sua triagem está marcada para o dia{" "}
              {parseDateIso(screening?.date)} às {screening?.hour} horas.
            </h2>
            <br />
            <br />
            <p>
              Para que você possa participar da triagem, atualize seus dados e
              preencha a Anamnese:
            </p>
          </>
        ) : (
          <Box display="flex" alignItems="center" justifyContent="center">
            <Typography variant="bold">
              A sua triagem já passou! E foi no dia{" "}
              {parseDateIso(screening?.date)}
            </Typography>
          </Box>
        )}

        {!userData?.anamneseFilled && screening?.date >= dateIso ? (
          <Anamnese
            userContext={userData}
            setAddressLoading={setIsAddressLoading}
            setUserUpdating={setIsUserUpdating}
          />
        ) : null}
        {userData?.anamneseFilled && screening?.date >= dateIso ? (
          <h2 style={{ margin: "32px 0" }}>
            Você preencheu a sua Anamnese Completa!
          </h2>
        ) : null}

        {screening?.date < dateIso && (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexDirection="column"
            px={2}
          >
            <Typography variant="bold" my={2} textAlign="center">
              Se você consegue visualizar essa mensagem é por que não conseguiu
              continuar com a vaga ou perdeu a chance de continuar com sua vaga!
            </Typography>

            <Typography variant="bold" my={2} textAlign="center">
              Para tentar novamente a vaga, favor contatar o nosso suporte!
            </Typography>
          </Box>
        )}
      </div>
    </div>
  );
};

export default SelectedScreen;
