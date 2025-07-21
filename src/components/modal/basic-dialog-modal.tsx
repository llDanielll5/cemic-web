// BasicDialogModal.tsx
import React, { useMemo } from "react";
import {
  Breakpoint,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { motion } from "framer-motion";

interface BasicDialogModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: Breakpoint;
}

const MotionPaper = motion.div;

const BasicDialogModal = ({
  open,
  onClose,
  children,
  maxWidth = "sm",
}: BasicDialogModalProps) => {
  // Memoriza o conteúdo da modal para não causar re-render em cada mudança de props

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth={maxWidth}
      PaperComponent={(props) => (
        <MotionPaper
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.3 }}
          style={{ borderRadius: 16, backgroundColor: "#fff", padding: 24 }}
          {...props}
        />
      )}
      PaperProps={{
        sx: {
          borderRadius: 4,
          p: 3,
          bgcolor: "#fff",
        },
      }}
    >
      {children}
    </Dialog>
  );
};

export default BasicDialogModal;
