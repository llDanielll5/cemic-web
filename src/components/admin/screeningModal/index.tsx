//@ts-nocheck
import React, { useState, useEffect } from "react";
import Modal from "@/components/modal";
import UserData from "@/atoms/userData";
import styles from "../../../styles/Admin.module.css";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import RemoveIcon from "@mui/icons-material/HighlightOff";
import { useRecoilValue } from "recoil";
import { db } from "@/services/firebase";
import { ProfessionalData } from "types";
import { parseDateBr, phoneMask } from "@/services/services";
import { collection, query, where } from "firebase/firestore";
import { useOnSnapshotQuery } from "@/hooks/useOnSnapshotQuery";
import { scheduleScreening } from "@/services/requests/firestore";
import { StyledButton } from "@/components/dynamicAdminBody/receipts";
import {
  Box,
  Typography,
  styled,
  TextField,
  Autocomplete,
  IconButton,
} from "@mui/material";

interface ScreeningModalProps {
  date: string;
  setVisible: any;
  setClientID: (e: string) => void;
  setIsScheduling: (e: boolean) => void;
  clientDetailsVisible: (e: boolean) => void;
}

const clientRef = collection(db, "clients");

const ScreeningModal = (props: ScreeningModalProps) => {
  const { date, setIsScheduling, setVisible } = props;
  const [y, m, d] = date.split("-");
  const dateBr = `${d}/${m}/${y}`;
  const currUser = useRecoilValue(UserData);
  const [listVisible, setListVisible] = useState(false);
  const [patientsAdded, setPatientsAdded] = useState([]);
  const [notPatientsList, setNotPatientsList] = useState([]);
  const [professionalSelected, setProfessionalSelected] = useState<
    string | null
  >(null);
  const q = query(clientRef, where("role", "==", "pre-register"));
  const snapNotPatients = useOnSnapshotQuery("clients", q);
  const snapProfessionals: ProfessionalData[] =
    useOnSnapshotQuery("professionals");

  useEffect(() => {
    setNotPatientsList(snapNotPatients);
  }, [snapNotPatients]);

  const closeModal = () => setVisible(false);

  const handleAddPatient = ({ item, index }) => {
    setPatientsAdded([item]);
    const filter = notPatientsList.filter((v, i) => i !== index);
    setNotPatientsList(filter);
    setListVisible(false);
    return;
  };

  const handleDeletePatient = (index: number) => {
    const deleted = patientsAdded.filter((v, i) => i !== index);
    return setPatientsAdded(deleted);
  };

  const handleAddHour = ({ value, index }) => {
    const clone = [...patientsAdded];
    clone[index].hour = value;
    setPatientsAdded(clone);
    return;
  };

  const handleSubmit = async () => {
    setIsScheduling(true);
    const falsed = () => {
      setProfessionalSelected(null);
      setIsScheduling(false);
      setVisible(false);
    };
    return await scheduleScreening(
      currUser,
      patientsAdded,
      date,
      professionalSelected
    )
      .then((res) => {
        if (res.message === "Sucesso") {
          falsed();
          return alert("Agendamento concluído!");
        } else {
          props.setIsScheduling(false);
          return alert(
            "Não foi possível realizar o agendamento." + res.message
          );
        }
      })
      .catch(() => {
        props.setIsScheduling(false);
      });
  };

  const NotPatients = () => <h2>Não há pré cadastros no sistema</h2>;

  const PatientSingle = ({ item, index }) => {
    const handleGetDetails = () => {
      props.setClientID(item?.id);
      props.clientDetailsVisible(true);
      return;
    };

    return (
      <Box
        p={2}
        columnGap={1}
        display="flex"
        borderRadius={2}
        alignItems="center"
        justifyContent={"space-between"}
        backgroundColor="#f4f4f4"
        minWidth={"370px"}
      >
        <IconButton
          onClick={() => handleDeletePatient(index)}
          title={`Remover ${item?.name} da lista`}
        >
          <RemoveIcon color="error" />
        </IconButton>

        <TextSchedule variant="body2">{item?.name}</TextSchedule>
        <TextSchedule variant="body2">{phoneMask(item?.phone)}</TextSchedule>

        <TextField
          type="time"
          label="Horário"
          size="small"
          style={{
            width: "fit-content",
            minWidth: "80px",
            backgroundColor: "white",
          }}
          InputLabelProps={{ shrink: true }}
          value={item?.hour ?? ""}
          onChange={({ target }) =>
            handleAddHour({ value: target.value, index })
          }
        />
        <DetailsButton
          title={`Ver mais detalhes do paciente`}
          onClick={handleGetDetails}
        >
          Detalhes
        </DetailsButton>
      </Box>
    );
  };
  const PatientSingleModal = () => {
    return (
      <div style={{ zIndex: 100 }}>
        <h3 style={{ textAlign: "center", marginBottom: "12px" }}>
          Lista de Não-Pacientes
        </h3>
        {notPatientsList.map((item, index) => (
          <Box
            p={0.7}
            key={index}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            border={"1px solid #ccc"}
            borderRadius={2}
            m={1}
          >
            <p>{item?.name}</p>
            <p>{phoneMask(item?.phone)}</p>
            <StyledButton
              endIcon={<PersonAddIcon />}
              title="Adicionar paciente"
              onClick={() => handleAddPatient({ item, index })}
            >
              Adicionar
            </StyledButton>
          </Box>
        ))}
      </div>
    );
  };

  return (
    <Box minWidth={"400px"}>
      <Modal visible={listVisible} closeModal={() => setListVisible(false)}>
        {notPatientsList.length === 0 ? <NotPatients /> : PatientSingleModal()}
      </Modal>

      <Box my={2} display="flex" justifyContent="center">
        <Typography variant="subtitle1">
          Agendar paciente para o dia: {parseDateBr(dateBr)}
        </Typography>
      </Box>

      <Typography variant="subtitle1">
        Relator: <span style={{ fontWeight: 400 }}>{currUser?.name ?? ""}</span>
      </Typography>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={1}
      >
        <Typography variant="subtitle1">Dentista:</Typography>
        <Autocomplete
          limitTags={2}
          sx={{ width: "88%" }}
          options={snapProfessionals}
          getOptionLabel={(option) => option.name}
          isOptionEqualToValue={(option, value) => option.name === value.name}
          onChange={(e, v) => setProfessionalSelected(v)}
          renderInput={(params) => (
            <TextInput
              {...params}
              placeholder="Selecione o dentista."
              variant="standard"
            />
          )}
        />
      </Box>

      <div className={styles.list}>
        {patientsAdded?.map((item, index) => {
          return PatientSingle({ item, index });
        })}
        {patientsAdded.length === 0 && (
          <StyledButton
            onClick={() => setListVisible(true)}
            title={"Selecionar pacientes"}
            endIcon={<PersonAddIcon />}
          >
            Adicionar paciente
          </StyledButton>
        )}
      </div>

      <Box
        display="flex"
        alignItems={"center"}
        justifyContent="flex-end"
        columnGap={1}
      >
        <StyledButton onClick={handleSubmit} title={"Concluir Lista!"}>
          Salvar{" "}
        </StyledButton>
        <StyledButton onClick={closeModal} title={"Cancelar Lista"}>
          Cancelar
        </StyledButton>
      </Box>
    </Box>
  );
};

const TextInput = styled(TextField)`
  border-radius: 4px;
  .MuiAutocomplete-input {
    border: none;
    outline: none;
  }
`;
const TextSchedule = styled(Typography)`
  @media screen and (max-width: 970px) {
    font-size: 12px;
  }
  @media screen and (max-width: 550px) {
    font-size: 10px;
  }
`;

const DetailsButton = styled(StyledButton)`
  @media screen and (max-width: 770px) {
    font-size: 12px;
  }
`;

export default ScreeningModal;
