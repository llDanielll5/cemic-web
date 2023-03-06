import UserData from "@/atoms/userData";
import { auth } from "@/services/firebase";
import { setCookie } from "cookies-next";
import { signOut } from "firebase/auth";
import { useRouter } from "next/router";
import React from "react";
import { useResetRecoilState } from "recoil";

const PatientScreen = () => {
  const router = useRouter();
  const resetUser = useResetRecoilState(UserData);
  const userid = router.query.userid;

  const signout = async () => {
    try {
      return signOut(auth).then(() => {
        resetUser();
        setCookie("useruid", undefined);
      });
    } finally {
      router.push("/login");
    }
  };

  return (
    <div>
      <h2>Tela de usuário</h2>
      <button onClick={signout}>Deslogar</button>
    </div>
  );
};

export default PatientScreen;
