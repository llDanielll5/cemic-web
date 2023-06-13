import React from "react";
import UserData from "@/atoms/userData";
import { Box, Typography } from "@mui/material";
import { useRecoilValue } from "recoil";
import { useOnSnapshotQuery } from "@/hooks/useOnSnapshotQuery";
import { collection, query, where } from "firebase/firestore";
import { db } from "@/services/firebase";
import PreviewIcon from "@mui/icons-material/Preview";
import { maskValue } from "@/services/services";
import Link from "next/link";
import { StyledButton } from "@/components/dynamicAdminBody/receipts";

const receiptRef = collection(db, "receipts");
export const textEllipsis = {
  textOverflow: "ellipsis",
  overflow: "hidden",
  width: "calc(100%/3 - 20px)",
  whiteSpace: "nowrap",
};

const UserPayments = (props: any) => {
  const userData: any = useRecoilValue(UserData);
  const q = query(receiptRef, where("patientId", "==", userData?.id));
  const snapReceipts = useOnSnapshotQuery("receipts", q);
  return (
    <Box py={2}>
      <h3 style={{ textAlign: "center" }}>Meus Recibos</h3>
      {snapReceipts.length > 0 &&
        snapReceipts.map((v, i) => (
          <Box key={i}>
            {i === 0 && (
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                borderBottom={"1.3px solid #bbb"}
                px={3}
                mt={3}
              >
                <Typography variant="semibold">ID Recibo</Typography>
                <Typography variant="semibold">Valor do Recibo</Typography>
                <Typography variant="semibold">Ver Recibo</Typography>
              </Box>
            )}
            <Box
              py={1}
              px={3}
              rowGap={1}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              sx={{ backgroundColor: "white" }}
              width="100%"
            >
              <Typography variant="body2" sx={{ ...textEllipsis }}>
                {v?.id}
              </Typography>
              <Typography variant="body2" textAlign={"left"}>
                {maskValue(v?.totalStr)}
              </Typography>
              <Link passHref href={`patient/receipt/${v?.id}`} target="_blank">
                <StyledButton startIcon={<PreviewIcon />}>Ver</StyledButton>
              </Link>
            </Box>
          </Box>
        ))}
      {snapReceipts.length === 0 && (
        <Typography variant="bold">Não há recibos do paciente</Typography>
      )}
    </Box>
  );
};

export default UserPayments;
