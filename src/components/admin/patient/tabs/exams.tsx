//@ts-nocheck
/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Avatar,
  styled,
  TextField,
  Button,
  Checkbox,
} from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { StyledButton } from "@/components/dynamicAdminBody/receipts";
import Modal from "@/components/modal";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import Loading from "@/components/loading";
import ReplyIcon from "@mui/icons-material/Reply";
import DeleteIcon from "@mui/icons-material/Delete";
import { useRecoilState, useRecoilValue } from "recoil";
import UserData from "@/atoms/userData";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Link from "next/link";
import {
  deleteFile,
  handleUpdatePatient,
  uploadFile,
} from "@/axios/admin/patients";
import PatientData, { Exam } from "@/atoms/patient";
import Image from "next/image";

const PatientExams = () => {
  const [patientData, setPatientData] = useRecoilState(PatientData);

  const [checkBoxList, setCheckBoxList] = useState([]);
  const [addExamVisible, setAddExamVisible] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [imgVisible, setImgVisible] = useState(false);
  const [document, setDocument] = useState(null);
  const [examTitle, setExamTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const userData = useRecoilValue(UserData);
  const exams = patientData?.attributes?.exams;

  const handleCloseExams = () => {
    setAddExamVisible(false);
    setDocument(null);
    setIsLoading(false);
    setExamTitle("");
  };

  const handleCloseSee = () => {
    setImgVisible(false);
  };

  const handleCloseModalDelete = () => {
    setDeleteModal(false);
    setIsLoading(false);
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
      url,
      data,
      file,
    });
  };

  const handleChangeUserFile = async () => {
    if (examTitle === "") return alert("Adicione um titulo");
    if (document === null) return alert("Adicione um arquivo");

    setIsLoading(true);

    await uploadFile(document.data, document.file.type)
      .then(async (res) => {
        const { id } = res.data[0];
        const newExam: Exam = { file: id, name: examTitle };
        const patientId = patientData!.id;
        const clientExams =
          exams?.length > 0
            ? exams.map((e) => {
                return {
                  file: e?.file?.data?.attributes?.id ?? e?.file?.data?.id,
                  name: e?.name,
                };
              })
            : [];

        const updateData = {
          data: {
            exams: [...clientExams, newExam],
          },
        };

        const examsData = [
          ...exams,
          { name: examTitle, file: { data: { attributes: res.data[0], id } } },
        ];

        await handleUpdatePatient(patientId, updateData)
          .then((e) => {
            setPatientData((e: any) => ({
              ...e,
              attributes: {
                ...e.attributes,
                exams: examsData,
              },
            }));
            console.log({ success: e.data });

            handleCloseExams();
          })
          .catch((e) => {
            console.log("err: ", e);
            handleCloseExams();
          });
      })
      .catch((error) => {
        console.log("Err: ", error);
        handleCloseExams();
      });
  };

  const handleDeleteDoc = async () => {
    setIsLoading(true);
    const patientId = patientData!.id;
    const listDeleteData = exams.filter((e, i) => checkBoxList[i] === true);

    const listRestData = exams.filter((e, i) => checkBoxList[i] === false);
    const dataUpdate = listRestData.map((e) => ({
      name: e.name,
      file: e.file.data.id,
    }));

    const updateData = {
      data: {
        exams: dataUpdate,
      },
    };

    // DELETE FILE IN UPLOAD FOLDER
    for (const data of listDeleteData) {
      await deleteFile(data.file.data.id);
    }

    // DELETE COMPONENT AND IN RECOIL DATA
    await handleUpdatePatient(patientId, updateData)
      .then((res) => {
        setPatientData((e) => ({
          ...e,
          attributes: { ...e.attributes, exams: listRestData },
        }));
        console.log({ success: res.data });
        handleCloseModalDelete();
      })
      .catch((e) => {
        console.log({ error: e.data });
        handleCloseModalDelete();
      });
  };

  const renderExams = () => {
    const isDisabled = checkBoxList.every((e) => e === false);

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

    const changeAllItems = (event: React.ChangeEvent<HTMLInputElement>) => {
      setCheckBoxList((e) => e.map(() => event.target.checked));
    };

    const handleDeleteModal = () => setDeleteModal(true);

    return exams && exams?.length > 0 ? (
      <>
        <Typography variant="h5" textAlign={"center"} marginBottom={4}>
          Exames do paciente
        </Typography>
        <Checkbox
          sx={{ marginRight: "16px" }}
          checked={checkBoxList.every((e) => e === true)}
          indeterminate={checkBoxList.every((e) => e === true)}
          onChange={changeAllItems}
        />

        <IconButton disabled={isDisabled} onClick={handleDeleteModal}>
          <DeleteIcon color={isDisabled ? "disabled" : "error"} />
        </IconButton>

        {checkBoxList.map((v, i) => (
          <Box
            key={i}
            display="flex"
            alignItems="center"
            columnGap={1}
            my={1}
            justifyContent="space-between"
            width={"100%"}
          >
            <Box display={"flex"} flexDirection={"row"} alignItems={"center"}>
              <Checkbox
                sx={{ marginRight: "16px" }}
                checked={v}
                onChange={(check) => changeCheckBox(i, check)}
              />

              {exams[i].file?.data?.attributes?.mime === "application/pdf" ? (
                <PictureAsPdfIcon sx={{ fontSize: 36 }} color="error" />
              ) : (
                <Avatar
                  src={`http://localhost:17000${exams[i]?.file?.data?.attributes?.url}`}
                  sx={{ width: "40px", height: "40px", borderRadius: "8px" }}
                />
              )}
            </Box>

            <Typography variant="subtitle1">{exams[i]?.name}</Typography>
            <Link
              passhref="true"
              href={`http://localhost:17000${exams[i]?.file?.data?.attributes?.url}`}
              target="_blank"
            >
              <StyledButton>Ver</StyledButton>
            </Link>
            {userData?.role === "admin" && (
              <IconButton onClick={() => handleDeleteModal(exams[i]?.id)}>
                <DeleteIcon color="error" fontSize="medium" />
              </IconButton>
            )}
          </Box>
        ))}
      </>
    ) : (
      <Typography variant="h5" textAlign={"center"}>
        Não há exames salvos
      </Typography>
    );
  };

  useEffect(() => {
    if (exams?.length > 0) {
      setCheckBoxList(() => exams?.map(() => false));
    }
  }, [exams]);

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
          {document?.file?.type === "image/jpeg" ? (
            <AvatarImg
              src={document?.url}
              onClick={() => setImgVisible(true)}
            />
          ) : document?.file?.type === "application/pdf" ? (
            <AvatarPdf
              display={"flex"}
              alignItems={"center"}
              justifyContent={"center"}
            >
              <PictureAsPdfIcon sx={{ fontSize: 280 }} color="error" />
            </AvatarPdf>
          ) : (
            <></>
          )}

          <Button
            component="label"
            variant="outlined"
            onClick={() => setAddExamVisible(true)}
            startIcon={<AttachFileIcon />}
            sx={{ marginBottom: 1, marginTop: 1 }}
          >
            Escolher arquivo
            <VisuallyHiddenInput type="file" onChange={handleChangeFile} />
          </Button>

          <TextField
            margin="dense"
            value={examTitle}
            label={"Título do Exame"}
            sx={{ width: "100%", my: 1 }}
            onChange={(e) => setExamTitle(e.target.value)}
          />
          <StyledButton
            sx={{ marginTop: "12px" }}
            onClick={handleChangeUserFile}
          >
            Salvar
          </StyledButton>
        </Box>
      </Modal>

      <Modal visible={imgVisible} closeModal={() => setImgVisible(false)}>
        <IconBack onClick={handleCloseSee}>
          <ReplyIcon fontSize="large" />
        </IconBack>
        <Box width={"100%"} height={"100%"} position="relative">
          <Image
            src={document?.url}
            style={{ borderRadius: "8px", objectFit: "cover" }}
            width={500}
            height={600}
            alt=""
          />
        </Box>
      </Modal>

      <Modal visible={deleteModal} closeModal={handleCloseModalDelete}>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Typography variant="h5">
            Deseja realmente apagar este(s) exame(s)?
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

      {/* {patientData?.attributes?.role === "PACIENT" && ( */}
      <Box
        display="flex"
        flexDirection={"column"}
        alignItems="center"
        justifyContent="center"
        m={1}
      >
        <Button
          component="label"
          variant="contained"
          onClick={() => setAddExamVisible(true)}
          startIcon={<CloudUploadIcon />}
          sx={{ marginBottom: 2 }}
        >
          Adicionar exame
        </Button>
      </Box>
      {/* )} */}

      {renderExams()}
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

const AvatarImg = styled(Avatar)`
  width: 300px;
  height: 300px;
  object-fit: cover;
  border-radius: 4px;
  margin: 8px 0;
  cursor: pointer;
`;

const AvatarPdf = styled(Box)`
  width: 300px;
  height: 300px;
  background-color: white;
  border-radius: 4px;
  margin: 8px 0;
  cursor: pointer;
`;

export default PatientExams;
