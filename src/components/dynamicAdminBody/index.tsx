import { useOnSnapshotQuery } from "@/hooks/useOnSnapshotQuery";
import { db } from "@/services/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { ClientType } from "types";
import styles from "../../styles/Admin.module.css";
import Filter from "../filter";
import FilterLetter from "../filterLetter";
import ListProfiles from "../listProfiles";

export interface AdminBodyProps {
  page: number;
}

const patientsRef = collection(db, "clients");

const DynamicAdminBody = (props: AdminBodyProps) => {
  const [patientFilterType, setPatientFilterType] = useState("");
  const [patientFilterValue, setPatientFilterValue] = useState("");
  const [professionalFilterType, setProfessionalFilterType] = useState("");
  const [professionalFilterValue, setProfessionalFilterValue] = useState("");
  const [filterLetter, setFilterLetter] = useState<string | null>("A");

  const [patientsData, setPatientsData] = useState<ClientType[] | []>([]);

  /**  ONSNAPSHOT FOR LETTER FILTER   */
  const qPatientLetter = query(
    patientsRef,
    where("firstLetter", "==", filterLetter)
  );
  const filterPatientByLetter = useOnSnapshotQuery("clients", qPatientLetter, [
    filterLetter,
  ]);
  /** ********** */

  const handleSetContentPatients = (e: string) => {
    if (e === "Código") setPatientFilterType("id");
    else setPatientFilterType("cpf");
  };
  const handleSetContentProfessionals = (e: string) => {
    if (e === "CRO") setProfessionalFilterType("cro");
    else setProfessionalFilterType("cpf");
  };

  const handleFilterPatient = async () => {
    const qPatientFilter = (type: "id" | "cpf") => {
      return query(patientsRef, where(type, "==", patientFilterValue));
    };
    const documents: any[] = [];
    if (patientFilterType === "id") {
      const querySnapshot = await getDocs(qPatientFilter("id"));
      querySnapshot.forEach((doc) => {
        documents.push(doc.data());
      });
      setPatientsData(documents);
    } else {
      const querySnapshot = await getDocs(qPatientFilter("cpf"));
      querySnapshot.forEach((doc) => {
        documents.push(doc.data());
      });
      setPatientsData(documents);
    }
  };

  useEffect(() => {
    if (patientFilterValue === "") setPatientsData(filterPatientByLetter);
  }, [filterPatientByLetter, patientFilterValue]);

  useEffect(() => {
    setFilterLetter("A");
    setPatientFilterValue("");
  }, [props.page]);

  if (props.page === 2) {
    return (
      <div className={styles.patients}>
        <Filter
          title="Filtrar paciente por:"
          options={["Código", "CPF"]}
          content={patientFilterType === "id" ? "Código" : "CPF"}
          setContent={(e) => handleSetContentPatients(e)}
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

        <ListProfiles
          profiles={patientsData}
          notHaveMessage={"Nenhum paciente encontrado."}
        />
      </div>
    );
  }
  if (props.page === 3) {
    return (
      <div className={styles.patients}>
        <Filter
          title="Filtrar dentista por:"
          options={["CRO", "CPF"]}
          content={professionalFilterType === "cro" ? "CRO" : "CPF"}
          setContent={(e) => handleSetContentProfessionals(e)}
          filterValue={professionalFilterValue}
          setFilterValue={(e) => setProfessionalFilterValue(e)}
          onClick={() => {}}
          baseStyle={{
            margin: "20px auto",
            padding: "16px",
          }}
        />

        <FilterLetter
          letter={filterLetter}
          setLetter={(l) => setFilterLetter(l)}
        />
      </div>
    );
  }
};

export default DynamicAdminBody;
