import React from "react";
import Calendar from "react-calendar";
import styles from "../../../styles/PreRegister.module.css";
import { Box, Typography, styled, Button } from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { StyledButton } from "@/components/dynamicAdminBody/receipts";

interface ScheduleModalProps {
  setDateSelected: (e: Date) => void;
  dateSelected: Date;
  hoursSelected: any[];
  handleSelectHour: any;
  handleOpenScheduleModal: () => void;
}

const borderBlue = { border: "2px solid var(--dark-blue)" };

const ScheduleModalPreRegister = (props: ScheduleModalProps) => {
  const {
    dateSelected,
    handleOpenScheduleModal,
    handleSelectHour,
    hoursSelected,
    setDateSelected,
  } = props;

  return (
    <Box display="flex" flexDirection="column">
      <Typography variant="bold" textAlign="center">
        SELECIONE UM DIA DA SEMANA ENTRE SEGUNDA E SEXTA
      </Typography>
      <br />
      <div className={styles["calendar-container"]}>
        <Calendar onChange={setDateSelected} value={dateSelected} />
      </div>

      <Box display="flex" alignItems="center" flexDirection="column">
        <Typography variant="semibold" my={1}>
          Qual desses horários deseja agendar?
        </Typography>
        <div className={styles["inner-hours"]}>
          {hoursSelected.map((item: any, index: number) => (
            <Button
              key={index}
              variant="contained"
              color={item.selected ? "warning" : "info"}
              style={item.selected ? borderBlue : undefined}
              onClick={() => handleSelectHour({ item, index })}
              sx={{ margin: "0 8px" }}
            >
              {item.hour}
            </Button>
          ))}
        </div>
      </Box>

      <StyledButton
        sx={{ margin: "16px auto 0 auto", alignSelf: "center" }}
        onClick={handleOpenScheduleModal}
        endIcon={<CalendarMonthIcon />}
      >
        Agendar
      </StyledButton>
    </Box>
  );
};

export default ScheduleModalPreRegister;
