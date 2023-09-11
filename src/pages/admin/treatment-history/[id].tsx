/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useOnSnapshotQuery } from "@/hooks/useOnSnapshotQuery";
import { collection, query, where } from "firebase/firestore";
import { db } from "@/services/firebase";
import { ForwardingHistoryInterface } from "types";
import { parseDateIso } from "@/services/services";

const ClientTreatmentHistory = () => {
  const router = useRouter();
  const id = router.query.id;
  const hasId = id ?? "";
  const ref = collection(db, "forwards_history");
  const q = query(ref, where("client", "==", hasId));
  const [data, setData] = useState<ForwardingHistoryInterface[]>([]);
  const snapTreatment: ForwardingHistoryInterface[] = useOnSnapshotQuery(
    "forwards_history",
    q,
    [hasId]
  );

  useEffect(() => {
    setData(snapTreatment);
  }, [snapTreatment]);

  if (hasId === "") return null;
  if (data?.length === 0)
    return (
      <Typography variant="bold">Não foi encontrado o tratamento</Typography>
    );

  return (
    <Box
      p={2}
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
    >
      <Box
        display="flex"
        width="100%"
        height={"100px"}
        justifyContent="center"
        mb={2}
      >
        <img
          src="/images/cemicLogo.png"
          alt=""
          style={{ width: "300px", height: "100px" }}
        />
      </Box>

      <h2 style={{ marginBottom: "8px" }}>
        Histórico de encaminhamentos do paciente
      </h2>

      {data?.length === 0 ? (
        <Typography variant="semibold" my={1}>
          Não houve encaminhamentos para dentistas
        </Typography>
      ) : (
        data?.map((v, i) => (
          <Box
            p={2}
            key={i}
            width="100%"
            borderRadius={1}
            border="1.3px solid var(--dark-blue)"
          >
            <Box display="flex" alignItems="center" columnGap={1}>
              <Typography variant="semibold">
                Data de encaminhamento:
              </Typography>
              <Typography variant="body1">
                {parseDateIso(
                  v?.timestamp?.toDate().toISOString().substring(0, 10)
                )}
              </Typography>
            </Box>

            <Box display="flex" alignItems="center" columnGap={1}>
              <Typography variant="semibold">Dentista:</Typography>
              <Typography variant="body1">{v?.professional_name}</Typography>
            </Box>

            <Typography variant="semibold">
              Tratamentos para realizar:
            </Typography>

            <Box>
              {v?.treatments?.map((value, index) => (
                <Typography
                  key={index}
                  variant="body2"
                  sx={{ marginLeft: "8px" }}
                >
                  Região: {value?.region} - {value?.treatments?.name}
                </Typography>
              ))}
            </Box>
          </Box>
        ))
      )}
    </Box>
  );
};

export default ClientTreatmentHistory;
