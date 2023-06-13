import React from "react";
import { Box, Typography } from "@mui/material";
import { StyledButton } from "@/components/dynamicAdminBody/receipts";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import styles from "../../../styles/PreRegister.module.css";

interface ScheduleInformationsProps {
  setCalendarVisible: any;
  daysScheduleds: any;
}

const ScheduleInformations = (props: ScheduleInformationsProps) => {
  const { daysScheduleds, setCalendarVisible } = props;

  const parseDate = (v: string) => {
    if (!v) return;
    const [y, m, d] = v?.split("-");
    return `${d}/${m}/${y}`;
  };

  const renderDatesSchedule = () => (
    <div className={styles["important-container"]}>
      <div className={styles["inner-important"]}>
        <h3>IMPORTANTE!</h3>
        <p>Você possui horário(s) agendado(s)!</p>

        {daysScheduleds.map((item: any, index: number) => (
          <Box
            key={index}
            display="flex"
            alignItems="center"
            columnGap={1}
            borderRadius={1}
            border={"1.5px solid #ccc"}
            p={1}
          >
            <Typography variant="semibold" color="orangered">
              {parseDate(item.day)} às {item.hour}
            </Typography>

            {item?.isMissed !== null && item?.isMissed ? (
              <Typography variant="body2">Você faltou</Typography>
            ) : item?.isMissed !== null && !item?.isMissed ? (
              <Typography variant="semibold" color="darkblue">
                Você compareceu!
              </Typography>
            ) : null}
          </Box>
        ))}
      </div>
    </div>
  );

  return (
    <Box display="flex" flexDirection="column">
      {daysScheduleds?.length > 0 && renderDatesSchedule()}
      <Typography variant="semibold" textAlign={"center"}>
        Você pode agendar para pegar informações e conhecer o projeto no botão
        abaixo.
      </Typography>

      <StyledButton
        onClick={() => setCalendarVisible(true)}
        endIcon={<CalendarMonthIcon />}
        sx={{ padding: "8px" }}
      >
        Agendar Informações
      </StyledButton>
    </Box>
  );
};

export default ScheduleInformations;
