import React from "react";
import { formatISO } from "date-fns";
import { Box, Button, Stack, Typography, styled } from "@mui/material";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import useWindowSize from "@/hooks/useWindowSize";
import { useRecoilValue } from "recoil";
import UserData from "@/atoms/userData";

interface ReportsButtonsProps {
  cashierType: number;
  dateSelected: Date;
  onOpenDateSelect: () => void;
}

const ReportsButtons = (props: ReportsButtonsProps) => {
  const { width } = useWindowSize();
  const { cashierType, dateSelected, onOpenDateSelect } = props;
  const adminData = useRecoilValue(UserData);

  let dateIso = formatISO(dateSelected).substring(0, 10);
  let type = cashierType === 0 ? "clinic" : "implant";

  const getMonthReport = () =>
    window.open(`/admin/month-report/${dateIso}?type=${type}`, "_blank");
  const getAnnualReport = () =>
    window.open(`/admin/annual-report?type=${type}&date=${dateIso}`, "_blank");

  return (
    <Container>
      <Typography variant="h5" color="var(--dark-blue)">
        Caixa de {`${cashierType === 0 ? "Clínico" : "Implantes"}`}{" "}
        {dateSelected.toLocaleDateString()}
      </Typography>

      <Box display="flex" columnGap={2} alignItems={"center"}>
        {adminData?.userType === "ADMIN" ||
        adminData?.userType === "SUPERADMIN" ? (
          <>
            <Button variant="contained" color={"info"} onClick={getMonthReport}>
              {width! > 760 ? "Relatório Mensal" : "Mensal"}
            </Button>

            <Button variant="contained" color="info" onClick={getAnnualReport}>
              {width! > 760 ? "Relatório Anual" : "Anual"}
            </Button>
          </>
        ) : null}
        <Button
          variant="outlined"
          onClick={onOpenDateSelect}
          endIcon={<CalendarMonthRoundedIcon />}
        >
          {width! > 760 ? "Alterar Data" : "Data"}
        </Button>
      </Box>
    </Container>
  );
};

const Container = styled(Stack)`
  flex-direction: row;
  padding: 0 1rem;
  align-items: center;
  justify-content: space-between;

  @media screen and (max-width: 760px) {
    align-items: flex-start;
    flex-direction: column;
    row-gap: 1rem;
  }
`;

export default ReportsButtons;
