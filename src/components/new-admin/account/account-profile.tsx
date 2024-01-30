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
} from "@mui/material";
import { useRecoilValue } from "recoil";

export const AccountProfile = () => {
  const userData: any = useRecoilValue(UserData);
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
            src={userData.profileImage}
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
        <Button fullWidth variant="text">
          Trocar Foto
        </Button>
      </CardActions>
    </Card>
  );
};
