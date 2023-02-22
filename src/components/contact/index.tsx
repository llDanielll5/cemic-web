import { useRouter } from "next/router";
import React, { useState } from "react";
import ReactDropdown from "react-dropdown";
import styles from "../../styles/Landing.module.css";

const treatments = [
  "Implante dentário",
  "Aparelho Ortodôntico",
  "Clínico Geral",
];
const daysRequired = ["Segunda-Feira", "Quarta-Feira"];

const ContactForm = () => {
  const [treatment, setTreatment] = useState<string>("");
  const [dayWeek, setDayWeek] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const router = useRouter();

  const msg = `Olá!

Sou o(a) ${name}, e gostaria de concorrer a vaga de ${treatment} na CEMIC.

O meu melhor dia da semana disponível seria ${dayWeek}.

Meu telefone celular é o ${phone}.\n

${message}
  `;
  const zapHref = `https://api.whatsapp.com/send?phone=5561986573056&text=${encodeURIComponent(
    msg
  )}`;

  const handlePhone = (event: any) => {
    let input = event.target;
    setPhone(phoneMask(input.value));
  };

  const phoneMask = (value: any) => {
    if (!value) return "";
    value = value.replace(/\D/g, "");
    value = value.replace(/(\d{2})(\d)/, "($1) $2");
    value = value.replace(/(\d)(\d{4})$/, "$1-$2");
    return value;
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (treatment === "" || dayWeek === "") {
      alert("Preencha todos os campos com *!");
    } else router.push(zapHref);
  };
  return (
    <section className={styles.contact} id={"contact"}>
      <h2>
        Preencha o formulário abaixo para realizar uma pergunta específica para
        a <span>CEMIC!</span>
      </h2>
      <div className={styles["contact-container"]}>
        <form>
          <h4>
            Qual tratamento você necessita? <span>*</span>
          </h4>
          <ReactDropdown
            options={treatments}
            onChange={({ value }) => setTreatment(value)}
            value={treatment}
            placeholder="Selecione um atendimento."
          />

          <h4>
            Qual desses dias da semana têm disponibilidade? <span>*</span>
          </h4>
          <ReactDropdown
            options={daysRequired}
            onChange={({ value }) => setDayWeek(value)}
            value={dayWeek}
            placeholder="Selecione um dia da semana."
          />

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

          <h4>Digite a sua mensagem</h4>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <input type="submit" value={"Perguntar"} onClick={handleSubmit} />
        </form>
      </div>

      <h4>
        Campos <span>*</span> são obrigatórios!
      </h4>
    </section>
  );
};

export default ContactForm;
