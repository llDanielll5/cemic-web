//@ts-nocheck
/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import { Box, Typography, IconButton, Avatar, styled } from "@mui/material";
import { useOnSnapshotQuery } from "@/hooks/useOnSnapshotQuery";
import { StyledButton } from "@/components/dynamicAdminBody/receipts";
import { db } from "@/services/firebase";
import Modal from "@/components/modal";
import uploadFile from "@/services/uploadFile";
import Loading from "@/components/loading";
import ReplyIcon from "@mui/icons-material/Reply";
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
import { useRecoilValue } from "recoil";
import UserData from "@/atoms/userData";
import { StyledTextField } from "@/components/patient/profile";
import Link from "next/link";

interface ClientExamsProps {
  client: any;
}

const avatarImg = {
  width: 200,
  height: 200,
  borderRadius: "4px",
  margin: "8px 0",
  cursor: "pointer",
};

const ClientExams = (props: ClientExamsProps) => {
  const { client } = props;
  const examRef = collection(db, "clients_exams");
  const querySnap = query(examRef, where("client", "==", client!.id ?? ""));
  const snapExams = useOnSnapshotQuery("clients_exams", querySnap, [client]);
  const [addExamVisible, setAddExamVisible] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [imgVisible, setImgVisible] = useState(false);
  const [document, setDocument] = useState<any | null>(null);
  const [examTitle, setExamTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [idImg, setIdImg] = useState("");
  const userData = useRecoilValue(UserData);

  const handleCloseExams = () => {
    setAddExamVisible(false);
    setDocument(null);
  };
  const handleCloseSee = () => {
    setImgVisible(false);
    setDocument(null);
  };

  const handleChangeFile = async (e: any) => {
    const targetImg = e.target.files[0];
    return setDocument({
      file: URL.createObjectURL(targetImg),
      img: e.target.files[0],
    });
  };

  const handleChangeUserImage = async () => {
    if (examTitle === "") return alert("Adicione um titulo");
    if (document === null) return alert("Adicione uma imagem");
    setIsLoading(true);
    const timestamp = Timestamp.now().seconds;
    const imgName = `${client?.name.replaceAll(" ", "")}-${timestamp}`;
    const imgId = `${client!.id}-${timestamp}`;
    const imgUpload = await uploadFile("clients", imgName, document.img);
    const clientRef = doc(db, "clients_exams", imgId);

    if (imgUpload.state === "Success") {
      return await setDoc(clientRef, {
        media: imgUpload.url,
        id: imgId,
        title: examTitle,
        client: client!.id,
      })
        .then(() => {
          setIsLoading(false);
          handleCloseExams();
          return;
        })
        .catch((err) => {
          setIsLoading(false);
          return alert("Erro ao adicionar exame");
        });
    } else {
      return alert("Erro ao realizar upload de imagem");
    }
  };

  const handleSeeExam = (media: string) => {
    setDocument({ file: media });
    setImgVisible(true);
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
    const reference = doc(db, "clients_exams", idImg);
    return await deleteDoc(reference)
      .then(() => {
        setIsLoading(false);
        handleCloseModalDelete();
        return;
      })
      .catch((err) => {
        setIsLoading(false);
        return alert("Erro ao deletar exame");
      });
  };

  if (isLoading) {
    return (
      <Box position="fixed" top={0} left={0} zIndex={"999999"}>
        <Loading message="Atualizando informações do usuário..." />
      </Box>
    );
  }

  return (
    <Box p={2} width="100%">
      <Modal visible={addExamVisible} closeModal={handleCloseExams}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent={"center"}
          flexDirection="column"
        >
          <Avatar
            src={document?.file ?? ""}
            onClick={() => setImgVisible(true)}
            sx={{ ...avatarImg }}
          />
          <input type={"file"} onChange={handleChangeFile} />

          <StyledTextField
            margin="dense"
            value={examTitle}
            label={"Título do Exame"}
            sx={{ width: "100%", my: 1 }}
            onChange={(e) => setExamTitle(e.target.value)}
          />
          <StyledButton
            sx={{ marginTop: "12px" }}
            onClick={handleChangeUserImage}
          >
            Salvar
          </StyledButton>
        </Box>
      </Modal>
      <Modal
        visible={imgVisible}
        closeModal={() => setImgVisible(false)}
        style={{
          content: { width: "100%", height: "100%", padding: "8px" },
        }}
      >
        <IconBack onClick={handleCloseSee}>
          <ReplyIcon fontSize="large" />
        </IconBack>
        <Box width={"100%"} height={"100%"} position="relative">
          <img
            src={document?.file ?? ""}
            style={{ borderRadius: "8px", width: "100%", height: "100%" }}
            alt=""
          />
        </Box>
      </Modal>

      <Modal visible={deleteModal} closeModal={handleCloseModalDelete}>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Typography variant="bold">
            Deseja realmente apagar este exame?
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

      <Box display="flex" alignItems="center" justifyContent="center" m={1}>
        <Typography variant="bold" textAlign={"center"}>
          Exames do paciente
        </Typography>
      </Box>
      {snapExams.length === 0 && (
        <Box>
          <h5>Não há exames salvos</h5>
        </Box>
      )}
      {snapExams.length > 0 &&
        snapExams.map((v, i) => (
          <Box
            key={i}
            display="flex"
            alignItems="center"
            columnGap={1}
            my={1}
            justifyContent="space-between"
            width={"100%"}
          >
            <Avatar
              src={v?.media}
              sx={{ width: "40px", height: "40px", borderRadius: "8px" }}
            />
            <Typography variant="semibold">{v?.title}</Typography>
            <Link passHref href={v?.media} target="_blank">
              <StyledButton>Ver</StyledButton>
            </Link>
            {userData?.role === "admin" && (
              <IconButton onClick={() => handleDeleteModal(v?.id)}>
                <DeleteIcon color="error" fontSize="medium" />
              </IconButton>
            )}
          </Box>
        ))}

      {client?.role === "patient" && (
        <Box display="flex" alignItems="center" justifyContent="center" mt={1}>
          <StyledButton
            onClick={() => setAddExamVisible(true)}
            endIcon={<AssignmentIndIcon />}
          >
            Adicionar Exame
          </StyledButton>
        </Box>
      )}
    </Box>
  );
};

const IconBack = styled(IconButton)`
  position: absolute;
  top: 45px;
  left: 45px;
  background-color: white;
  border-radius: 50%;
  z-index: 5000;
`;

export default ClientExams;
