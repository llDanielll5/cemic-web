import React, { useState, useEffect, useCallback } from "react";
import styles from "../../../styles/Dashboard.module.css";
import VerticalChart from "@/components/verticalChart";
import useWindowSize from "@/hooks/useWindowSize";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/services/firebase";
import { Box, Typography } from "@mui/material";
import Loading from "@/components/loading";

interface DashboardProps {}

const labels = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

const labelResum = [
  "JAN",
  "FEV",
  "MAR",
  "ABR",
  "MAI",
  "JUN",
  "JUL",
  "AGO",
  "SET",
  "OUT",
  "NOV",
  "DEZ",
];

const DashboardAdmin = (props: DashboardProps) => {
  const { width } = useWindowSize();
  const [isLoadingLectures, setIsLoadingLectures] = useState(false);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [dataLectures, setDataLectures] = useState<any[]>([]);
  const [timePassed, setTimePassed] = useState<number | null>(null);
  const [passedTime, setPassedTime] = useState(false);

  const getMonthData = async (ref: string, startQ: any, endQ: any) => {
    setIsLoadingLectures(true);
    const collRef = collection(db, ref);
    const q = query(
      collRef,
      where("day", ">=", startQ),
      where("day", "<=", endQ)
    );
    const querySnapshot = await getDocs(q);
    setIsLoadingLectures(false);
    return querySnapshot.size;
  };

  const getLastDayMonth = (month: number) => {
    return new Date(currentYear, month, 0).getDate();
  };

  const getLecturesOfYear = useCallback(async () => {
    const arr: any[] = [];
    const getLectureData = async (m: string) => {
      return await getMonthData(
        "lectures",
        `${currentYear}-${m}-01`,
        `${currentYear}-${m}-${getLastDayMonth(0)}`
      );
    };
    const getJan = await getLectureData("01");
    const getFev = await getLectureData("02");
    const getMar = await getLectureData("03");
    const getApr = await getLectureData("04");
    const getMay = await getLectureData("05");
    const getJun = await getLectureData("06");
    const getJul = await getLectureData("07");
    const getAug = await getLectureData("08");
    const getSep = await getLectureData("09");
    const getOct = await getLectureData("10");
    const getNov = await getLectureData("11");
    const getDec = await getLectureData("12");
    arr.push(
      getJan,
      getFev,
      getMar,
      getApr,
      getMay,
      getJun,
      getJul,
      getAug,
      getSep,
      getOct,
      getNov,
      getDec
    );
    return setDataLectures(arr);
  }, [currentYear]);

  const datasets = [
    {
      label: "Palestra",
      data: dataLectures,
      backgroundColor: "#09aae8bb",
    },
    // {
    //   label: "Triagem",
    //   data: dataNumbers,
    //   backgroundColor: "#e91d23bb",
    // },
  ];

  useEffect(() => {
    getLecturesOfYear();
  }, [getLecturesOfYear]);

  useEffect(() => {
    setTimePassed(new Date().getMinutes());
  }, []);

  if (isLoadingLectures)
    return (
      <Box position="fixed" top={0} left={0}>
        <Loading message="Carregando Palestras agendadas..." />
      </Box>
    );

  // if(finishScreenings === false) return null

  return (
    <div className={styles["dashboard-main"]}>
      <h3>Bem vindo Administrador</h3>
      {passedTime && (
        <Typography variant="bold">
          As informações podem não estar atualizadas
        </Typography>
      )}

      {VerticalChart({
        data: { labels: width! > 1024 ? labels : labelResum, datasets },
      })}
    </div>
  );
};

export default DashboardAdmin;
