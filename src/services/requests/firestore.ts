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
import { LectureDay, ScreeningInformations } from "types";
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

export const scheduleLecture = async (day: string, user: any, hour: string) => {
  const lectureRef = collection(db, "lectures");
  const q = query(
    lectureRef,
    where("day", "==", day),
    where("client", "==", user?.id)
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
      isMissed: null,
      examRequest: null,
      client: user?.cpf,
      client_name: user?.name,
      client_phone: user?.phone,
    })
      .then(async (res) => {
        const lectureDoc = doc(db, "lectures", res.id);
        await updateDoc(lectureDoc, { id: res.id });
        return "Sucesso";
      })
      .catch((err) => {
        return err.code;
      });
  }
};

export const scheduleScreening = async (
  user: any,
  patients: any,
  date: string,
  professional: any
) => {
  const screeningRef = collection(db, "screenings");

  if (patients.length === 0) {
    return alert("Adicione o paciente para o dia demarcado");
  }

  if (patients[0].hour === "" || !patients[0].hour) {
    return alert("Adicione um horário para o paciente");
  }

  // ADICIONAR DENTISTA
  const data: ScreeningInformations = {
    professional_name: professional.name,
    professionalId: professional.id,
    reporter_name: user?.name,
    reporter_id: user?.id,
    name: patients[0].name,
    phone: patients[0].phone,
    hour: patients[0].hour,
    patientId: patients[0].id,
    treatment_plan: [],
    paymentId: [],
    receiptId: [],
    negotiated: [],
    observations: "",
    total_value: "",
    isMissed: null,
    hasPay: null,
    date,
  };

  return await addDoc(screeningRef, data)
    .then(async (res) => {
      const document = doc(db, "screenings", res!.id);
      const ref = doc(db, "clients", patients[0].id);
      await updateDoc(ref, { role: "selected" });
      return await updateDoc(document, { id: res?.id }).then(() => {
        return { message: "Sucesso" };
      });
    })
    .catch((err) => {
      return { message: "Falha", code: err.code };
    });
};
