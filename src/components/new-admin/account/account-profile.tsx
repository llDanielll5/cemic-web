import ProfileImage from "@/atoms/profileImage";
import UserData from "@/atoms/userData";

import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Typography,
  styled,
} from "@mui/material";
import { profile } from "console";
import { useRecoilState, useRecoilValue } from "recoil";

export const AccountProfile = () => {
  const userData: any = useRecoilValue(UserData);
  const [profileImage, setProfileImage] = useRecoilState(ProfileImage);

  const handleChangeFile = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!event.target.files || event.target.files.length === 0) {
      return; // User canceled file selection
    }

    const file = event.target.files[0];
    const data = new FormData();
    const url = URL.createObjectURL(file);
    data.append("files", file);

    setProfileImage({
      url,
      data,
      file,
    });
  };

  return (
    <Card>
      <CardContent>
        <Box
          sx={{
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Avatar
            src={
              profileImage?.url ??
              `http://localhost:17000${userData?.profileImage}`
            }
            sx={{ height: 80, mb: 2, width: 80 }}
          />
          <Typography gutterBottom variant="h6">
            {userData.name}
          </Typography>
          <Typography color="text.secondary" variant="body2">
            {userData.email}
          </Typography>
        </Box>
      </CardContent>
      <Divider />
      <CardActions>
        <Button fullWidth variant="text" component="label">
          Trocar Foto
          <VisuallyHiddenInput type="file" onChange={handleChangeFile} />
        </Button>
      </CardActions>
    </Card>
  );
};

const VisuallyHiddenInput = styled("input")`
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1;
  overflow: hidden;
  position: absolute;
  bottom: 0;
  left: 0;
  white-space: nowrap;
  width: 1;
`;
