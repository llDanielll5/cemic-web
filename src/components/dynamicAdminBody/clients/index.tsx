import React, { useState, useEffect, useCallback } from "react";
import { StyledButton } from "../receipts";
import { Box, styled, IconButton, Typography } from "@mui/material";
import { ClientType } from "types";
import { db } from "@/services/firebase";
import Modal from "@/components/modal";
import NewPatientForm from "./newPatient";
import Loading from "@/components/loading";
import Filter from "@/components/filter";
import FilterLetter from "@/components/filterLetter";
import ListProfiles from "@/components/listProfiles";
import ArrowBack from "@mui/icons-material/ArrowBackIosNew";
import ArrowForward from "@mui/icons-material/ArrowForwardIos";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import {
  collection,
  endBefore,
  getDocs,
  limit,
  limitToLast,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import ReactDropdown from "react-dropdown";
import { useOnSnapshotQuery } from "@/hooks/useOnSnapshotQuery";

interface ClientsAdminProps {
  setClientDetailsVisible: (e: boolean) => void;
  setClientID: (e: string) => void;
}

const limitValues = ["3", "5", "10", "20", "50"];

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
  const [lastVisible, setLastVisible] = useState<any | null>(null);
  const [firstVisible, setFirstVisible] = useState<any | null>(null);
  const [limitQuery, setLimitQuery] = useState<number>(5);
  const [dbLength, setDbLength] = useState<number>(0);
  const [page, setPage] = useState<number>(1);

  /**  ONSNAPSHOT FOR LETTER FILTER   */
  const qPatientLetter = query(
    patientsRef,
    where("firstLetter", "==", filterLetter),
    orderBy("name"),
    limit(limitQuery)
  );
  const queryAllSize = query(
    patientsRef,
    where("firstLetter", "==", filterLetter),
    orderBy("name")
  );
  // const filterPatientByLetter = useOnSnapshotQuery("clients", qPatientLetter, [
  //   filterLetter,
  // ]);
  /** ********** */

  const getTreatments = async () => {
    setIsloading(true);
    const documentSnapshots = await getDocs(qPatientLetter);
    const docSize = await getDocs(queryAllSize);
    const lastIndex = documentSnapshots.docs[documentSnapshots.docs.length - 1];
    setLastVisible(lastIndex);
    var arr: any[] = [];
    documentSnapshots.forEach((v: any) => arr.push(v.data()));
    setPatientsData(arr);
    setIsloading(false);
    setDbLength(docSize.size);
    return;
  };

  const handleNextPage = async () => {
    if (patientsData.length < limitQuery) return;
    if (patientsData.length === dbLength) return;
    setIsloading(true);
    var arr: any[] = [];
    const qNext = query(
      patientsRef,
      where("firstLetter", "==", filterLetter),
      orderBy("name"),
      limit(limitQuery),
      startAfter(lastVisible)
    );
    const documentSnapshots = await getDocs(qNext);
    const firstIndex = documentSnapshots.docs[0];
    const lastIndex = documentSnapshots.docs[documentSnapshots.docs.length - 1];
    if (documentSnapshots.docs.length === 0) {
      setIsloading(false);
      return;
    }
    setLastVisible(lastIndex);
    setFirstVisible(firstIndex);
    documentSnapshots.forEach((v: any) => arr.push(v.data()));
    setPatientsData(arr);
    setPage((prev) => prev + 1);
    setIsloading(false);
    return;
  };

  const handleBackPage = async () => {
    if (page === 1) return;
    setIsloading(true);
    var arr: any[] = [];
    const qPrev = query(
      patientsRef,
      where("firstLetter", "==", filterLetter),
      orderBy("name"),
      limitToLast(limitQuery),
      endBefore(firstVisible)
    );
    const documentSnapshots = await getDocs(qPrev);
    const firstIndex = documentSnapshots.docs[0];
    const lastIndex = documentSnapshots.docs[documentSnapshots.docs.length - 1];
    if (documentSnapshots.docs.length === 0) {
      setIsloading(false);
      return;
    }
    setLastVisible(lastIndex);
    setFirstVisible(firstIndex);
    documentSnapshots.forEach((v: any) => arr.push(v.data()));
    setPatientsData(arr);
    setPage((prev) => prev - 1);
    setIsloading(false);
    return;
  };

  useEffect(() => {
    setFilterLetter("A");
    setPatientFilterValue("");
  }, []);

  useEffect(() => {
    getTreatments();
  }, []);

  useEffect(() => {
    setPage(1);
    getTreatments();
  }, [filterLetter, limitQuery]);

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
      let size = querySnapshot.size;
      querySnapshot.forEach((doc) => {
        documents.push(doc.data());
      });
      if (querySnapshot.size === 0)
        return alert("Não foi encontrado paciente com este CPF cadastrado!");
      setPatientsData(documents);
      setDbLength(size);
    };
    const documents: any[] = [];

    return queryFunction();
  };

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

      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mt={2}
      >
        <Typography variant="body2">
          Foram encontrados <b>{dbLength.toString()}</b> resultados
        </Typography>
        <Box display="flex" alignItems="center" columnGap={1}>
          <Typography>Limitar por:</Typography>
          <Box width="fit-content">
            <ReactDropdown
              options={limitValues}
              onChange={({ value }) => setLimitQuery(parseInt(value))}
              value={limitQuery.toString()}
              placeholder="Limitar por:"
            />
          </Box>
        </Box>
      </Box>

      <ListProfiles
        profiles={patientsData}
        setClientID={setClientID}
        notHaveMessage={"Nenhum paciente encontrado."}
        setClientDetailsVisible={setClientDetailsVisible}
      />

      {dbLength > 4 && (
        <Box display="flex" alignItems="center" justifyContent="center">
          <IconButton onClick={handleBackPage}>
            <ArrowBack />
          </IconButton>
          <Typography variant="bold">{page}</Typography>
          <IconButton onClick={handleNextPage}>
            <ArrowForward />
          </IconButton>
        </Box>
      )}
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
