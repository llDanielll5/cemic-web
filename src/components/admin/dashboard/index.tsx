/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { StyledButton } from "@/components/dynamicAdminBody/receipts";
import { Box, Typography } from "@mui/material";
import { db } from "@/services/firebase";
import { useRecoilValue } from "recoil";
import Link from "next/link";
import UserData from "@/atoms/userData";
import Loading from "@/components/loading";
import useWindowSize from "@/hooks/useWindowSize";
import styles from "../../../styles/Dashboard.module.css";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

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
  const userData: any = useRecoilValue(UserData);

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
    if (userData!.role === "admin") getLecturesOfYear();
  }, [getLecturesOfYear, userData]);

  useEffect(() => {
    setTimePassed(new Date().getMinutes());
  }, []);

  if (isLoadingLectures)
    return (
      <Box position="fixed" top={0} left={0}>
        <Loading message="Carregando Palestras agendadas..." />
      </Box>
    );

  if (userData.role !== "admin")
    return (
      <Box
        display="flex"
        alignItems="center"
        mt={3}
        px={4}
        flexDirection="column"
      >
        <h3 style={{ textAlign: "center" }}>
          Bem vindo ao Layout para Funcionários. <br /> <br /> Fique a vontade
          para realizar seus trabalhos necessários e em caso de problemas, favor
          contatar a central de TI com o print do problema e um breve relato de
          como aconteceu.
        </h3>

        <Typography variant="subtitle1" m={2}>
          Telefone TI: (61) 99171-1401
        </Typography>

        <Link
          passHref
          target="_blank"
          href={
            "https://api.whatsapp.com/send?phone=5561991711401&text=Gostaria de conversar com o responsável do sistema da CEMIC para uma dúvida!"
          }
        >
          <StyledButton
            sx={{ backgroundColor: "#34af23" }}
            endIcon={<WhatsAppIcon />}
          >
            Whatsapp TI
          </StyledButton>
        </Link>
      </Box>
    );

  return (
    <div className={styles["dashboard-main"]}>
      <h3>Bem vindo Administrador</h3>
      {passedTime && (
        <Typography variant="subtitle1">
          As informações podem não estar atualizadas
        </Typography>
      )}
    </div>
  );
};

export default DashboardAdmin;
