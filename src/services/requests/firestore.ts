import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { LectureDay } from "types";
import { db } from "../firebase";

export const updateUserData = async (userid: string, data: any) => {
  const userRef = doc(db, "clients", userid);
  return await updateDoc(userRef, data)
    .then(() => {
      return "Sucesso";
    })
    .catch((err) => {
      return {
        message: "Error",
        code: err.code,
      };
    });
};

export const scheduleLecture = async (
  day: string,
  userid: string,
  hour: string
) => {
  const lectureRef = collection(db, "lectures");
  const userDoc = doc(db, "clients", userid);
  const q = query(
    lectureRef,
    where("day", "==", day),
    where("client", "==", userid)
  );
  const qDay = query(lectureRef, where("day", "==", day));
  const querySnapshot = await getDocs(q);
  const queryDay = await getDocs(qDay);

  if (queryDay.docs.length === 25) {
    return alert("Número de pacientes agendados para esse dia excedido!");
  }

  if (querySnapshot.docs.length > 0)
    return alert("Usuário já agendado para este dia!");
  else {
    return await addDoc(lectureRef, {
      day,
      hour,
      client: userid,
    })
      .then(async (res) => {
        const lectureDoc = doc(db, "lectures", res.id);
        await updateDoc(lectureDoc, { id: res.id });
        return await updateDoc(userDoc, {
          lectureDays: arrayUnion(res.id),
        }).then(() => {
          return "Sucesso";
        });
      })
      .catch((err) => {
        return err.code;
      });
  }
};
