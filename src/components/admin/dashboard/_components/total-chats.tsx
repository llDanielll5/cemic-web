import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import type { SxProps } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import ChatIcon from "@mui/icons-material/Chat";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

export interface TotalChatsProps {
  diff?: number;
  trend: "up" | "down";
  sx?: SxProps;
  value: string;
}

export function TotalChats({ diff, trend, sx, value }: TotalChatsProps) {
  const trendColor = trend === "up" ? "success" : "error";
  const TrendIcon =
    trend === "up" ? (
      <ArrowUpwardIcon color={trendColor} />
    ) : (
      <ArrowDownwardIcon color={trendColor} />
    );

  return (
    <Card sx={sx}>
      <CardContent>
        <Stack spacing={3}>
          <Stack
            direction="row"
            sx={{ alignItems: "flex-start", justifyContent: "space-between" }}
            spacing={3}
          >
            <Stack spacing={1}>
              <Typography color="text.secondary" variant="overline">
                Total Conversas
              </Typography>
              <Typography variant="h4">{value}</Typography>
            </Stack>
            <Avatar
              sx={{
                backgroundColor: ({ palette }) => palette.primary.main,
                height: "56px",
                width: "56px",
              }}
            >
              <ChatIcon fontSize="large" />
            </Avatar>
          </Stack>
          {diff ? (
            <Stack sx={{ alignItems: "center" }} direction="row" spacing={2}>
              <Stack
                sx={{ alignItems: "center" }}
                direction="row"
                spacing={0.5}
              >
                {TrendIcon}
                <Typography color={trendColor} variant="body2">
                  {diff}%
                </Typography>
              </Stack>
              <Typography color="text.secondary" variant="caption">
                desde o último mês.
              </Typography>
            </Stack>
          ) : null}
        </Stack>
      </CardContent>
    </Card>
  );
}
