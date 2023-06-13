import React, { useState } from "react";
import Link from "next/link";
import { db } from "@/services/firebase";
import { Box, Typography } from "@mui/material";
import { useOnSnapshotQuery } from "@/hooks/useOnSnapshotQuery";
import { collection, query, where } from "firebase/firestore";
import { StyledButton } from "@/components/dynamicAdminBody/receipts";
import styles from "../../../styles/ClientDetails.module.css";

interface ReceiptProps {
  clientId?: string;
}

const Receipt = (props: ReceiptProps) => {
  const ref = collection(db, "receipts");
  const q = query(ref, where("patientId", "==", props?.clientId ?? ""));
  const snapReceipts = useOnSnapshotQuery("receipts", q);

  if (!props.clientId) return null;
  else
    return (
      <Box>
        {snapReceipts.map((v, i) => (
          <Box
            p={1}
            key={i}
            my={1}
            display="flex"
            borderRadius="8px"
            alignItems="center"
            justifyContent="space-between"
            border="1.3px solid #bbb"
          >
            <Typography variant="semibold">
              Valor: <strong>{v?.totalStr}</strong>{" "}
            </Typography>
            <Typography variant="semibold">
              {v?.timestamp?.toDate().toLocaleDateString("pt-br")}
            </Typography>
            <Link passHref target="_blank" href={`/admin/receipt/${v?.id}`}>
              <StyledButton>Detalhes</StyledButton>
            </Link>
          </Box>
        ))}
      </Box>
    );
};

export default Receipt;
