/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Box, Typography } from "@mui/material";
import { collection, query, where } from "firebase/firestore";
import { useOnSnapshotQuery } from "@/hooks/useOnSnapshotQuery";

interface ProblemsInterface {
  client: string;
  content: string;
  date: string;
  id: string;
  media: string[];
  title: string;
}

const ProblemsSinglePage = (props: any) => {
  // const router = useRouter();
  // const id = router.query.id;
  // const hasId = id ?? "";
  // const ref = collection(db, "clients_problems");
  // const q = query(ref, where("id", "==", hasId));
  // const snapTreatment: ProblemsInterface[] = useOnSnapshotQuery(
  //   "clients_problems",
  //   q,
  //   [hasId]
  // );
  // if (hasId === "") return null;
  // if (snapTreatment?.length === 0)
  //   return (
  //     <Typography variant="subtitle1">Não foi encontrado o problema</Typography>
  //   );
  // return (
  //   <Box
  //     p={2}
  //     display="flex"
  //     alignItems="center"
  //     justifyContent="center"
  //     flexDirection="column"
  //   >
  //     <Box
  //       display="flex"
  //       width="100%"
  //       height={"100px"}
  //       justifyContent="center"
  //       mb={5}
  //     >
  //       <img
  //         alt=""
  //         src="/images/cemicLogo.png"
  //         style={{ width: "300px", height: "100px" }}
  //       />
  //     </Box>
  //     <Typography variant="subtitle1">{snapTreatment?.[0]?.title}</Typography>
  //     <Box>
  //       <Typography variant="body2">{snapTreatment?.[0]?.content}</Typography>
  //     </Box>
  //   </Box>
  // );
};

export default ProblemsSinglePage;
