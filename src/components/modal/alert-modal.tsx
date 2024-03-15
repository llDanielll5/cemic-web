import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import React, { forwardRef } from "react";

interface AlertModalProps {
  open: boolean;
  onClose: any;
  title: string;
  content?: string | React.ReactNode;
  onAccept?: () => void;
  onRefuse?: () => void;
  ref: React.ForwardedRef<any>;
  hasFullScreen?: boolean;
}

const Modal = forwardRef((props: AlertModalProps, ref: any) => {
  const { onClose, open, title, content, onAccept, onRefuse, hasFullScreen } =
    props;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      ref={ref}
      fullWidth
      fullScreen={hasFullScreen}
    >
      <DialogTitle>{title}</DialogTitle>
      {content?.valueOf() === "string" ? (
        <DialogContent>
          <DialogContentText>{content}</DialogContentText>
        </DialogContent>
      ) : (
        content
      )}
      <DialogActions>
        <Button
          variant="contained"
          fullWidth
          color="success"
          onClick={onAccept}
        >
          SIM
        </Button>
        <Button
          variant="outlined"
          fullWidth
          color="error"
          onClick={onRefuse}
          autoFocus
        >
          NÃO
        </Button>
      </DialogActions>
    </Dialog>
  );
});

Modal.displayName = "ModalForwarded";

const AlertModal = (props: AlertModalProps) => {
  const { onClose, open, title, content, onAccept, onRefuse, hasFullScreen } =
    props;

  return (
    <Modal
      ref={props.ref}
      onClose={onClose}
      open={open}
      title={title}
      content={content}
      onAccept={onAccept}
      onRefuse={onRefuse}
      hasFullScreen={hasFullScreen}
    />
  );
};

export default AlertModal;
