import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { ScreeningInformations } from "types";
// import { db } from "../firebase";
import { nameCapitalized } from "../services";

export const updateUserData = async (userid: string, data: any) => {
  // const userRef = doc(db, "clients", userid);
  // return await updateDoc(userRef, data)
  //   .then(() => {
  //     return "Sucesso";
  //   })
  //   .catch((err) => {
  //     return {
  //       message: "Error",
  //       code: err.code,
  //     };
  //   });
};

export const scheduleLecture = async (values: any) => {
  // const { name, phone, date, hour, cpf } = values;
  // const lectureRef = collection(db, "lectures");
  // const q = query(
  //   lectureRef,
  //   where("day", "==", date),
  //   where("cpf", "==", cpf)
  // );
  // const hasQ = query(lectureRef, where("cpf", "==", cpf));
  // const qDay = query(lectureRef, where("day", "==", date));
  // const [y, m, d] = values.date.split("-");
  // const querySnapshot = await getDocs(q);
  // const queryClient = await getDocs(hasQ);
  // const queryDay = await getDocs(qDay);
  // const today = new Date();
  // const newDate = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
  // const completeName = nameCapitalized(name);
  // const phoneReplaced = phone!
  //   .replace("(", "")
  //   .replace(")", "")
  //   .replace("-", "")
  //   .replace(" ", "");
  // const cpfReplaced = cpf!.replace(".", "").replace("-", "").replace(".", "");
  // if (queryDay.docs.length === 25)
  //   return alert("Número de pacientes agendados para esse dia excedido!");
  // if (querySnapshot.docs.length > 0)
  //   return alert("Usuário já agendado para este dia!");
  // if (queryClient.docs.length > 0) return alert("Usuário já agendou palestra");
  // if (date < today.toISOString().substring(0, 10))
  //   return alert("Não é possível agendar para dias anteriores");
  // if (newDate.getDay() === 0 || newDate.getDay() === 6)
  //   return alert("Não é possivel agendar para Finais de Semana");
  // return await addDoc(lectureRef, {
  //   hour,
  //   day: date,
  //   isMissed: null,
  //   cpf: cpfReplaced,
  //   examRequest: null,
  //   name: completeName,
  //   phone: phoneReplaced,
  // })
  //   .then(async (res) => {
  //     const lectureDoc = doc(db, "lectures", res.id);
  //     await updateDoc(lectureDoc, { id: res.id });
  //     return "Sucesso";
  //   })
  //   .catch((err) => {
  //     return err.code;
  //   });
};

export const scheduleScreening = async (
  user: any,
  date: string,
  patients: any,
  professional: any
) => {
  // const screeningRef = collection(db, "screenings");
  // if (patients.length === 0) {
  //   return alert("Adicione o paciente para o dia demarcado");
  // }
  // if (patients[0].hour === "" || !patients[0].hour) {
  //   return alert("Adicione um horário para o paciente");
  // }
  // // ADICIONAR DENTISTA
  // const data: ScreeningInformations = {
  //   professional_name: professional.name,
  //   professionalId: professional.id,
  //   reporter_name: user?.name,
  //   reporter_id: user?.id,
  //   name: patients[0].name,
  //   phone: patients[0].phone,
  //   hour: patients[0].hour,
  //   patientId: patients[0].id,
  //   treatment_plan: [],
  //   paymentId: [],
  //   receiptId: [],
  //   negotiated: [],
  //   observations: "",
  //   total_value: "",
  //   isMissed: null,
  //   hasPay: null,
  //   date,
  // };
  // return await addDoc(screeningRef, data)
  //   .then(async (res) => {
  //     const document = doc(db, "screenings", res!.id);
  //     const ref = doc(db, "clients", patients[0].id);
  //     await updateDoc(ref, { role: "selected" });
  //     return await updateDoc(document, { id: res?.id }).then(() => {
  //       return { message: "Sucesso" };
  //     });
  //   })
  //   .catch((err) => {
  //     return { message: "Falha", code: err.code };
  //   });
};
