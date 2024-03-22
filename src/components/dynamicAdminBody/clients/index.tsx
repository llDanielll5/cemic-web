import React, { useState, useEffect } from "react";
import { StyledButton } from "../receipts";
import { Box, styled, IconButton, Typography } from "@mui/material";
import Modal from "@/components/modal";
import NewPatientForm from "../../new-admin/patient/newPatient";
import Loading from "@/components/loading";
import ListProfiles from "@/components/listProfiles";
import ArrowBack from "@mui/icons-material/ArrowBackIosNew";
import ArrowForward from "@mui/icons-material/ArrowForwardIos";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import { PatientInterface } from "types/patient";

interface ClientsAdminProps {
  setClientDetailsVisible: (e: boolean) => void;
  setClientID: (e: string) => void;
}

const limitValues = ["3", "5", "10", "20", "50"];

const ClientsAdmin = (props: ClientsAdminProps) => {
  const { setClientDetailsVisible, setClientID } = props;

  const [isLoading, setIsloading] = useState(false);
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  const [patientFilterValue, setPatientFilterValue] = useState("");
  const [newPatientVisible, setNewPatientVisible] = useState(false);
  const [filterLetter, setFilterLetter] = useState<string | null>("A");
  const [patientsData, setPatientsData] = useState<PatientInterface[] | []>([]);
  const [filterByClientType, setFilterByClientType] = useState("");
  const [lastVisible, setLastVisible] = useState<any | null>(null);
  const [firstVisible, setFirstVisible] = useState<any | null>(null);
  const [limitQuery, setLimitQuery] = useState<number>(5);
  const [dbLength, setDbLength] = useState<number>(0);
  const [page, setPage] = useState<number>(1);

  /**  ONSNAPSHOT FOR LETTER FILTER   */
  // const qPatientLetter = query(
  //   patientsRef,
  //   where("firstLetter", "==", filterLetter),
  //   orderBy("name"),
  //   limit(limitQuery)
  // );
  // const queryAllSize = query(
  //   patientsRef,
  //   where("firstLetter", "==", filterLetter),
  //   orderBy("name")
  // );
  // const filterPatientByLetter = useOnSnapshotQuery("clients", qPatientLetter, [
  //   filterLetter,
  // ]);
  /** ********** */

  const getTreatments = async () => {
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
    return;
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
      >
        <NewPatientForm onClose={handleCloseNewPatientModal} />
      </Modal>

      <Center>
        <StyledButton
          endIcon={<PersonAddAlt1Icon />}
          onClick={() => setNewPatientVisible(true)}
        >
          Lançar paciente
        </StyledButton>
      </Center>

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
            {/* <ReactDropdown
              options={limitValues}
              onChange={({ value }) => setLimitQuery(parseInt(value))}
              value={limitQuery.toString()}
              placeholder="Limitar por:"
            /> */}
          </Box>
        </Box>
      </Box>

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
