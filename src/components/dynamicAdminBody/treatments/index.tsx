import React, { useEffect, useState } from "react";
import { Box, Button, Typography, styled, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CustomTable from "@/components/table";
import Modal from "@/components/modal";
import Input from "@/components/input";
import { db } from "@/services/firebase";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import EditIcon from "@mui/icons-material/Edit";
import { maskValue } from "@/services/services";
import { HeaderTitle } from "../lectures/lectureDetails";
import Loading from "@/components/loading";
import {
  collection,
  deleteDoc,
  doc,
  endBefore,
  getCountFromServer,
  getDoc,
  getDocs,
  limit,
  limitToLast,
  orderBy,
  query,
  setDoc,
  startAfter,
  updateDoc,
} from "firebase/firestore";
import { useRecoilValue } from "recoil";
import UserData from "@/atoms/userData";

interface TreatmentValues {
  cod?: string;
  name: string;
  price: string;
}

const defaultValues: TreatmentValues = {
  name: "",
  price: "",
};

type RegisterType = "Register" | "Edit";

const treatmentsRef = collection(db, "treatments");
const q = query(treatmentsRef, orderBy("cod", "asc"), limit(5));

const TreatmentsAdmin = (props: { setIsCreateTreatment: any }) => {
  const { setIsCreateTreatment } = props;
  const [treatmentID, setTreatmentID] = useState("");
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [treatmentValues, setTreatmentValues] = useState(defaultValues);
  const [registerType, setRegisterType] = useState<RegisterType>("Register");
  const [lastVisible, setLastVisible] = useState<any | null>(null);
  const [firstVisible, setFirstVisible] = useState<any | null>(null);
  const [treatments, setTreatments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [page, setPage] = useState(1);
  const userData: any = useRecoilValue(UserData);

  const getTreatments = async () => {
    setIsLoading(true);
    const documentSnapshots = await getDocs(q);
    const lastIndex = documentSnapshots.docs[documentSnapshots.docs.length - 1];
    setLastVisible(lastIndex);
    var arr: any[] = [];
    documentSnapshots.forEach((v: any) => arr.push(v.data()));
    setTreatments(arr);
    setIsLoading(false);
    return;
  };

  const handleNextPage = async () => {
    if (treatments.length === 0) return;
    setIsLoading(true);
    var arr: any[] = [];
    const qNext = query(
      treatmentsRef,
      orderBy("cod"),
      limit(5),
      startAfter(lastVisible)
    );
    const documentSnapshots = await getDocs(qNext);
    const firstIndex = documentSnapshots.docs[0];
    const lastIndex = documentSnapshots.docs[documentSnapshots.docs.length - 1];
    if (documentSnapshots.docs.length === 0) {
      setIsLoading(false);
      return;
    }
    setLastVisible(lastIndex);
    setFirstVisible(firstIndex);
    documentSnapshots.forEach((v: any) => arr.push(v.data()));
    setTreatments(arr);
    setPage((prev) => prev + 1);
    setIsLoading(false);
    return;
  };

  const handleBackPage = async () => {
    if (page === 1) return;
    setIsLoading(true);
    var arr: any[] = [];
    const qPrev = query(
      treatmentsRef,
      orderBy("cod"),
      limitToLast(5),
      endBefore(firstVisible)
    );
    const documentSnapshots = await getDocs(qPrev);
    const firstIndex = documentSnapshots.docs[0];
    const lastIndex = documentSnapshots.docs[documentSnapshots.docs.length - 1];
    if (documentSnapshots.docs.length === 0) {
      setIsLoading(false);
      return;
    }
    setLastVisible(lastIndex);
    setFirstVisible(firstIndex);
    documentSnapshots.forEach((v: any) => arr.push(v.data()));
    setTreatments(arr);
    setPage((prev) => prev - 1);
    setIsLoading(false);
    return;
  };

  useEffect(() => {
    getTreatments();
  }, []);

  function handleChangeValue(field: string, value: string) {
    return setTreatmentValues((prev) => ({ ...prev, [field]: value }));
  }
  function handleCloseModal() {
    setTreatmentValues(defaultValues);
    setModalVisible(false);
    setTreatmentID("");
    return;
  }

  async function handleEditTreatment(e: string) {
    setRegisterType("Edit");
    setModalVisible(true);
    setTreatmentID(e);
    setIsCreateTreatment(true);
    const ref = doc(db, "treatments", e);
    await getDoc(ref)
      .then((res) => {
        setIsCreateTreatment(false);
        return setTreatmentValues({
          name: res?.data()?.name,
          price: res?.data()?.price,
          cod: res?.data()?.cod,
        });
      })
      .catch(() => {
        setIsCreateTreatment(false);
        return alert("Erro ao recuperar dados");
      });
  }
  async function handleEditConclusion() {
    if (treatmentValues.name === "" || treatmentValues.price.length < 4)
      return alert("Preencha os campos acima ");

    setIsCreateTreatment(true);
    const ref = doc(db, "treatments", treatmentID);
    await updateDoc(ref, {
      name: treatmentValues?.name,
      price: treatmentValues?.price,
    })
      .then(() => {
        setIsCreateTreatment(false);
        setModalVisible(false);
        setTreatmentID("");
        setTreatmentValues(defaultValues);
      })
      .catch(() => {
        setIsCreateTreatment(false);
      });
  }

  const handleConclusion = () => {
    if (registerType === "Register") return handleSubmit();
    else return handleEditConclusion();
  };

  const handleSubmit = async () => {
    if (treatmentValues.name === "" || treatmentValues.price.length < 4)
      return alert("Preencha os campos acima ");

    setIsCreateTreatment(true);
    const ref = collection(db, "treatments");
    const snapshot = await getCountFromServer(ref);
    const size = snapshot.data().count;
    const id = size + 1;
    let pathId = id.toString();

    if (id < 10) {
      pathId = `0000${pathId}`;
    } else if (id < 100) {
      pathId = `000${pathId}`;
    } else if (id < 1000) {
      pathId = `00${pathId}`;
    } else if (id < 10000) {
      pathId = `0${pathId}`;
    }

    const treatmentDoc = doc(db, "treatments", pathId);
    const data: TreatmentValues = {
      ...treatmentValues,
      cod: pathId,
    };
    return await setDoc(treatmentDoc, data)
      .then((res) => {
        setIsCreateTreatment(false);
        setModalVisible(false);
        setTreatmentValues(defaultValues);
        return;
      })
      .catch((err) => {
        setIsCreateTreatment(false);
        return alert("Houve um erro");
      });
  };

  const handleDeleteDoc = async (e: string) => {
    setIsCreateTreatment(true);
    const docRef = doc(db, "treatments", e);
    await deleteDoc(docRef)
      .then(() => {
        setIsCreateTreatment(false);
        setTreatmentValues(defaultValues);
        return alert("Sucesso ao excluir o tratamento.");
      })
      .catch(() => {
        setIsCreateTreatment(false);
        return alert("Erro ao excluir");
      });
  };

  return (
    <Box
      display={"flex"}
      width={"100%"}
      alignItems={"center"}
      justifyContent={"center"}
      flexDirection={"column"}
    >
      {isLoading && (
        <Box position="fixed" left={0} top={0}>
          <Loading message="Carregando informações" />
        </Box>
      )}
      <Modal visible={modalVisible} closeModal={handleCloseModal}>
        <h4 style={{ margin: "0 auto" }}>Adicionar Tratamento</h4>
        <Box
          display={"flex"}
          width={"100%"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Box width={"48%"}>
            <Input
              label="Tratamento"
              value={treatmentValues.name}
              onChange={(e) => handleChangeValue("name", e)}
              onKeyDown={({ key }: any) => {
                if (key === "Enter") return handleConclusion();
              }}
            />
          </Box>
          <Box width={"48%"}>
            <Input
              label="Preço"
              value={treatmentValues.price}
              onChange={(e) => handleChangeValue("price", maskValue(e))}
              maxLenght={10}
              onKeyDown={({ key }: any) => {
                if (key === "Enter") return handleConclusion();
              }}
            />
          </Box>
        </Box>

        <AddButton
          color="info"
          variant="outlined"
          title="Adicionar novo tratamento"
          endIcon={registerType === "Register" ? <AddIcon /> : <EditIcon />}
          onClick={() => handleConclusion()}
        >
          {registerType === "Register" ? "Adicionar" : "Editar"}
        </AddButton>
      </Modal>
      {userData.role === "admin" && (
        <AddButton
          color="info"
          variant="outlined"
          title="Adicionar novo tratamento"
          endIcon={<AddIcon />}
          onClick={() => {
            setRegisterType("Register");
            setModalVisible(true);
          }}
        >
          Adicionar Tratamento
        </AddButton>
      )}

      <Typography variant="bold" my={2}>
        Tratamentos Cadastrados
      </Typography>

      <Box mx={1} px={2} width={"100%"} mb={2}>
        <CustomTable
          data={treatments}
          onEdit={handleEditTreatment}
          onDelete={handleDeleteDoc}
          messageNothing="Não encontramos tratamentos cadastrados."
          titles={["Código", "Tratamento", "Preço", "Editar", "Excluir"]}
        />
      </Box>

      <Box display="flex" alignItems="center" justifyContent="flex-end" mb={2}>
        <IconButton onClick={handleBackPage}>
          <ChevronLeftIcon fontSize="large" />
        </IconButton>
        <HeaderTitle variant="semibold">{page}</HeaderTitle>
        <IconButton onClick={handleNextPage}>
          <ChevronRightIcon fontSize="large" />
        </IconButton>
      </Box>
    </Box>
  );
};

const AddButton = styled(Button)`
  margin: 0 auto;
  background-color: white;
  border-radius: 16px;
  margin: 16px 0 8px 0;
  color: var(--dark-blue);
  border-color: var(--dark-blue);
  font-weight: 700;
  :hover {
    border-color: var(--blue);
    background-color: var(--dark-blue);
    color: white;
  }
`;

export default TreatmentsAdmin;
