import { useCallback } from "react";
import { useRouter } from "next/navigation";
import PropTypes from "prop-types";
import {
  Box,
  Divider,
  MenuItem,
  MenuList,
  Popover,
  Typography,
} from "@mui/material";
import { useRecoilValue } from "recoil";
import UserData from "@/atoms/userData";

export const AccountPopover = (props: any) => {
  const { anchorEl, onClose, open } = props;
  const router = useRouter();
  const userData: any = useRecoilValue(UserData);

  const handleSignOut = useCallback(() => {
    onClose?.();
    props.logout?.();
  }, [onClose, router]);

  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{
        horizontal: "left",
        vertical: "bottom",
      }}
      onClose={onClose}
      open={open}
      PaperProps={{ sx: { width: 200 } }}
    >
      <Box sx={{ py: 1.5, px: 2 }}>
        <Typography variant="overline">Conta</Typography>
        <Typography color="text.secondary" variant="body2">
          {userData?.name}
        </Typography>
      </Box>
      <Divider />
      <MenuList
        disablePadding
        dense
        sx={{ p: "8px", "& > *": { borderRadius: 1 } }}
      >
        <MenuItem onClick={handleSignOut} title={"Sair"}>
          Deslogar
        </MenuItem>
      </MenuList>
    </Popover>
  );
};

AccountPopover.propTypes = {
  anchorEl: PropTypes.any,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired,
  logout: PropTypes.any,
};
