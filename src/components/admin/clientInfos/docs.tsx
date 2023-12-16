//@ts-nocheck
import React, { useState, useEffect } from "react";
import {
  Box,
  styled,
  Typography,
  Button,
  IconButton,
  TextField,
} from "@mui/material";
import { StyledButton } from "@/components/dynamicAdminBody/receipts";
import { useOnSnapshotQuery } from "@/hooks/useOnSnapshotQuery";
import { db } from "@/services/firebase";
import { useRecoilValue } from "recoil";
import UserData from "@/atoms/userData";
import Loading from "@/components/loading";
import uploadFile from "@/services/uploadFile";
import Modal from "@/components/modal";
import Link from "next/link";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Timestamp,
  collection,
  deleteDoc,
  doc,
  query,
  setDoc,
  where,
} from "firebase/firestore";

interface ClientDocumentsProps {
  client: any;
}

const ellipsisText = {
  textOverflow: "ellipsis",
  overflow: "hidden",
  whiteSpace: "nowrap",
  width: "100%",
  zIndex: 1000,
};

const ClientDocuments = (props: ClientDocumentsProps) => {
  const { client } = props;
  const [idImg, setIdImg] = useState("");
  const examRef = collection(db, "clients_docs");
  const [isLoading, setIsLoading] = useState(false);
  const querySnap = query(examRef, where("client", "==", client!.id ?? ""));
  const snapExams = useOnSnapshotQuery("clients_docs", querySnap, [client]);
  const [addDocVisible, setAddDocVisible] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [document, setDocument] = useState<any | null>(null);
  const [documentName, setDocumentName] = useState<string>("");
  const [loadingMessage, setLoadingMessage] = useState<string>("");
  const userData = useRecoilValue(UserData);

  const handleCloseExams = () => {
    setAddDocVisible(false);
    setDocument(null);
    setDocumentName("");
  };

  const handleChangeFile = async (e: any) => {
    const targetImg = e.target.files[0];
    return setDocument({
      file: URL.createObjectURL(targetImg),
      img: e.target.files[0],
    });
  };

  const handleChangeUserImage = async () => {
    setIsLoading(true);
    setLoadingMessage("Realizando upload da imagem");
    const timestamp = Timestamp.now().seconds;
    const imgName = `${client?.name.replaceAll(" ", "")}-${timestamp}`;
    const imgId = `${client!.id}-${timestamp}`;
    const imgUpload = await uploadFile("clients_docs", imgName, document.img);
    const clientRef = doc(db, "clients_docs", imgId);

    if (imgUpload.state === "Success") {
      return await setDoc(clientRef, {
        media: imgUpload.url,
        id: imgId,
        client: client!.id,
        name: documentName,
      })
        .then(() => {
          setIsLoading(false);
          handleCloseExams();
          return;
        })
        .catch((err) => {
          setIsLoading(false);
          return alert("Erro ao adicionar documento");
        });
    } else {
      return alert("Erro ao realizar upload de documento");
    }
  };

  const handleDeleteModal = (id: string) => {
    setIdImg(id);
    setDeleteModal(true);
  };

  const handleCloseModalDelete = () => {
    setDeleteModal(false);
    setIdImg("");
  };

  const handleDeleteImg = async () => {
    setIsLoading(true);
    setLoadingMessage("Deletando documento");
    const reference = doc(db, "clients_docs", idImg);
    return await deleteDoc(reference)
      .then(() => {
        setIsLoading(false);
        handleCloseModalDelete();
        return;
      })
      .catch((err) => {
        setIsLoading(false);
        return alert("Erro ao deletar documento");
      });
  };

  if (isLoading) {
    return (
      <Box position="fixed" top={0} left={0} zIndex={"999999"}>
        <Loading message={loadingMessage} />
      </Box>
    );
  }

  return (
    <Box display={"flex"} flexDirection={"column"} width="100%">
      <Modal visible={addDocVisible} closeModal={handleCloseExams}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent={"center"}
          flexDirection="column"
        >
          <TextField
            margin="dense"
            value={documentName}
            label={"Nome do documento"}
            sx={{ width: "100%", mb: 1 }}
            onChange={(e) => setDocumentName(e.target.value)}
          />
          <input type={"file"} onChange={handleChangeFile} />
          <StyledButton
            sx={{ marginTop: "12px" }}
            onClick={handleChangeUserImage}
          >
            Salvar
          </StyledButton>
        </Box>
      </Modal>
      <Modal visible={deleteModal} closeModal={handleCloseModalDelete}>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Typography variant="h5">
            Deseja realmente apagar este arquivo?
          </Typography>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            columnGap={2}
          >
            <StyledButton onClick={handleDeleteImg}>Sim</StyledButton>
            <StyledButton onClick={handleCloseModalDelete}>Não</StyledButton>
          </Box>
        </Box>
      </Modal>
      <StyledButton onClick={() => setAddDocVisible(true)}>
        Adicionar documento
      </StyledButton>

      <ListTitle variant="h5">Lista de documentos</ListTitle>
      <ListBox>
        {snapExams.length === 0 && (
          <Typography variant="body1">Lista vazia</Typography>
        )}
        {snapExams.length > 0 &&
          snapExams.map((v, i) => (
            <ListItems key={i}>
              <Typography
                variant="body2"
                sx={{ textTransform: "capitalize", width: "40%" }}
              >
                {v.name}
              </Typography>
              <Link passHref href={v.media} target="_blank">
                <Typography variant="subtitle2" sx={{ ...ellipsisText }}>
                  Visualizar
                </Typography>
              </Link>
              {userData?.role === "admin" && (
                <IconButton onClick={() => handleDeleteModal(v?.id)}>
                  <DeleteIcon color="error" fontSize="medium" />
                </IconButton>
              )}
            </ListItems>
          ))}
      </ListBox>
    </Box>
  );
};

const ListTitle = styled(Typography)`
  margin: 0 auto;
`;
const ListBox = styled(Box)`
  padding: 16px 8px;
  border: 1px solid var(--dark-blue);
  border-radius: 8px;
  margin: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const ListItems = styled(Box)`
  display: flex;
  width: 100%;
  padding: 8px;
  height: 40px;
  column-gap: 6px;
  justify-content: space-between;
  align-items: center;
`;

export default ClientDocuments;
