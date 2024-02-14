//@ts-nocheck
import React, { useState, useEffect } from "react";
import {
  Box,
  styled,
  Typography,
  Button,
  IconButton,
  TextField,
  Checkbox,
} from "@mui/material";
import { StyledButton } from "@/components/dynamicAdminBody/receipts";
import { db } from "@/services/firebase";
import { useRecoilState, useRecoilValue } from "recoil";
import UserData from "@/atoms/userData";
import Loading from "@/components/loading";
import Modal from "@/components/modal";
import Link from "next/link";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import DeleteIcon from "@mui/icons-material/Delete";
import PatientData, { Attachment } from "@/atoms/patient";
import {
  deleteFile,
  handleUpdatePatient,
  uploadFile,
} from "@/axios/admin/patients";

const PatientAttachments = () => {
  const [patientData, setPatientData] = useRecoilState(PatientData);
  const [checkBoxList, setCheckBoxList] = useState<boolean[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [addDocVisible, setAddDocVisible] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [document, setDocument] = useState<any | null>(null);
  const [documentName, setDocumentName] = useState<string>("");
  const [loadingMessage, setLoadingMessage] = useState<string>("");
  const userData = useRecoilValue(UserData);

  const attachments = patientData?.attributes?.attachments;
  const isDisabled = checkBoxList.every((e) => e === false);

  const handleCloseAttachment = () => {
    setAddDocVisible(false);
    setDocument(null);
    setDocumentName("");
    setIsLoading(false);
  };

  const handleDeleteModal = (id: string) => {
    setDeleteModal(true);
  };

  const handleChangeFile = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!event.target.files || event.target.files.length === 0) {
      return; // User canceled file selection
    }

    const file = event.target.files[0];
    const data = new FormData();
    const url = URL.createObjectURL(file);
    data.append("files", file);

    return setDocument({
      file,
      url,
      data,
    });
  };

  const handleChangeUserImage = async () => {
    if (documentName === "") return alert("Adicione nome do documento");
    if (document?.file === null || document?.file === undefined)
      return alert("Adicione um arquivo");

    setIsLoading(true);
    setLoadingMessage("Realizando upload da imagem");

    await uploadFile(document.data, document.file.type)
      .then(async (res) => {
        const { id } = res.data[0];
        const newAttachment: Attachment = {
          file: id,
          name: documentName,
        };
        const patientId = patientData!.id;
        const clientAttachment =
          attachments && attachments?.length > 0
            ? attachments?.map((e) => {
                return {
                  file: e?.file?.data?.attributes?.id ?? e?.file?.data?.id,
                  name: e?.name,
                };
              })
            : [];

        const updateData = {
          data: {
            attachments: [...clientAttachment, newAttachment],
          },
        };

        const attachmentData = [
          ...(attachments ?? []),
          {
            name: documentName,
            file: { data: { attributes: res.data[0], id } },
          },
        ];

        await handleUpdatePatient(patientId, updateData)
          .then((e) => {
            setPatientData((e: any) => ({
              ...e,
              attributes: {
                ...e.attributes,
                attachments: attachmentData,
              },
            }));
            console.log({ success: e.data });
          })
          .catch((e) => {
            console.log("err: ", e);
          });
      })
      .catch((error) => {
        console.log("Err: ", error);
      });
    handleCloseAttachment();
  };

  const handleCloseModalDelete = () => {
    setDeleteModal(false);
    setIsLoading(false);
  };

  const handleDeleteDoc = async () => {
    setIsLoading(true);
    setLoadingMessage("Deletando documento");

    const patientId = patientData!.id;
    const listDeleteData = attachments?.filter(
      (e, i) => checkBoxList[i] === true
    );

    const listRestData = attachments?.filter(
      (e, i) => checkBoxList[i] === false
    );

    const dataUpdate = listRestData?.map((e) => ({
      file: e.file.data.id,
      name: e.name,
    }));

    const updateData = {
      data: {
        attachments: dataUpdate,
      },
    };

    // DELETE FILE IN UPLOAD FOLDER
    for (const data of listDeleteData ?? []) {
      await deleteFile(data.file.data.id);
    }

    // DELETE COMPONENT AND IN RECOIL DATA
    await handleUpdatePatient(patientId, updateData)
      .then((res) => {
        setPatientData((e: any) => ({
          ...e,
          attributes: {
            ...e.attributes,
            attachments: listRestData,
          },
        }));
        console.log({ success: res.data });
      })
      .catch((e) => {
        console.log({ error: e.data });
      });

    handleCloseModalDelete();
  };

  const changeAllItems = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCheckBoxList((e) => e.map(() => event.target.checked));
  };

  const changeCheckBox = (
    i: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCheckBoxList((e) => {
      const newList = [...e];
      newList[i] = event.target.checked;
      return newList;
    });
  };

  useEffect(() => {
    if (attachments && attachments?.length > 0) {
      const list = attachments?.map(() => false);
      setCheckBoxList(list);
    }
  }, [attachments]);

  if (isLoading) {
    return (
      <Box position="fixed" top={0} left={0} zIndex={"999999"}>
        <Loading message={loadingMessage} />
      </Box>
    );
  }

  return (
    <Box display={"flex"} flexDirection={"column"} width="100%">
      <Modal visible={addDocVisible} closeModal={handleCloseAttachment}>
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
          <Button
            component="label"
            variant="outlined"
            startIcon={<AttachFileIcon />}
            sx={{ marginBottom: 1, marginTop: 1 }}
          >
            Adicionar documento
            <VisuallyHiddenInput type="file" onChange={handleChangeFile} />
          </Button>

          {document && document?.file && (
            <Typography variant="body2" marginLeft={2}>
              {document?.file?.name}
            </Typography>
          )}

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
            <StyledButton onClick={handleDeleteDoc}>Sim</StyledButton>
            <StyledButton onClick={handleCloseModalDelete}>Não</StyledButton>
          </Box>
        </Box>
      </Modal>

      <Button
        variant="contained"
        sx={{
          maxWidth: 220,
          marginTop: 3,
          marginBottom: 3,
          alignSelf: "center",
        }}
        startIcon={<AttachFileIcon />}
        onClick={() => setAddDocVisible(true)}
      >
        Adicionar documento
      </Button>

      <ListTitle variant="h5">Lista de documentos</ListTitle>

      <Box display={"flex"} flexDirection={"row"} marginLeft={3.6}>
        <Checkbox
          sx={{ marginRight: 0 }}
          checked={checkBoxList.every((e) => e === true)}
          indeterminate={checkBoxList.every((e) => e === true)}
          onChange={changeAllItems}
        />

        <IconButton disabled={isDisabled} onClick={handleDeleteModal}>
          <DeleteIcon color={isDisabled ? "disabled" : "error"} />
        </IconButton>
      </Box>

      <ListBox>
        {checkBoxList?.length === 0 && (
          <Typography variant="body1">Lista vazia</Typography>
        )}
        {checkBoxList.length > 0 &&
          checkBoxList.map((v, i) => (
            <ListItems key={i}>
              <Box display={"flex"} flexDirection={"row"} alignItems={"center"}>
                <Checkbox
                  sx={{ marginRight: "16px" }}
                  checked={v}
                  onChange={(check) => changeCheckBox(i, check)}
                />

                <Typography variant="h5">{attachments?.[i]?.name}</Typography>
              </Box>

              <Link
                passHref
                href={`http://localhost:17000${attachments?.[i]?.file?.data?.attributes?.url}`}
                target="_blank"
              >
                <StyledButton variant="text" color="info">
                  Visualizar
                </StyledButton>
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

const VisuallyHiddenInput = styled("input")`
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1;
  overflow: hidden;
  position: absolute;
  bottom: 0;
  left: 0;
  white-space: nowrap;
  width: 1;
`;

export default PatientAttachments;
