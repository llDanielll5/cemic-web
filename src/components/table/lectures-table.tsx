import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { LectureStatusMissed } from "./lectureStatusMissed";
import {
  alpha,
  Button,
  Chip,
  FormControlLabel,
  IconButton,
  Stack,
  styled,
  Switch,
  Tooltip,
  Typography,
} from "@mui/material";
import axiosInstance from "@/axios";
import { toast } from "react-toastify";
import { useRecoilValue } from "recoil";
import UserData from "@/atoms/userData";
import { SeverityPill } from "../new-admin/comps/severity-pill";
import {
  patientLocationColor,
  patientLocationName,
} from "../new-admin/overview/overview-latest-orders";
import { Add, AddReaction } from "@mui/icons-material";

interface LecturesTableInterface {
  tableHeads: string[];
  tableData: StrapiData<LecturesInterface>[];
  onChangeTable: () => void;
}

type ScheduleItem = {
  hour: string;
  wa_schedule?: {
    data?: {
      attributes?: {
        hour: string;
      };
    };
  };
  // outros campos...
};

export default function LecturesTable({
  tableData,
  tableHeads,
  onChangeTable,
}: LecturesTableInterface) {
  const adminData = useRecoilValue(UserData);

  const handleChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    id: number,
    type: "missed" | "exam",
    oldValue: boolean
  ) => {
    try {
      await axiosInstance.put(`/lectures/${id}`, {
        data: {
          ...(type === "missed"
            ? { isMissed: !oldValue }
            : { examRequest: !oldValue }),
        },
      });
      toast.success(
        `${
          type === "missed" ? "Presença" : "Pedido de Exame"
        } atualizado com sucesso do cliente!`
      );
      onChangeTable();
    } catch (error) {
      toast.error(
        `Erro ao atualizar ${
          type === "missed" ? "Presença" : "Requisição de Exame"
        } do cliente`
      );
    }
  };

  const handlePatientConvert = async (schedule: WAScheduleInterface) => {};

  if (!tableData) return <></>;

  function sortByHour(list: StrapiData<LecturesInterface>[]) {
    return list.sort((a, b) => {
      const hourA =
        (a.attributes.wa_schedule as StrapiRelationData<WAScheduleInterface>)
          ?.data?.attributes?.hour || a.attributes.hour;
      const hourB =
        (b.attributes.wa_schedule as StrapiRelationData<WAScheduleInterface>)
          ?.data?.attributes?.hour || b.attributes.hour;

      // Transforma "HH:mm" em minutos totais para comparar
      const [hA, mA] = hourA.split(":").map(Number);
      const [hB, mB] = hourB.split(":").map(Number);

      return hA * 60 + mA - (hB * 60 + mB);
    });
  }
  const sortedPatients = sortByHour(tableData);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            {tableHeads.map((v, i) => (
              <TableCell key={i} align={i !== 1 && i !== 0 ? "right" : "left"}>
                {v}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {tableData.length > 0 &&
            sortedPatients.map((lecture, ind) => {
              const id = lecture.id;
              const lec = lecture.attributes;
              const patient =
                lec.patient as StrapiRelationData<PatientInterface>;
              const hasPatient = patient.data !== null;
              const pat = (patient as StrapiRelationData<PatientInterface>)
                ?.data?.attributes;
              const waschedule = (
                lec.wa_schedule as StrapiRelationData<WAScheduleInterface>
              )?.data?.attributes;
              const patientName = hasPatient ? pat?.name : waschedule?.name;
              const location = waschedule?.location.split(
                "-"
              )[1] as LOCATION_FILIAL;

              return (
                <TableRow
                  key={ind}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell align="left">{lec.hour}</TableCell>
                  <TableCell component="th" scope="row" align="left">
                    {patientName}
                  </TableCell>

                  <TableCell align="right">
                    <FormControlLabel
                      sx={{ mt: 2 }}
                      control={
                        <OrangeSwitch
                          sx={{ m: 1 }}
                          checked={lec.isMissed}
                          onChange={(e) =>
                            handleChange(e, id, "missed", lec.isMissed)
                          }
                        />
                      }
                      label={!lec.isMissed ? "Não" : "Sim"}
                      color="primary.main"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <FormControlLabel
                      sx={{ mt: 2 }}
                      control={
                        <OrangeSwitch
                          sx={{ m: 1 }}
                          checked={lec.examRequest}
                          onChange={(e) =>
                            handleChange(e, id, "exam", lec.examRequest)
                          }
                        />
                      }
                      label={!lec.examRequest ? "Não" : "Sim"}
                      color="primary.main"
                    />
                  </TableCell>

                  {adminData?.userType === "SUPERADMIN" && (
                    <TableCell align="right">
                      <SeverityPill color={patientLocationColor[location]}>
                        {patientLocationName[location]}
                      </SeverityPill>
                    </TableCell>
                  )}
                  <TableCell align="right">
                    {patient.data === null ? (
                      <Tooltip title={"Converter em Paciente"}>
                        <IconButton
                          onClick={() => handlePatientConvert(waschedule)}
                        >
                          <AddReaction color="primary" />
                        </IconButton>
                      </Tooltip>
                    ) : (
                      <Chip color="primary" label={"Já é paciente"} />
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
      {tableData.length === 0 && (
        <Stack
          direction={"column"}
          alignItems={"center"}
          justifyContent={"center"}
          width={"100%"}
          p={2}
        >
          <Typography variant="h6" textAlign={"center"}>
            Nenhum paciente agendado para o dia.
          </Typography>
        </Stack>
      )}
    </TableContainer>
  );
}

const OrangeSwitch = styled(Switch)(({ theme }) => ({
  "& .MuiSwitch-thumb": {
    backgroundColor: "#c5c5c5", // Default
  },
  "& .MuiSwitch-switchBase.Mui-checked .MuiSwitch-thumb": {
    backgroundColor: theme.palette.primary.main, // Checked
  },
  "& .MuiSwitch-switchBase.Mui-disabled .MuiSwitch-thumb": {
    backgroundColor: "#ccc", // Disabled
  },
}));
