import React, { useState, useEffect } from "react";
import { ClientTypes } from "..";
import { StyledButton } from "../receipts";
import { Box, Typography, styled } from "@mui/material";
import Filter from "@/components/filter";
import FilterLetter from "@/components/filterLetter";
import ListProfiles from "@/components/listProfiles";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import { ClientType } from "types";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useOnSnapshotQuery } from "@/hooks/useOnSnapshotQuery";
import { db } from "@/services/firebase";
import Modal from "@/components/modal";
import NewPatientForm from "./newPatient";
import Loading from "@/components/loading";

interface ClientsAdminProps {
  setClientDetailsVisible: (e: boolean) => void;
  setClientID: (e: string) => void;
}

const patientsRef = collection(db, "clients");

const ClientsAdmin = (props: ClientsAdminProps) => {
  const { setClientDetailsVisible, setClientID } = props;

  const [isLoading, setIsloading] = useState(false);
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  const [patientFilterValue, setPatientFilterValue] = useState("");
  const [newPatientVisible, setNewPatientVisible] = useState(false);
  const [filterLetter, setFilterLetter] = useState<string | null>("A");
  const [patientsData, setPatientsData] = useState<ClientType[] | []>([]);
  const [filterByClientType, setFilterByClientType] = useState("");

  /**  ONSNAPSHOT FOR LETTER FILTER   */
  const qPatientLetter = query(
    patientsRef,
    where("firstLetter", "==", filterLetter)
  );
  const filterPatientByLetter = useOnSnapshotQuery("clients", qPatientLetter, [
    filterLetter,
  ]);
  /** ********** */

  const handleSelectFilter = (value: any) => setFilterByClientType(value);

  const handleCloseNewPatientModal = () => {
    return setNewPatientVisible(false);
  };

  const handleFilterPatient = async () => {
    const qPatientFilter = () => {
      switch (filterByClientType) {
        case "Não-Paciente":
          return query(
            patientsRef,
            where("cpf", "==", patientFilterValue),
            where("role", "==", "pre-register")
          );
        case "Paciente":
          return query(
            patientsRef,
            where("cpf", "==", patientFilterValue),
            where("role", "==", "patient")
          );
        case "Selecionado":
          return query(
            patientsRef,
            where("cpf", "==", patientFilterValue),
            where("role", "==", "selected")
          );
        default:
          return query(patientsRef, where("cpf", "==", patientFilterValue));
      }
    };

    const queryFunction = async () => {
      const querySnapshot = await getDocs(qPatientFilter());
      querySnapshot.forEach((doc) => {
        documents.push(doc.data());
      });
      setPatientsData(documents);
    };
    const documents: any[] = [];

    return queryFunction();
  };

  useEffect(() => {
    setPatientsData(filterPatientByLetter);
  }, [filterPatientByLetter, patientFilterValue]);

  useEffect(() => {
    setFilterLetter("A");
    setPatientFilterValue("");
  }, []);

  if (isLoading)
    return (
      <Box position="fixed" top={0} left={0}>
        <Loading message="Estamos trabalhando nisso..." />
      </Box>
    );

  return (
    <Box p={2}>
      {isLoadingAddress && (
        <Box position="fixed" top={0} left={0} zIndex={99999}>
          <Loading message="Estamos carregando informações do endereço..." />
        </Box>
      )}
      <Modal
        visible={newPatientVisible}
        closeModal={handleCloseNewPatientModal}
        style={{ content: { width: "90%" } }}
      >
        <NewPatientForm
          setAddressLoading={setIsLoadingAddress}
          setUserUpdating={setIsloading}
          onClose={handleCloseNewPatientModal}
        />
      </Modal>

      <Center>
        <StyledButton
          endIcon={<PersonAddAlt1Icon />}
          onClick={() => setNewPatientVisible(true)}
        >
          Lançar paciente
        </StyledButton>
      </Center>

      <Filter
        title="Filtrar paciente por:"
        options={["Qualquer", "Paciente", "Não-Paciente", "Selecionado"]}
        content={filterByClientType}
        setContent={(e) => handleSelectFilter(e)}
        filterValue={patientFilterValue}
        setFilterValue={(e) => setPatientFilterValue(e)}
        onClick={handleFilterPatient}
        baseStyle={{ margin: "20px auto", padding: "16px" }}
      />

      <FilterLetter
        letter={filterLetter}
        setLetter={(l) => setFilterLetter(l)}
      />

      <ListProfiles
        profiles={patientsData}
        setClientID={setClientID}
        notHaveMessage={"Nenhum paciente encontrado."}
        setClientDetailsVisible={setClientDetailsVisible}
      />
    </Box>
  );
};

const Center = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`;
const Buttons = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  column-gap: 16px;
  margin: 16px auto;
`;

export default ClientsAdmin;
