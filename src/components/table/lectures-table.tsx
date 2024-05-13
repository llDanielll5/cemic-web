import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

interface LecturesTableInterface {
  tableHeads: string[];
  tableData: any[];
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
          {tableData.map((row) => (
            <TableRow
              key={row.name}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell align="left">{row.hour}</TableCell>
              <TableCell component="th" scope="row" align="left">
                {row.name}
              </TableCell>

              <TableCell align="right">{row.presence}</TableCell>
              <TableCell align="right">{row.register}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
