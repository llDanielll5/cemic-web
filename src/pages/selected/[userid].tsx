//@ts-nocheck
/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import Anamnese from "@/components/anamnese";
import styles from "../../styles/Selected.module.css";
import { auth, db } from "@/services/firebase";
import { useRouter } from "next/router";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { ClientType } from "types";
import Loading from "@/components/loading";

const SelectedScreen = () => {
  const router = useRouter();
  const userid = router.query.userid;
  const userRef = collection(db, "clients");
  const [userData, setUserData] = useState<ClientType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLogout, setIsLogout] = useState(false);
  const [isAddressLoading, setIsAddressLoading] = useState(false);

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

  useEffect(() => {
    if (userid) getUserData();
  }, [userid]);

  return (
    <div className={styles["container-all"]}>
      {isAddressLoading && (
        <Loading message="Estamos carregando seu endereço..." />
      )}
      {isLogout && <Loading message="Estamos deslogando da sua conta..." />}
      {isLoading && <Loading message="Carregando informações de usuário..." />}
      <div className={styles.header}>
        <img
          src="/images/cemicLogo.png"
          alt="logo-cemic"
          className={styles.logo}
        />
      </div>
      <div className={styles.container}>
        <button className={styles["logout-button"]} onClick={handleLogout}>
          Sair
        </button>

        <h1>
          Parabéns! Você foi selecionado para concorrer a uma vaga na CEMIC.
        </h1>

        <br />
        <h2>A sua triagem está marcada para o dia x às x horas.</h2>
        <br />
        <br />
        <p>
          Para que você possa participar da triagem, atualize seus dados e
          preencha a Anamnese:
        </p>

        <Anamnese
          userContext={userData}
          setAddressLoading={setIsAddressLoading}
        />
      </div>
    </div>
  );
};

export default SelectedScreen;
