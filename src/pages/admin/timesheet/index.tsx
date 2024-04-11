/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { parseDateBr } from "@/services/services";
import { DashboardLayout } from "@/layouts/dashboard/layout";
import { Box, Card, Stack, Tooltip, Typography, styled } from "@mui/material";
import EmployeeTimesheetRender from "@/components/admin/timesheet/employee-timesheet-render";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import UserData from "@/atoms/userData";
import { getTimesheetOfDay } from "@/axios/admin/timesheets";
import { formatISO } from "date-fns";

const TimesheetPage = () => {
  const [dateSelected, setDateSelected] = useState(new Date());
  const [hours, setHours] = useState("");
  const userData = useRecoilValue(UserData);
  const [timesheetData, setTimesheetData] = useState<any | null>(null);

  const timeCount = () => {
    var today = new Date();
    var hour: any = today.getHours();
    var minute: any = today.getMinutes();
    if (minute < 10) minute = "0" + minute;
    var second: any = today.getSeconds();
    if (second < 10) second = "0" + second;
    setHours(`${hour}:${minute}:${second}`);
  };

  const handleGetTimesheetOfDayDetails = async () => {
    return await getTimesheetOfDay(
      formatISO(dateSelected).substring(0, 10)
    ).then(
      ({ data }) => {
        const result = data?.data;
        setTimesheetData(result);
      },
      (err) => console.log(err.response)
    );
  };

  useEffect(() => {
    setInterval(timeCount, 1000);
  }, []);
  useEffect(() => {
    handleGetTimesheetOfDayDetails();
  }, []);

  return (
    <Container>
      <Stack
        direction="row"
        justifyContent="space-between"
        width={"100%"}
        px={2}
      >
        <Typography variant="h5">Folha de Ponto</Typography>
      </Stack>

      <TitleCard elevation={5}>
        <Typography variant="h4" fontSize="18px">
          {parseDateBr(dateSelected.toLocaleDateString())}
        </Typography>

        <Stack
          py={1}
          px={2}
          borderRadius={2}
          direction="row"
          alignItems="center"
          columnGap={1}
        >
          <Tooltip title="Hora Atual">
            <AccessTimeIcon fontSize="small" />
          </Tooltip>

          <Typography variant="subtitle1">Hora Atual: </Typography>
          <Typography variant="body1">{hours}</Typography>
        </Stack>
      </TitleCard>

      {userData?.userType === "EMPLOYEE" && (
        <EmployeeTimesheetRender data={timesheetData} />
      )}
    </Container>
  );
};

const Container = styled(Box)`
  margin: 4rem 0;
`;

const TitleCard = styled(Card)`
  align-items: center;
  justify-content: center;
  flex-direction: column;
  display: flex;
  margin: 1rem;
  padding: 1rem;
`;

TimesheetPage.getLayout = (page: any) => (
  <DashboardLayout>{page}</DashboardLayout>
);

export default TimesheetPage;
