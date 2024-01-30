import React from "react";
import CModal from ".";
import { Box, Typography } from "@mui/material";
import Calendar from "react-calendar";

interface CalendarModalProps {
  visible: any;
  closeModal: any;
  dateSelected: any;
  handleChangeDate: any;
}

const CalendarModal = (props: CalendarModalProps) => {
  const { closeModal, dateSelected, handleChangeDate, visible } = props;
  return (
    <CModal visible={visible} closeModal={closeModal}>
      <Box display="flex" alignItems="center" flexDirection="column">
        <Typography variant="subtitle1" mb={1} textAlign="center">
          Selecione a data desejada:
        </Typography>
        <Calendar onChange={handleChangeDate} value={dateSelected} />
      </Box>
    </CModal>
  );
};

export default CalendarModal;
