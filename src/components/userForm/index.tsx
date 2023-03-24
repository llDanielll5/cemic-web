import React from "react";
import ReactDropdown from "react-dropdown";
import styles from "../../styles/Selected.module.css";
import Input from "../input";

interface UserFormProps {
  userData: any;
  setUserData: any;
  handleChange: any;
  handleMasked: any;
  locationData: any;
  setLocationData: any;
  handleGetCep: any;
  handleNextPage: any;
}

const sexOptions = ["FEMININO", "MASCULINO", "NENHUM"];

const UserForm = (props: UserFormProps) => {
  const {
    handleChange,
    handleMasked,
    userData,
    setUserData,
    locationData,
    setLocationData,
    handleGetCep,
    handleNextPage,
  } = props;
  return (
    <>
      <h2>Dados do Paciente</h2>

      <Input
        label="Nome Completo:"
        value={userData?.name!}
        onChange={(e) => handleChange(e, "name", setUserData)}
      />
      <div className={styles["double-inputs"]}>
        <div className={styles.w60}>
          <Input
            label="CPF:"
            value={userData?.cpf!}
            onChange={(e) => handleMasked(e, "cpf", setUserData)}
            maxLenght={14}
          />
        </div>
        <div className={styles.w40}>
          <Input
            label="RG:"
            value={userData?.rg!}
            onChange={(e) => handleChange(e, "rg", setUserData)}
            maxLenght={7}
          />
        </div>
      </div>
      <div className={styles["double-inputs"]}>
        <div className={styles.w60}>
          <Input
            type="email"
            label="E-mail:"
            value={userData?.email!}
            onChange={(e) => handleChange(e, "email", setUserData)}
          />
        </div>
        <div className={styles.w40}>
          <Input
            label="Celular:"
            value={userData?.phone!}
            onChange={(e) => handleMasked(e, "phone", setUserData)}
            maxLenght={14}
          />
        </div>
      </div>

      <div className={styles["double-inputs"]}>
        <div className={styles.date}>
          <div className={styles["input-box"]}>
            <span className={styles["text-input"]}>Nascimento</span>
            <input
              className={styles.datepicker}
              type={"date"}
              value={userData?.bornDate!}
              onChange={(e) =>
                handleChange(e.target.value, "bornDate", setUserData)
              }
            />
          </div>
        </div>

        <div className={styles["sex-container"]}>
          <p>Sexo:</p>
          <ReactDropdown
            options={sexOptions}
            onChange={({ value }: any) =>
              handleChange(value, "sexo", setUserData)
            }
            value={userData?.sexo!}
            placeholder="Sexo:"
            className={styles.dropdown}
          />
        </div>
      </div>

      <h3 className={styles.local}>Dados de Localidade</h3>

      <div className={styles["double-inputs"]}>
        <div className={styles.w50}>
          <Input
            label="CEP*:"
            value={locationData?.cep!}
            onChange={handleGetCep}
            maxLenght={8}
          />
        </div>
        <div className={styles.w50}>
          <Input
            label="Logradouro:"
            value={locationData?.line1!}
            onChange={(e) => handleChange(e, "line1", setLocationData)}
          />
        </div>
      </div>

      <div className={styles["double-inputs"]}>
        <div className={styles.w70}>
          <Input
            label="Bairro:"
            value={locationData?.neighbor!}
            onChange={(e) => handleChange(e, "neighbor", setLocationData)}
            maxLenght={8}
          />
        </div>
        <div className={styles.w20}>
          <Input
            label="Número:"
            value={locationData?.number!}
            onChange={(e) => handleChange(e, "number", setLocationData)}
          />
        </div>
      </div>

      <div className={styles["double-inputs"]}>
        <div className={styles.w70}>
          <Input
            label="Cidade:"
            value={locationData?.city!}
            onChange={(e) => handleChange(e, "city", setLocationData)}
            maxLenght={8}
          />
        </div>
        <div className={styles.w30}>
          <Input
            label="UF:"
            value={locationData?.uf!}
            onChange={(e) => handleChange(e, "uf", setLocationData)}
          />
        </div>
      </div>

      <Input
        label="Complemento:"
        value={locationData?.complement!}
        onChange={(e) => handleChange(e, "complement", setLocationData)}
      />

      <button onClick={handleNextPage} className={styles["button-next"]}>
        Próximo
      </button>
    </>
  );
};

export default UserForm;
