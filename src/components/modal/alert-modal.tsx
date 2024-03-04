import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import React from "react";

interface AlertModalProps {
  open: boolean;
  onClose: any;
  title: string;
  content?: string | React.ReactNode;
  onAccept?: () => void;
  onRefuse?: () => void;
}

const AlertModal = (props: AlertModalProps) => {
  const { onClose, open, title, content, onAccept, onRefuse } = props;

  console.log(content?.valueOf());

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      {content?.valueOf() === "string" ? (
        <DialogContent>
          <DialogContentText>{content}</DialogContentText>
        </DialogContent>
      ) : (
        content
      )}
      <DialogActions>
        <Button onClick={onAccept}>SIM</Button>
        <Button onClick={onRefuse} autoFocus>
          NÃO
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AlertModal;
