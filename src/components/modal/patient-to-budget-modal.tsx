import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Avatar,
  Typography,
  Stack,
  Checkbox,
} from "@mui/material";
import { motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { handleGetAllDentists } from "@/axios/admin/dentists";
import { DENTIST_SPECIALTIES_LABELS } from "@/utils/dentists";
import axiosInstance from "@/axios";
import { useRecoilValue } from "recoil";
import { toast } from "react-toastify";
import { useLoading } from "@/contexts/LoadingContext";

interface DentistSelect extends DentistInterface {
  selected: boolean;
}

export default function PatientBudgetModal({
  open,
  onClose,
  patientId,
}: {
  open: boolean;
  onClose: () => void;
  patientId: number;
}) {
  const { handleLoading } = useLoading();
  const [dentists, setDentists] = useState<StrapiData<DentistSelect>[]>([]);

  const toggleMember = (index: number) => {
    const updated = [...dentists];
    updated[index].attributes.selected = !updated[index].attributes.selected;
    setDentists(updated);
  };

  const getAllDentists = useCallback(async () => {
    const { data } = await handleGetAllDentists();
    const mappedData: StrapiData<DentistSelect>[] = (
      data.data as StrapiData<DentistSelect>[]
    ).map((d) => ({
      ...d,
      attributes: { ...d.attributes, selected: false },
    }));
    setDentists(mappedData as StrapiData<DentistSelect>[]);
  }, []);

  const onForwardPatient = async () => {
    handleLoading(true, "Encaminhando o paciente...");
    const seletedDentist = dentists.find((d) => !!d.attributes.selected);
    const data: CreatePatientBudgetDentist = {
      date: new Date(),
      dentist: seletedDentist?.id!,
      isCompleted: false,
      patient: patientId,
    };
    try {
      await axiosInstance.post(`/patient-budget-dentists`, { data });
      toast.success("Sucesso ao encaminhar o paciente para orçamento!");
      onClose();
    } catch (error) {
      toast.error("Erro ao encaminhar o paciente para orçamento");
    } finally {
      handleLoading(false);
    }
  };

  useEffect(() => {
    getAllDentists();
  }, [getAllDentists]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperComponent={(props) => (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.3 }}
          style={{ borderRadius: 16, backgroundColor: "#fff", padding: 24 }}
          {...props}
        />
      )}
      PaperProps={{
        sx: {
          borderRadius: 4,
          p: 3,
          bgcolor: "#fff",
        },
      }}
    >
      <DialogTitle>
        <Stack direction="column" alignItems="center" spacing={2}>
          <Typography variant="h6">
            Encaminhar Paciente para Orçamento
          </Typography>
          <Typography variant="body2" textAlign="center">
            Escolha o Dentista que fará orçamento do Paciente {}
          </Typography>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            bgcolor="#f3f4f6"
            px={2}
            py={1}
            borderRadius={2}
            width="100%"
          >
            <Typography variant="body2" noWrap>
              Encaminhamentos de Orçamento
            </Typography>
          </Stack>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ pt: 4 }}>
        <Stack spacing={2}>
          {dentists.map((dentist, index) => {
            const d = dentist.attributes;
            const user = (d.user as StrapiRelationData<AdminType>).data
              .attributes;

            return (
              <Stack
                key={index}
                direction="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Checkbox
                    checked={d.selected}
                    onChange={() => toggleMember(index)}
                  />
                  <Avatar src={"/images/icons/dentist.png"} />
                  <Stack>
                    <Typography variant="body1" fontWeight={600}>
                      {user.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {DENTIST_SPECIALTIES_LABELS[d.specialty]}
                    </Typography>
                  </Stack>
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  {d.cro}
                </Typography>
              </Stack>
            );
          })}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "space-between", mt: 2 }}>
        <Button onClick={onClose} variant="outlined" color="inherit">
          Cancelar
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => onForwardPatient()}
        >
          Encaminhar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
