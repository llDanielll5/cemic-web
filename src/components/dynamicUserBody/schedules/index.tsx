//@ts-nocheck
import React from "react";
import { Box, Typography } from "@mui/material";
import { useRecoilValue } from "recoil";
import UserData from "@/atoms/userData";
import { collection, query, where } from "firebase/firestore";
import { db } from "@/services/firebase";
import { useOnSnapshotQuery } from "@/hooks/useOnSnapshotQuery";
import { parseDateIso } from "@/services/services";

const ref = collection(db, "schedules");

const PatientSchedules = (props: any) => {
  const userData = useRecoilValue(UserData);
  const q = query(ref, where("client", "==", userData?.id ?? ""));
  const snapTreatments = useOnSnapshotQuery("schedules", q, [userData?.id]);
  return (
    <Box>
      {snapTreatments.length > 0 &&
        snapTreatments.map((doc, i) => (
          <Typography key={i}>{parseDateIso(doc?.date)}</Typography>
        ))}
    </Box>
  );
};

export default PatientSchedules;
