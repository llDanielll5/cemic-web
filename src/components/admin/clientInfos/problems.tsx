import React, { useState, useEffect } from "react";
import { Box, styled, Typography } from "@mui/material";
import { StyledButton } from "@/components/dynamicAdminBody/receipts";
import Modal from "@/components/modal";
import { StyledTextField } from "@/components/patient/profile";
import {
  Timestamp,
  addDoc,
  collection,
  doc,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import uploadFile from "@/services/uploadFile";
import { db } from "@/services/firebase";
import Loading from "@/components/loading";
import { useOnSnapshotQuery } from "@/hooks/useOnSnapshotQuery";
import Link from "next/link";
import { parseDateIso } from "@/services/services";

interface ClientDocumentsProps {
  client: any;
}

const ClientProblems = (props: ClientDocumentsProps) => {
  const { client } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [addProblemModal, setAddProblemModal] = useState(false);
  const [problemTitle, setProblemTitle] = useState<string>("");
  const [problemContent, setProblemContent] = useState<string>("");
  const [problemDate, setProblemDate] = useState("");
  const [document, setDocument] = useState<any | null>(null);
  const q = query(
    collection(db, "clients_problems"),
    where("client", "==", client!.id ?? "")
  );
  const snapProblems = useOnSnapshotQuery("clients_problems", q, [client]);

  const closeProblemModal = () => setAddProblemModal(false);

  const handleChangeFile = async (e: any) => {
    const targetImg = e.target.files[0];
    return setDocument({
      file: URL.createObjectURL(targetImg),
      img: e.target.files[0],
    });
  };

  const handleSubmit = async () => {
    if (problemTitle === "") return alert("Adicione um título para o problema");
    if (problemContent === "")
      return alert("Adicione algum conteúdo do problema");
    if (problemDate === "") return alert("Adicione a data do acontecimento");
    setIsLoading(true);
    const timestamp = Timestamp.now().seconds;
    const imgName = `${client?.name.replaceAll(" ", "")}-${timestamp}`;
    const imgUpload = await uploadFile(
      "clients_problems",
      imgName,
      document.img
    );
    const clientRef = collection(db, "clients_problems");

    if (imgUpload.state === "Success") {
      return await addDoc(clientRef, {
        media: [imgUpload.url],
        client: client!.id,
        title: problemTitle,
        content: problemContent,
        date: problemDate,
      })
        .then(async (e) => {
          setIsLoading(false);
          const document = doc(db, "clients_problems", e.id);
          closeProblemModal();
          return await updateDoc(document, { id: e.id });
        })
        .catch((err) => {
          setIsLoading(false);
          return alert("Erro ao adicionar documento");
        });
    } else {
      return alert("Erro ao realizar upload de documento");
    }
  };

  return (
    <Box display={"flex"} flexDirection={"column"} width="100%">
      <Modal visible={addProblemModal} closeModal={closeProblemModal}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent={"center"}
          flexDirection="column"
        >
          <StyledTextField
            margin="dense"
            value={problemTitle}
            onChange={(e) => setProblemTitle(e.target.value)}
            label={"Título do Problema"}
            sx={{ width: "100%", mb: 1 }}
          />
          <StyledTextField
            margin="dense"
            value={problemContent}
            onChange={(e) => setProblemContent(e.target.value)}
            label={"Descrição do Problema"}
            sx={{ width: "100%", mb: 1 }}
            multiline
            rows={3}
            maxRows={Infinity}
          />
          <StyledTextField
            type={"date"}
            margin="dense"
            value={problemDate}
            label="Data do Acontecimento*:"
            InputLabelProps={{ shrink: true }}
            onChange={(e) => setProblemDate(e.target.value)}
          />
          <Typography>Caso necessite adicionar imagem, clique aqui.</Typography>
          <Box
            position="relative"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <input
              type={"file"}
              onChange={handleChangeFile}
              title="Adicionar imagem"
            />
          </Box>
          <StyledButton sx={{ marginTop: "12px" }} onClick={handleSubmit}>
            Salvar
          </StyledButton>
        </Box>
      </Modal>

      {isLoading && (
        <Box position="fixed" top={0} left={0} zIndex={9999}>
          <Loading message="Atualizando..." />
        </Box>
      )}

      <StyledButton onClick={() => setAddProblemModal(true)}>
        Adicionar problema
      </StyledButton>

      <ListTitle variant="bold">Relatórios de problemas</ListTitle>
      <ListBox>
        {snapProblems.length > 0 ? (
          snapProblems.map((v: any, i) => (
            <Box
              px={2}
              key={i}
              width="100%"
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography variant="bold">{v?.title}</Typography>
              <Typography variant="bold">{parseDateIso(v?.date)}</Typography>
              <Link passHref href={`/problems/${v?.id}`} target="_blank">
                <StyledButton variant="text" color="info">
                  Visualizar
                </StyledButton>
              </Link>
            </Box>
          ))
        ) : (
          <Typography variant="body1">Lista vazia</Typography>
        )}
      </ListBox>
    </Box>
  );
};

const ListTitle = styled(Typography)`
  margin: 0 auto;
`;
const ListBox = styled(Box)`
  padding: 4px;
  border: 1px solid var(--dark-blue);
  border-radius: 8px;
  margin: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

export default ClientProblems;
