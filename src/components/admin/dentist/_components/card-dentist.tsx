import React from "react";
import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardHeader,
  CardMedia,
  Typography,
} from "@mui/material";
import { getInitials } from "@/services/get-initials";

interface CardDentistProps {
  dentistInfos: any;
  onGetDetails: (id: string) => void;
  onGetPayments: (id: string) => void;
}

const CardDentist = (props: CardDentistProps) => {
  const { dentistInfos, onGetDetails, onGetPayments } = props;

  return (
    <Card elevation={15} sx={{ border: "1px solid #d4d4d4", py: 1 }}>
      <CardHeader
        avatar={
          <Avatar sx={{ backgroundColor: "var(--blue)" }}>
            {getInitials(dentistInfos.name)}
          </Avatar>
        }
        title={<Typography variant="h6">{dentistInfos.name}</Typography>}
        subheader={
          <Typography variant="subtitle2">
            {dentistInfos.specialty ?? "Cirurgião-Dentista"}
          </Typography>
        }
        sx={{ pt: 1 }}
      />
      <CardMedia
        component="img"
        sx={{ maxHeight: 300 }}
        image={dentistInfos.profileImage ?? "/images/background-dentist.png"}
        alt={dentistInfos.name}
      />

      <CardActions sx={{ justifyContent: "center" }}>
        <Button
          variant="contained"
          fullWidth
          onClick={() => onGetDetails(dentistInfos.id)}
        >
          Detalhes
        </Button>
        <Button
          variant="contained"
          fullWidth
          onClick={() => onGetPayments(dentistInfos.id)}
        >
          Históricos
        </Button>
      </CardActions>
    </Card>
  );
};

export default CardDentist;
