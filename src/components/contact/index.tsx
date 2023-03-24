//@ts-nocheck
import React, { useState } from "react";
import { auth, db } from "@/services/firebase";
import { createUserLanding } from "@/services/requests/auth";
import { makeid } from "@/services/services";
import { deleteUser } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import styles from "../../styles/Landing.module.css";

const ContactForm = () => {
  const router = useRouter();
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handlePhone = (event: any) => {
    let input = event.target;
    setPhone(phoneMask(input.value));
  };
  const phoneReplaced = phone
    .replace("(", "")
    .replace(")", "")
    .replace("-", "")
    .replace(" ", "");

  const phoneMask = (value: any) => {
    if (!value) return "";
    value = value.replace(/\D/g, "");
    value = value.replace(/(\d{2})(\d)/, "($1) $2");
    value = value.replace(/(\d)(\d{4})$/, "$1-$2");
    return value;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    return alert(
      "Ainda não é possivel se cadastrar no site! Tente novamente depois, ou ligue no 3083-3075. Agradecemos!"
    );
    if (name === "" || email === "" || password === "" || phone === "")
      alert("Preencha os campos!");

    setIsLoading(true);

    const checkHasIdUsed = async () => {
      var createAccount = false;
      while (!createAccount) {
        let userID = makeid(7);
        const existRef = doc(db, "clients", userID);
        const docSnap = await getDoc(existRef);
        const hasSnap = docSnap.exists();
        if (!hasSnap) {
          createAccount = true;
          await createUserLanding(
            { email, password, name, phone: phoneReplaced },
            userID!
          )
            .then(async (res) => {
              if (res?.message === "Erro ao criar conta") {
                setIsLoading(false);
                if (res?.code === "auth/email-already-in-use") {
                  alert("Este e-mail já está sendo utilizado!");
                } else alert(res?.code);
                return;
              }
              if (res?.message === "Erro ao criar o banco da conta") {
                setIsLoading(false);
                await deleteUser(auth.currentUser!).then(
                  async () => await auth.signOut()
                );
                alert(
                  "Ocorreu erro " + err?.code + " ao criar o banco do usuário"
                );
                return;
              }
              if (res?.message === "Sucesso ao cadastrar") {
                setIsLoading(false);
                setName("");
                setEmail("");
                router.push("/pre-register/" + userID);
                return;
              }
            })
            .catch((err) => {});
        }
        return;
      }
    };
    checkHasIdUsed();
  };

  return (
    <section className={styles.contact} id={"contact"}>
      <h2>
        Faça sua inscrição agora e concorra a sua vaga na <span>CEMIC!</span>
      </h2>
      <div className={styles["contact-container"]}>
        <form>
          <h4>
            Informe seu nome completo <span>*</span>
          </h4>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <h4>
            Informe seu telefone <span>*</span>
          </h4>
          <input
            type="tel"
            maxLength={15}
            value={phone}
            onChange={(event) => handlePhone(event)}
          />

          <h4>
            Informe seu e-mail <span>*</span>
          </h4>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <h4>
            Digite uma senha <span>*</span>
          </h4>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <input type="submit" value={"Cadastrar-se"} onClick={handleSubmit} />
        </form>
      </div>

      <h4>
        Campos <span>*</span> são obrigatórios!
      </h4>
    </section>
  );
};

export default ContactForm;
