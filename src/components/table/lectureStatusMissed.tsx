import { Theme, useTheme } from "@emotion/react";
import { Chip, Typography } from "@mui/material";

type STATUS_MISSED = "MISSED" | "PRESENT";

interface StatusTagProps {
  status: STATUS_MISSED;
}

interface StatusValues {
  label: string;
  color: string;
  bgColor: string;
}

export function LectureStatusMissed({ status }: { status: STATUS_MISSED }) {
  const theme: Theme = useTheme();

  const config: Record<STATUS_MISSED, StatusValues> = {
    MISSED: {
      label: "Projeto Cancelado",
      color: (theme as any).palette.primary.main as string,
      bgColor: "",
    },
    PRESENT: {
      label: "Projeto Cancelado",
      color: "" as string,
      bgColor: "",
    },
  };

  const selected = config[status];

  if (!selected) {
    console.warn("Status inválido passado para <StatusTag />:", status);
    return <Chip label={`Status desconhecido: ${status}`} color="default" />;
  }

  const { label, color, bgColor } = selected;

  // return <Chip label={label} color={color} size="small" sx={{ mb: 1 }} />;

  return (
    <Typography
      variant="body1"
      sx={{
        borderRadius: 2,
        border: `2px solid ${color}`,
        color: "white",
        backgroundColor: `${bgColor}`,
        px: 1,
        py: 0.5,
      }}
    >
      {label}
    </Typography>
  );
}
