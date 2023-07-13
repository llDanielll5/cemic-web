import * as React from "react";
import * as S from "./styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { IconButton, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useRecoilValue } from "recoil";
import UserData from "@/atoms/userData";

interface TableProps {
  titles: string[];
  data: TableDataProps[];
  onEdit: (e: any) => void;
  onDelete: (e: any) => void;
  messageNothing?: string;
}

export interface TableDataProps {
  cod: string;
  name: string;
  price: string;
}

export default function CustomTable(props: TableProps) {
  const { titles, data, onDelete, onEdit, messageNothing } = props;
  const userData: any = useRecoilValue(UserData);
  const rows: TableDataProps[] = [];
  return (
    <S.StyledTableContainer>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            {titles.map((item, index) => {
              return (
                <S.StyledTable key={index} sx={{ width: "10%" }}>
                  {item}
                </S.StyledTable>
              );
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.map((row, index) => (
            <TableRow key={index}>
              <TableCell component="th" scope="row" align={"left"}>
                {row.cod}
              </TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.price}</TableCell>
              {userData?.role === "admin" && (
                <>
                  <TableCell>
                    <IconButton onClick={() => onEdit(row.cod)}>
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => onDelete(row.cod)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {data?.length === 0 && (
        <S.NotHaveFiscalContainer>
          <Typography variant="semibold">{messageNothing}</Typography>
        </S.NotHaveFiscalContainer>
      )}
    </S.StyledTableContainer>
  );
}
