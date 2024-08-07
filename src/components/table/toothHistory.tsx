//@ts-nocheck
import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import DeleteIcon from "@mui/icons-material/Delete";
import TableRow from "@mui/material/TableRow";
import AddIcon from "@mui/icons-material/Add";
import UserData from "@/atoms/userData";
import { useRecoilValue } from "recoil";
import { Box, Button, Card, IconButton, Typography } from "@mui/material";

interface TableProps {
  data: any[];
  onDelete: (e: any) => void;
  onGetDetails?: (id: string) => void;
  messageNothing?: string;
}

export default function ToothHistoryTable(props: TableProps) {
  const { data, onDelete, messageNothing, onGetDetails } = props;
  const adminData = useRecoilValue(UserData);

  return (
    <Card>
      <Box sx={{ minWidth: 500 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tratamento</TableCell>
              <TableCell>Pagou?</TableCell>
              <TableCell>Concluido?</TableCell>
              {adminData?.userType === "ADMIN" ||
              adminData?.userType === "SUPERADMIN" ? (
                <TableCell>Deletar</TableCell>
              ) : null}
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.map((v: any, i: number) => {
              const val = v?.attributes;
              let hasPay = val?.hasPayed ? "green" : "red";
              let hasPayText =
                val?.payment?.data !== null ? "Pagou" : "Não Pagou";

              return (
                <TableRow hover key={i} onClick={() => onGetDetails(v?.id!)}>
                  <TableCell>
                    <Typography variant="subtitle2">{val?.name}</Typography>
                  </TableCell>
                  <TableCell>{hasPayText}</TableCell>
                  <TableCell>{val.hasFinished ? "Sim" : "Não"}</TableCell>
                  {adminData?.userType === "ADMIN" ||
                  adminData?.userType === "SUPERADMIN" ? (
                    <TableCell>
                      <IconButton onClick={() => onDelete(v?.id!)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  ) : null}
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
