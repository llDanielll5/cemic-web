import { setCookie } from "cookies-next";
import {
  createUserWithEmailAndPassword,
  deleteUser,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  getCountFromServer,
  collection,
  getDocs,
  setDoc,
  where,
  query,
  doc,
  getDoc,
} from "firebase/firestore";
import { auth, db } from "../firebase";

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
          const hasEmployees = (await getCountFromServer(employeeQuery)).data()
            .count;

          if (hasAdmin > 0) return "admins";
          else if (hasClient > 0) return "clients";
          else if (hasProfessional > 0) return "professionals";
          else if (hasEmployees > 0) return "employees";
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
      } else if (err.code === "auth/invalid-email") {
        return alert("Digite um e-mail válido");
      } else alert(err.code + " " + err.message);
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
    const hasEmployees = (await getCountFromServer(employeeQuery)).data().count;
    if (hasAdmin > 0) return "admins";
    else if (hasClient > 0) return "clients";
    else if (hasProfessional > 0) return "professionals";
    else if (hasEmployees > 0) return "employees";
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

export const createUser = async ({ email, password, name, cpf }: any) => {
  return createUserWithEmailAndPassword(auth, email, password).then(
    async (res) => {
      const userData: any = {
        name,
        cpf,
        email,
        address: {},
        anamnese: {},
        firstLetter: name.charAt(0).toUpperCase(),
        id: cpf,
        phone: "",
        profileImage: "",
        actualProfessional: "",
        professionalScreening: "",
        screeningDate: "",
        rg: "",
        role: "pre-register",
        dateBorn: "",
        sexo: "NENHUM",
        anamneseFilled: false,
      };
      if (res) {
        const userRef = doc(db, "clients", cpf);
        const verify = await getDoc(userRef);
        if (verify.exists()) {
          return await deleteUser(res.user).then(() => {
            return "CPF existente";
          });
        } else return await setDoc(userRef, userData);
      }
    }
  );
};

export const createUserLanding = async ({
  email,
  password,
  name,
  cpf,
}: any) => {
  return await createUserWithEmailAndPassword(auth, email, password).then(
    async (res) => {
      const userData: any = {
        name,
        email,
        address: {},
        anamnese: {},
        cpf,
        firstLetter: name.charAt(0).toUpperCase(),
        id: cpf,
        phone: "",
        profileImage: "",
        rg: "",
        role: "pre-register",
        actualProfessional: "",
        professionalScreening: "",
        screeningDate: "",
        dateBorn: "",
        sexo: "NENHUM",
        anamneseFilled: false,
      };
      if (res) {
        const userRef = doc(db, "clients", cpf);
        const verify = await getDoc(userRef);
        if (verify.exists()) {
          return await deleteUser(res.user).then(() => {
            return "CPF existente";
          });
        } else return await setDoc(userRef, userData);
      }
    }
  );
};

export const createPartner = async (data: any) => {
  const { name, email, cpf, phone, rg, password, role } = data;

  let partnerRole = "";
  if (role === "admins") partnerRole = "admin";
  else if (role === "dentists") partnerRole = "dentist";
  else if (role === "employees") partnerRole = "employee";
  else if (role === "prosthetics") partnerRole = "prosthetic";
  else partnerRole = "";

  return createUserWithEmailAndPassword(auth, email, password).then(
    async (res) => {
      const partnerData = {
        cpf,
        name,
        rg,
        email,
        phone,
        id: cpf,
        profileImage: "",
        uid: res.user.uid,
        role: partnerRole,
        firstLetter: name.charAt(0).toUpperCase(),
        dateBorn: "",
      };
      if (res) {
        const ref = doc(db, role, cpf);

        const verify = await getDoc(ref);
        if (verify.exists()) {
          return await deleteUser(res.user).then(() => {
            return alert("Parceiro já cadastrado!");
          });
        } else return await setDoc(ref, partnerData);
      }
    }
  );
};

export const createClient = async (data: any) => {
  const { cpf } = data;

  const userRef = doc(db, "clients", cpf);
  const verify = await getDoc(userRef);
  if (verify.exists()) {
    return "CPF existente";
  } else
    return await setDoc(userRef, data)
      .then((res) => {
        return "Sucesso";
      })
      .catch((err) => {
        return "Erro " + err.code;
      });
};
