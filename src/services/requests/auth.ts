import { setCookie } from "cookies-next";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  collection,
  doc,
  getCountFromServer,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { auth, db } from "../firebase";
import { ClientType } from "types";

const adminsRef = collection(db, "admins");
const clientsRef = collection(db, "clients");
const professionalsRef = collection(db, "professionals");
const employeesRef = collection(db, "employees");

export const handleLogin = async ({ email, password }: any) => {
  return signInWithEmailAndPassword(auth, email, password)
    .then(async ({ user }) => {
      if (user) {
        const adminQuery = query(adminsRef, where("uid", "==", user.uid));
        const clientQuery = query(clientsRef, where("uid", "==", user.uid));
        const professionalQuery = query(
          professionalsRef,
          where("uid", "==", user.uid)
        );
        const employeeQuery = query(employeesRef, where("uid", "==", user.uid));
        const setUidCookie = setCookie("useruid", user.uid, { maxAge: 8600 });

        const selectedQuery = async () => {
          const hasAdmin = (await getCountFromServer(adminQuery)).data().count;
          const hasClient = (await getCountFromServer(clientQuery)).data()
            .count;
          const hasProfessional = (
            await getCountFromServer(professionalQuery)
          ).data().count;
          const hasEmployee = (await getCountFromServer(employeeQuery)).data()
            .count;
          if (hasAdmin > 0) return "admins";
          else if (hasClient > 0) return "clients";
          else if (hasProfessional > 0) return "professionals";
          else if (hasEmployee > 0) return "employees";
        };

        const docString = await selectedQuery();
        if (docString) {
          const coll = collection(db, docString);
          const docRef = query(coll, where("uid", "==", user.uid));
          return await getDocs(docRef).then((userSnapshot) => {
            if (userSnapshot.docs.length > 0) {
              setUidCookie;
              return userSnapshot.docs[0].data();
            } else return undefined;
          });
        }
      }
    })
    .catch((err) => {
      if (err.code === "auth/user-not-found") {
        alert("Usuário não cadastrado!");
      } else if (err.code === "auth/wrong-password") {
        alert("Senha incorreta!");
      } else alert(err.code);
    });
};

export const handlePersistLogin = async (user: any) => {
  const adminQuery = query(adminsRef, where("uid", "==", user.uid));
  const clientQuery = query(clientsRef, where("uid", "==", user.uid));
  const professionalQuery = query(
    professionalsRef,
    where("uid", "==", user.uid)
  );
  const employeeQuery = query(employeesRef, where("uid", "==", user.uid));
  const setUidCookie = setCookie("useruid", user.uid, { maxAge: 8600 });

  const selectedQuery = async () => {
    const hasAdmin = (await getCountFromServer(adminQuery)).data().count;
    const hasClient = (await getCountFromServer(clientQuery)).data().count;
    const hasProfessional = (await getCountFromServer(professionalQuery)).data()
      .count;
    const hasEmployee = (await getCountFromServer(employeeQuery)).data().count;
    if (hasAdmin > 0) return "admins";
    else if (hasClient > 0) return "clients";
    else if (hasProfessional > 0) return "professionals";
    else if (hasEmployee > 0) return "employees";
  };

  const docString = await selectedQuery();
  if (docString) {
    const coll = collection(db, docString);
    const docRef = query(coll, where("uid", "==", user.uid));
    return await getDocs(docRef).then((userSnapshot) => {
      if (userSnapshot.docs.length > 0) {
        setUidCookie;
        const res = userSnapshot.docs[0]?.data();
        const finalUser = {
          ...res,
        };
        return finalUser;
      } else return undefined;
    });
  }
};

export const createUser = async (
  { email, password, name }: any,
  userID: string
) => {
  return createUserWithEmailAndPassword(auth, email, password).then(
    async (res) => {
      const userData: ClientType = {
        name,
        email,
        address: {},
        anamnese: [],
        cpf: "",
        firstLetter: name.charAt(0).toUpperCase(),
        id: userID,
        phone: "",
        profileImage: "",
        protocols: [],
        reports: [],
        rg: "",
        treatments: [],
        uid: res.user.uid,
        xrays: [],
        role: "client",
      };
      if (res) {
        const userRef = doc(db, "clients", userID);
        return await setDoc(userRef, userData);
      }
    }
  );
};
