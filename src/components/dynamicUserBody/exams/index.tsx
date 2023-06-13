/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import UserData from "@/atoms/userData";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useRecoilValue } from "recoil";
import { Box, Typography, Avatar } from "@mui/material";
import { collection, query, where } from "firebase/firestore";
import { useOnSnapshotQuery } from "@/hooks/useOnSnapshotQuery";
import { StyledButton } from "@/components/dynamicAdminBody/receipts";
import { db } from "@/services/firebase";
import Modal from "@/components/modal";

const examsRef = collection(db, "clients_exams");
const imgPrev = { width: "50px", height: "50px", borderRadius: "8px" };
const modalImg = { content: { width: "100%", height: "auto", padding: "8px" } };

const UserExams = () => {
  const userData: any = useRecoilValue(UserData);
  const [imgVisible, setImgVisible] = useState(false);
  const [actualMedia, setActualMedia] = useState<string | null>(null);
  const q = query(examsRef, where("client", "==", userData!.id));
  const snapExams = useOnSnapshotQuery("clients_exams", q);

  const handleSeeImg = (media: string) => {
    setActualMedia(media);
    setImgVisible(true);
  };

  const handleCloseVisible = () => {
    setImgVisible(false);
    setActualMedia(null);
  };
  return (
    <Box>
      <Modal
        visible={imgVisible}
        closeModal={handleCloseVisible}
        style={modalImg}
      >
        <img src={actualMedia ?? ""} alt="" style={{ ...modalImg.content }} />
      </Modal>
      {snapExams.length > 0 &&
        snapExams.map((v, i) => (
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
                <Typography variant="semibold">Prévia</Typography>
                <Typography variant="semibold">ID Exame</Typography>
                <Typography variant="semibold">Ver Imagem</Typography>
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
              <Avatar src={v?.media ?? ""} sx={{ ...imgPrev }} />
              <Typography variant="body2" textAlign={"left"}>
                {v?.id}
              </Typography>
              <StyledButton
                onClick={() => handleSeeImg(v?.media)}
                endIcon={<VisibilityIcon />}
              >
                Ver
              </StyledButton>
            </Box>
          </Box>
        ))}
    </Box>
  );
};

export default UserExams;
