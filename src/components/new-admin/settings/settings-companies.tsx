import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import CreateIcon from "@mui/icons-material/Create";
import AddIcon from "@mui/icons-material/Add";
import axiosInstance from "@/axios";
import CModal from "@/components/modal";

export const SettingsCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const [modal, setModal] = useState(false);

  const [nameFilial, setNameFilial] = useState("");
  const [ufFilial, setUfFilial] = useState("");

  const getAllCompanies = async () => {
    return await axiosInstance
      .get("/companies")
      .then(({ data }) => setCompanies(data.data));
  };

  useEffect(() => {
    getAllCompanies();
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setModal(true);
  };

  const onAddFilial = async () => {
    const data = {
      filial: nameFilial,
      location: ufFilial,
    };
    return await axiosInstance
      .post("/companies", { data })
      .then((res) => {
        setNameFilial("");
        setUfFilial("");
        setModal(false);
        getAllCompanies();
      })
      .catch((err) => {
        alert("Não foi possível criar a filial");
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* <Snackbar
        open={surface}
        message={surfaceMsg}
        anchorOrigin={{ horizontal: "right", vertical: "top" }}
        autoHideDuration={2000}
        onClose={() => setSurface(!surface)}
      >
        <Alert
          onClose={() => setSurface(!surface)}
          severity={surfaceColor}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {surfaceMsg}
        </Alert>
      </Snackbar> */}

      {modal && (
        <CModal
          closeModal={() => setModal(false)}
          visible={modal}
          styles={{
            width: "90vw",
            display: "flex",
            flexDirection: "column",
            rowGap: 2,
          }}
        >
          <Typography variant="h5">Adicionar Filial</Typography>

          <TextField
            label="Nome Filial"
            value={nameFilial}
            onChange={({ target }) => setNameFilial(target.value)}
          />
          <TextField
            label="UF Filial"
            value={ufFilial}
            onChange={({ target }) => setUfFilial(target.value)}
          />
          <Button variant="contained" onClick={onAddFilial}>
            Adicionar
          </Button>
        </CModal>
      )}

      <Card>
        <CardHeader subheader="Organizar Filiais" title="Filiais" />
        <Divider />
        <CardContent>
          <Stack spacing={3}>
            {companies.map((v: any, i) => (
              <Box
                key={i}
                display={"flex"}
                justifyContent={"space-between"}
                alignItems={"center"}
                width={"100%"}
                border="1px solid #ccc"
                borderRadius={2}
                px={2}
              >
                <Typography variant="h6">{`${v.attributes.filial}-${v.attributes.location}`}</Typography>
                <Button variant="text" endIcon={<CreateIcon />}>
                  Editar
                </Button>
              </Box>
            ))}
          </Stack>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: "flex-end" }}>
          <Button variant="contained" type="submit" startIcon={<AddIcon />}>
            Adicionar Filial
          </Button>
        </CardActions>
      </Card>
    </form>
  );
};
