import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import { StyledButton } from "../receipts";
import EditNoteIcon from "@mui/icons-material/EditNote";
import Modal from "@/components/modal";

interface PostInterface {
  title: string;
  text: PostText[];
  createdAt?: Date;
  updatedAt?: Date;
  tags?: any[];
}

interface PostText {
  picture: string;
  subtitle: string;
  text: string;
}

const baseData: PostInterface = {
  text: [],
  title: "",
};

const AdminBlog = () => {
  const [newPostVisible, setNewPostVisible] = useState(false);
  const [postValues, setPostValues] = useState<PostInterface>(baseData);

  const handleCloseNewPost = () => {
    setNewPostVisible(false);
  };
  const handleChange = (field: string, value: any) => {
    return setPostValues((prev) => ({ ...prev, [field]: value }));
  };
  return (
    <Box
      width={"100%"}
      display="flex"
      alignItems="center"
      justifyContent={"center"}
      flexDirection={"column"}
    >
      <Modal visible={newPostVisible} closeModal={handleCloseNewPost}>
        <Typography variant="subtitle1">Título da postagem</Typography>
        {/* <Input label="Título" type="text" /> */}
      </Modal>
      <StyledButton
        onClick={() => setNewPostVisible(true)}
        sx={{ margin: "16px auto" }}
        endIcon={<EditNoteIcon />}
      >
        Adicionar Informativo
      </StyledButton>
    </Box>
  );
};

export default AdminBlog;
