import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Checkbox,
  IconButton,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import { StyledButton } from "@/components/dynamicAdminBody/receipts";
import Modal from "@/components/modal";
import { db } from "@/services/firebase";
import { useOnSnapshotQuery } from "@/hooks/useOnSnapshotQuery";
import { parseDateIso } from "@/services/services";
import Loading from "@/components/loading";
import Link from "next/link";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import { useRecoilState } from "recoil";
import PatientData, { Problem } from "@/atoms/patient";
import {
  deleteFile,
  handleUpdatePatient,
  uploadFile,
} from "@/axios/admin/patients";
import DeleteIcon from "@mui/icons-material/Delete";

interface ClientDocumentsProps {
  client: any;
}

const PatientProblems = (props: ClientDocumentsProps) => {
  const [checkBoxList, setCheckBoxList] = useState<boolean[]>([]);
  const [patientData, setPatientData] = useRecoilState(PatientData);
  const [isLoading, setIsLoading] = useState(false);
  const [addProblemModal, setAddProblemModal] = useState(false);
  const [problemTitle, setProblemTitle] = useState<string>("");
  const [problemContent, setProblemContent] = useState<string>("");
  const [problemDate, setProblemDate] = useState("");
  const [document, setDocument] = useState<any | null>(null);
  const [deleteModal, setDeleteModal] = useState(false);

  const problems = patientData?.attributes?.problems;
  const isDisabled = checkBoxList.every((e) => e === false);

  const closeProblemModal = () => {
    setProblemContent("");
    setProblemDate("");
    setProblemTitle("");
    setDocument(undefined);
    setAddProblemModal(false);
    setIsLoading(false);
  };

  const handleDeleteModal = () => setDeleteModal(true);

  const handleCloseModalDelete = () => {
    setDeleteModal(false);
    setIsLoading(false);
    setCheckBoxList([]);
  };

  const handleDeleteDoc = async () => {
    setIsLoading(true);
    const patientId = patientData!.id;
    const listDeleteData = problems?.filter((e, i) => checkBoxList[i] === true);

    const listRestData = problems?.filter((e, i) => checkBoxList[i] === false);

    const dataUpdate = listRestData?.map((e) => ({
      file: e.file.data.id,
      title: e.title,
      description: e.description,
      date: new Date(e.date).toISOString(),
    }));

    const updateData = {
      data: {
        problems: dataUpdate,
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
            problems: listRestData,
          },
        }));
        console.log({ success: res.data });
        handleCloseModalDelete();
      })
      .catch((e) => {
        console.log({ error: e.data });
        handleCloseModalDelete();
      });
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

  const addProblemFile = async () => {
    if (problemTitle === "") return alert("Adicione um título para o problema");
    if (problemContent === "")
      return alert("Adicione algum conteúdo do problema");
    if (problemDate === "") return alert("Adicione a data do acontecimento");
    setIsLoading(true);
    const date = new Date(problemDate).toISOString();

    await uploadFile(document.data, document.file.type)
      .then(async (res) => {
        const { id } = res.data[0];
        const newProblem: Problem = {
          file: id,
          title: problemTitle,
          description: problemContent,
          date,
        };
        const patientId = patientData!.id;
        const clientExams =
          problems && problems?.length > 0
            ? problems?.map((e) => {
                return {
                  file: e?.file?.data?.attributes?.id ?? e?.file?.data?.id,
                  title: e?.title,
                  date: e?.date,
                  description: e?.description,
                };
              })
            : [];

        const updateData = {
          data: {
            problems: [...clientExams, newProblem],
          },
        };

        const problemsData = [
          ...(problems ?? []),
          {
            title: problemTitle,
            date,
            description: problemContent,
            file: { data: { attributes: res.data[0], id } },
          },
        ];

        await handleUpdatePatient(patientId, updateData)
          .then((e) => {
            setPatientData((e: any) => ({
              ...e,
              attributes: {
                ...e.attributes,
                problems: problemsData,
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
    closeProblemModal();
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
    if (problems && problems?.length > 0) {
      const list = problems?.map(() => false);
      setCheckBoxList(list);
    }
  }, [problems]);

  return (
    <Box display={"flex"} flexDirection={"column"} width="100%">
      <Modal visible={addProblemModal} closeModal={closeProblemModal}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent={"center"}
          flexDirection="column"
        >
          <TextField
            margin="dense"
            value={problemTitle}
            onChange={(e) => setProblemTitle(e.target.value)}
            label={"Título do Problema"}
            sx={{ width: "100%", mb: 1 }}
          />
          <TextField
            margin="dense"
            value={problemContent}
            onChange={(e) => setProblemContent(e.target.value)}
            label={"Descrição do Problema"}
            sx={{ width: "100%", mb: 1 }}
            multiline
            rows={3}
            maxRows={Infinity}
          />
          <TextField
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
            flexDirection={"column"}
          >
            <Button
              component="label"
              variant="outlined"
              startIcon={<AttachFileIcon />}
              sx={{ marginBottom: 1, marginTop: 1 }}
            >
              Adicionar imagem
              <VisuallyHiddenInput type="file" onChange={handleChangeFile} />
            </Button>
            {document && document?.file && (
              <Typography variant="body2" marginLeft={2}>
                {document?.file?.name}
              </Typography>
            )}
          </Box>
          <StyledButton sx={{ marginTop: "12px" }} onClick={addProblemFile}>
            Salvar
          </StyledButton>
        </Box>
      </Modal>

      <Modal visible={deleteModal} closeModal={handleCloseModalDelete}>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Typography variant="h5">
            Deseja realmente apagar este(s) registro(s)?
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

      {isLoading && (
        <Box position="fixed" top={0} left={0} zIndex={9999}>
          <Loading message="Atualizando..." />
        </Box>
      )}

      <Button
        variant="contained"
        sx={{
          maxWidth: 220,
          marginTop: 3,
          marginBottom: 3,
          alignSelf: "center",
        }}
        startIcon={<ReportProblemIcon />}
        onClick={() => setAddProblemModal(true)}
      >
        Adicionar problema
      </Button>

      <ListTitle variant="h5">Relatórios de problemas</ListTitle>

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
        {checkBoxList?.length > 0 ? (
          checkBoxList?.map((v: any, i) => (
            <Box
              px={2}
              key={i}
              width="100%"
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Box display={"flex"} flexDirection={"row"} alignItems={"center"}>
                <Checkbox
                  sx={{ marginRight: "16px" }}
                  checked={v}
                  onChange={(check) => changeCheckBox(i, check)}
                />

                <Typography variant="h5">{problems?.[i]?.title}</Typography>
              </Box>

              <Typography variant="h5">
                {parseDateIso(problems?.[i]?.date?.substring(0, 10))}
              </Typography>
              <Link
                passHref
                href={`http://localhost:17000${problems?.[i]?.file?.data?.attributes?.url}`}
                target="_blank"
              >
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

export default PatientProblems;
