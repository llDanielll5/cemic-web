import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Box, Card, IconButton, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useRecoilValue } from "recoil";
import UserData from "@/atoms/userData";
import SimpleBar from "simplebar-react";

interface TableProps {
  data: any[];
  onDelete: (e: any) => void;
  messageNothing?: string;
}

export default function ToothHistoryTable(props: TableProps) {
  const { data, onDelete, messageNothing } = props;
  const userData: any = useRecoilValue(UserData);

  return (
    <Card>
      <Box sx={{ minWidth: 500 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tratamento</TableCell>
              <TableCell>Pagou?</TableCell>
              <TableCell>Data de Lançamento</TableCell>
              {userData?.userType === "ADMIN" && <TableCell>Deletar</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.map((val: any, i: number) => {
              let hasPay = val?.hasPayed ? "green" : "red";
              let hasPayText = val?.hasPayed ? "Pagou" : "Não Pagou";

              return (
                <TableRow hover key={i}>
                  <TableCell>
                    <Typography variant="subtitle2">{val?.name}</Typography>
                  </TableCell>
                  <TableCell>{hasPayText}</TableCell>
                  <TableCell>
                    {new Date(val.createdAt).toLocaleDateString()}
                  </TableCell>
                  {userData?.userType === "ADMIN" && (
                    <TableCell>
                      <IconButton onClick={() => onDelete(i)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {data?.length === 0 && (
          <Box
            display="flex"
            width="100%"
            alignItems="center"
            justifyContent="center"
            mt={2}
          >
            <Typography variant="h6" color={"grey"}>
              {messageNothing}
            </Typography>
          </Box>
        )}
      </Box>
    </Card>
  );
}
