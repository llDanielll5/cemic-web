//@ts-nocheck
import React, { useState, useEffect } from "react";
import Modal from "@/components/modal";
import UserData from "@/atoms/userData";
import Button from "@/components/button";
import styles from "../../../styles/Admin.module.css";
import { useRecoilValue } from "recoil";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
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
} from "@mui/material";
import { db } from "@/services/firebase";
import { ProfessionalData } from "types";

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
      <div className={styles["list-item"]}>
        <div
          className={styles.less}
          onClick={() => handleDeletePatient(index)}
          title={`Remover ${item?.name} da lista`}
        >
          -
        </div>
        <p>{item?.name}</p>
        <p>{phoneMask(item?.phone)}</p>
        <input
          type="time"
          className={styles.hour}
          onChange={({ target }) =>
            handleAddHour({ value: target.value, index })
          }
          value={item?.hour ?? ""}
        />
        <Button
          title={`Ver mais detalhes do paciente`}
          onClick={handleGetDetails}
        >
          Detalhes
        </Button>
      </div>
    );
  };
  const PatientSingleModal = () => {
    return (
      <div style={{ zIndex: 100 }}>
        <h3 style={{ textAlign: "center", marginBottom: "12px" }}>
          Lista de Não-Pacientes
        </h3>
        {notPatientsList.map((item, index) => (
          <div key={index} className={styles["modal-center"]}>
            <p>{item?.name}</p>
            <p>{phoneMask(item?.phone)}</p>
            <StyledButton
              endIcon={<PersonAddIcon />}
              title="Adicionar paciente"
              onClick={() => handleAddPatient({ item, index })}
            >
              Adicionar
            </StyledButton>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={styles["screening-modal-container"]}>
      <Modal visible={listVisible} closeModal={() => setListVisible(false)}>
        {notPatientsList.length === 0 ? <NotPatients /> : PatientSingleModal()}
      </Modal>

      <h4>Agendar paciente para o dia: {parseDateBr(dateBr)}</h4>
      <Typography variant="semibold">
        Relator: <span style={{ fontWeight: 400 }}>{currUser?.name ?? ""}</span>
      </Typography>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={1}
      >
        <Typography variant="semibold">Dentista:</Typography>
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

      <div className={styles["buttons-footer"]}>
        <StyledButton onClick={handleSubmit} title={"Concluir Lista!"}>
          Salvar{" "}
        </StyledButton>
        <StyledButton onClick={closeModal} title={"Cancelar Lista"}>
          Cancelar
        </StyledButton>
      </div>
    </div>
  );
};

const TextInput = styled(TextField)`
  border-radius: 4px;
  .MuiAutocomplete-input {
    border: none;
    outline: none;
  }
`;

export default ScreeningModal;
