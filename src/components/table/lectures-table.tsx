import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { LectureStatusMissed } from "./lectureStatusMissed";

interface LecturesTableInterface {
  tableHeads: string[];
  tableData: StrapiData<LecturesInterface>[];
}

export default function LecturesTable({
  tableData,
  tableHeads,
}: LecturesTableInterface) {
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
            tableData.map((lecture, ind) => {
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
                    {LectureStatusMissed({
                      status: lec.isMissed ? "MISSED" : "PRESENT",
                    })}
                  </TableCell>
                  <TableCell align="right">{lec.examRequest}</TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
