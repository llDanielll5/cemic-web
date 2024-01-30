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
          {data?.map((row: any, index) => {
            let attr = row?.attributes;
            let id = row?.id;

            return (
              <TableRow key={index}>
                <TableCell component="th" scope="row" align={"left"}>
                  {id}
                </TableCell>
                <TableCell>{attr.name}</TableCell>
                <TableCell>
                  {attr?.price.toLocaleString("pt-br", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </TableCell>
                {userData?.userType === "ADMIN" && (
                  <>
                    <TableCell>
                      <IconButton onClick={() => onEdit(id)}>
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => onDelete(id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      {data?.length === 0 && (
        <S.NotHaveFiscalContainer>
          <Typography variant="subtitle1">{messageNothing}</Typography>
        </S.NotHaveFiscalContainer>
      )}
    </S.StyledTableContainer>
  );
}
