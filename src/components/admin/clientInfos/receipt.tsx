import React, { useState } from "react";
import Link from "next/link";
import { db } from "@/services/firebase";
import { Box, Typography, IconButton, styled } from "@mui/material";
import { useOnSnapshotQuery } from "@/hooks/useOnSnapshotQuery";
import PostAddIcon from "@mui/icons-material/PostAdd";
import Modal from "@/components/modal";
import uploadFile from "@/services/uploadFile";
import Loading from "@/components/loading";
import DeleteIcon from "@mui/icons-material/Delete";
import { StyledButton } from "@/components/dynamicAdminBody/receipts";
import { StyledTextField } from "@/components/patient/profile";
import {
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { parseDateIso } from "@/services/services";

interface ReceiptProps {
  client?: any;
}

const Receipt = (props: ReceiptProps) => {
  const ref = collection(db, "clients_receipts");
  const q = query(ref, where("client", "==", props.client?.id ?? ""));
  // const snapReceipts = useOnSnapshotQuery("receipts", q);
  const snapReceipts = useOnSnapshotQuery("clients_receipts", q, [
    props.client,
  ]);
  const [addReceiptVisible, setAddReceiptVisible] = useState(false);
  const [receiptDate, setReceiptDate] = useState<string>("");
  const [document, setDocument] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [idReceipt, setIdReceipt] = useState("");

  const closeAddReceipt = () => {
    setDocument(null);
    setReceiptDate("");
    setAddReceiptVisible(false);
  };
  const handleCloseModalDelete = () => {
    setIdReceipt("");
    setDeleteVisible(false);
  };

  const handleChangeFile = async (e: any) => {
    const targetImg = e.target.files[0];
    return setDocument({
      file: URL.createObjectURL(targetImg),
      img: e.target.files[0],
    });
  };

  const getReceiptId = (id: string) => {
    setIdReceipt(id);
    setDeleteVisible(true);
  };
  const handleDeleteReceipt = async () => {
    setIsLoading(true);
    const reference = doc(db, "clients_receipts", idReceipt);
    return await deleteDoc(reference)
      .then(() => {
        setIsLoading(false);
        handleCloseModalDelete();
        return;
      })
      .catch((err) => {
        setIsLoading(false);
        return alert("Erro ao deletar recibo");
      });
  };

  const handleSubmit = async () => {
    if (receiptDate === "") return alert("Adicione a data do Recibo");
    setIsLoading(true);
    const timestamp = Timestamp.now().seconds;
    const clientRef = collection(db, "clients_receipts");
    const imgName = `${props?.client?.name.replaceAll(" ", "")}-${timestamp}`;
    const imgUpload = await uploadFile(
      "clients_receipts",
      imgName,
      document.img
    );

    if (imgUpload.state === "Success") {
      return await addDoc(clientRef, {
        media: imgUpload.url,
        client: props?.client!.id,
        title: `Recibo ${props?.client?.id}-${timestamp}`,
        date: receiptDate,
      })
        .then(async (e) => {
          setIsLoading(false);
          const document = doc(db, "clients_receipts", e.id);
          closeAddReceipt();
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

  if (isLoading)
    return (
      <Box position="fixed" top={0} left={0} zIndex={999999}>
        <Loading message="Atualizando..." />
      </Box>
    );

  if (!props.client?.id) return null;
  else
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
        width="100%"
        border={"1.5px solid var(--dark-blue)"}
        borderRadius={1}
      >
        {/* SNAPSHOT DE RECIBOS AUTOMATIZADOS DO SISTEMA FUTURO */}
        {/* {snapReceipts.map((v, i) => (
          <Box
            p={1}
            key={i}
            my={1}
            display="flex"
            borderRadius="8px"
            alignItems="center"
            justifyContent="space-between"
            border="1.3px solid #bbb"
          >
            <Typography variant="semibold">
              Valor: <strong>{v?.totalStr}</strong>{" "}
            </Typography>
            <Typography variant="semibold">
              {v?.timestamp?.toDate().toLocaleDateString("pt-br")}
            </Typography>
            <Link passHref target="_blank" href={`/admin/receipt/${v?.id}`}>
              <StyledButton>Detalhes</StyledButton>
            </Link>
          </Box>
        ))} */}
        <Modal visible={deleteVisible} closeModal={handleCloseModalDelete}>
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
              <StyledButton onClick={handleDeleteReceipt}>Sim</StyledButton>
              <StyledButton onClick={handleCloseModalDelete}>Não</StyledButton>
            </Box>
          </Box>
        </Modal>
        <Modal visible={addReceiptVisible} closeModal={closeAddReceipt}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent={"center"}
            flexDirection="column"
          >
            <StyledTextField
              type={"date"}
              margin="dense"
              value={receiptDate}
              label="Data do Recibo*:"
              InputLabelProps={{ shrink: true }}
              onChange={(e) => setReceiptDate(e.target.value)}
            />
            <Typography mt={1}>
              Adicione a Imagem do recibo aqui (Foto ou PDF)
            </Typography>
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

        <Typography variant="semibold" fontSize={16} mt={1.5} mb={0.75}>
          Recibos
        </Typography>

        <StyledButton
          endIcon={<PostAddIcon sx={{ color: "white" }} />}
          onClick={() => setAddReceiptVisible(true)}
        >
          Gerar Recibo
        </StyledButton>

        <Box p={2} width="100%">
          <Box
            px={1}
            my={1}
            width="100%"
            display="flex"
            borderRadius={1}
            justifyContent="space-between"
            alignItems="center"
          >
            <TextId variant="bold">ID Recibo</TextId>
            <Typography variant="bold">Data do Recibo</Typography>
            <Box display="flex" columnGap={1} />
          </Box>
          {snapReceipts.map((v, i) => (
            <ReceiptSingle key={i}>
              <TextId variant="semibold">{v?.id}</TextId>
              <Typography variant="semibold">
                {parseDateIso(v?.date)}
              </Typography>
              <Box display="flex" columnGap={1}>
                <Link passHref href={v?.media} target="_blank">
                  <ViewReceiptButton variant="text">
                    Visualizar
                  </ViewReceiptButton>
                </Link>
                <IconButton
                  title={`Excluir recibo ${v?.id}`}
                  onClick={() => getReceiptId(v?.id)}
                >
                  <DeleteIcon color="error" />
                </IconButton>
              </Box>
            </ReceiptSingle>
          ))}
        </Box>
      </Box>
    );
};

const ReceiptSingle = styled(Box)`
  padding: 0 8px;
  margin: 8px 0;
  width: 100%;
  display: flex;
  border-radius: 8px;
  justify-content: space-between;
  background-color: #cacaca;
  align-items: center;
`;
const TextId = styled(Typography)`
  @media screen and (max-width: 600px) {
    display: none;
  }
`;
const ViewReceiptButton = styled(StyledButton)`
  @media screen and (max-width: 470px) {
    font-size: 12px;
  }
`;

export default Receipt;
