import React from "react";
import styles from "../../../styles/Admin.module.css";
import Filter from "@/components/filter";
import FilterLetter from "@/components/filterLetter";
import ListProfiles from "@/components/listProfiles";
import { ClientTypes } from "..";

interface ClientsAdminProps {
  patientFilterValue: any;
  setPatientFilterValue: any;
  handleFilterPatient: any;
  filterByClientType: ClientTypes;
  setFilterByClientType: (e: ClientTypes) => void;
  filterLetter: any;
  setFilterLetter: any;
  patientsData: any;
  setClientDetailsVisible: (e: boolean) => void;
  setClientID: (e: string) => void;
}

const ClientsAdmin = (props: ClientsAdminProps) => {
  const {
    filterLetter,
    handleFilterPatient,
    patientFilterValue,
    patientsData,
    setFilterLetter,
    setPatientFilterValue,
    filterByClientType,
    setFilterByClientType,
    setClientDetailsVisible,
    setClientID,
  } = props;

  const patient = filterByClientType === "patient";
  const notPatient = filterByClientType === "pre-register";
  const selected = filterByClientType === "selected";
  const styleForSelected = { backgroundColor: "#1b083e", color: "white" };
  const notHaveProfiles =
    filterByClientType === "patient"
      ? "Nenhum paciente encontrado."
      : filterByClientType === "pre-register"
      ? "Nenhum Não-Paciente encontrado."
      : "Não foi encontrado paciente selecionado.";

  const handleSelectFilter = (type: ClientTypes) => setFilterByClientType(type);

  return (
    <div className={styles.patients}>
      <Filter
        title="Filtrar paciente por:"
        options={["CPF"]}
        content={"CPF"}
        setContent={(e) => console.log(e)}
        filterValue={patientFilterValue}
        setFilterValue={(e) => setPatientFilterValue(e)}
        onClick={handleFilterPatient}
        baseStyle={{
          margin: "20px auto",
          padding: "16px",
        }}
      />

      <FilterLetter
        letter={filterLetter}
        setLetter={(l) => setFilterLetter(l)}
      />

      <div className={styles["filter-type"]}>
        <button
          style={patient ? styleForSelected : undefined}
          onClick={() => handleSelectFilter("patient")}
        >
          Paciente
        </button>
        <button
          style={notPatient ? styleForSelected : undefined}
          onClick={() => handleSelectFilter("pre-register")}
        >
          Não-Paciente
        </button>
        <button
          style={selected ? styleForSelected : undefined}
          onClick={() => handleSelectFilter("selected")}
        >
          Selecionado
        </button>
      </div>

      <ListProfiles
        profiles={patientsData}
        setClientID={setClientID}
        notHaveMessage={notHaveProfiles}
        setClientDetailsVisible={setClientDetailsVisible}
      />
    </div>
  );
};

export default ClientsAdmin;
