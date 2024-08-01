/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useState } from "react";
import { DashboardLayout } from "@/layouts/dashboard/layout";
import { CashierInterface, CreateCashierInterface } from "types/cashier";
import {
  Autocomplete,
  Box,
  Button,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { CashTable } from "@/components/new-admin/cash/cashTable";
import { useRecoilValue } from "recoil";
import { getCookie, setCookie } from "cookies-next";
import { useFormik } from "formik";
import { endOfMonth, formatISO, startOfMonth } from "date-fns";
import { useRouter } from "next/navigation";
import Calendar from "react-calendar";
import UserData from "@/atoms/userData";
import CModal from "@/components/modal";

import * as Yup from "yup";
import AddCashModal from "../../../components/new-admin/cash/modals/add";
import ConfirmCashModal from "../../../components/new-admin/cash/modals/confirm";
import OpenCashierModal from "../../../components/new-admin/cash/modals/open";
import CashierBody from "@/components/admin/cashier/_components/cashier-body";
import ReportsButtons from "@/components/admin/cashier/_components/reports";
import CashierButtons from "@/components/admin/cashier/_components/cashier-buttons";
import "react-calendar/dist/Calendar.css";
import {
  handleCloseCashierOfDay,
  handleGetCashierOpenedWithType,
  handleGetHasOpenedCashier,
  handleGetMonthCashiersOfType,
  handleOpenCashierDb,
} from "@/axios/admin/cashiers";

const CashierAdmin = () => {
  const router = useRouter();
  const cookieDate: any = getCookie("oldDate");
  const cookieCashier: any = getCookie("cashierType");
  const adminData = useRecoilValue(UserData);
  let hasCookieDate = !cookieDate ? new Date() : new Date(cookieDate);
  let hasCookieCashier = !cookieCashier ? null : parseInt(cookieCashier);

  const [filialSelection, setFilialSelection] = useState("");
  const [addVisible, setAddVisible] = useState(false);
  const [openCashier, setOpenCashier] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [cashierData, setCashierData] = useState<CashierInterface | null>(null);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [dateSelected, setDateSelected] = useState<Date>(hasCookieDate);
  const [cashierType, setCashierType] = useState<number | null>(
    hasCookieCashier
  );
  const [monthValues, setMonthValues] = useState({
    totalDebit: 0,
    totalCredit: 0,
    totalCash: 0,
    totalPix: 0,
    totalOut: 0,
    totalBankCheck: 0,
    totalTransfer: 0,
  });

  let dateIso = formatISO(dateSelected).substring(0, 10);
  let type: "clinic" | "implant" = cashierType === 0 ? "clinic" : "implant";

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      date: "",
      timestamp: null,
      cashIn: 0,
      pix: 0,
      out: 0,
      cardIn: 0,
      creditIn: 0,
      isChecked: false,
      idCashier: "",
      submit: null,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Nome obrigatório"),
      description: Yup.string().required("Descrição obrigatória!"),
    }),
    onSubmit: async (values, helpers) => {
      try {
        await handleSubmit(values);
      } catch (err: any) {
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }
    },
  });

  const handleSubmit = async (values: {
    cashIn: number;
    out: number;
    cardIn: number;
    creditIn: number;
    description: string;
    name: string;
    pix: number;
  }) => {
    const { cashIn, out, cardIn, description, name, pix, creditIn } = values;
    console.log("submit");
    // if (
    //   cashIn === 0 &&
    //   cardIn === 0 &&
    //   out === 0 &&
    //   pix === 0 &&
    //   creditIn === 0
    // )
    //   return alert("Adicione as informações de valores");

    // if (cashierData === null) return alert("Caixa não aberto!");

    // setCookie("oldDate", dateSelected);

    // setLoading((prev) => ({
    //   isLoading: true,
    //   loadingMessage: "Estamos salvando os dados adicionados...",
    // }));

    // let nameCapital = nameCapitalized(name);
    // let data: any = {
    //   name: nameCapital,
    //   description,
    //   date: formatISO(dateSelected).substring(0, 10),
    //   timestamp: Timestamp.now(),
    //   cashIn,
    //   out,
    //   cardIn,
    //   creditIn,
    //   pix,
    //   isChecked: false,
    //   idCashier: cashierData?.id,
    // };

    // return await addDoc(refInformations, data).then(
    //   async (querySnap) => {
    //     setLoading((prev) => ({
    //       ...prev,
    //       loadingMessage: "Estamos criando o documento no Banco de Dados",
    //     }));

    //     let document = doc(db, "cashiers", cashierData?.id!);

    //     setLoading((prev) => ({
    //       ...prev,
    //       loadingMessage: "Estamos somando o valor no caixa",
    //     }));
    //     await updateDoc(document, {
    //       totalCash: cashierData?.totalCash + cashIn,
    //       totalPix: cashierData?.totalPix + pix,
    //       totalCard: cashierData?.totalCard + cardIn,
    //       totalOut: cashierData?.totalOut + out,
    //       totalCredit: cashierData?.totalCredit + creditIn,
    //     }).then(
    //       () => {
    //         setLoading((prev) => ({ isLoading: false, loadingMessage: "" }));
    //         setAddVisible(false);
    //         formik.resetForm();
    //         getData();
    //       },
    //       () => {
    //         setLoading((prev) => ({ isLoading: false, loadingMessage: "" }));
    //         alert("Erro ao somar o valor no caixa");
    //       }
    //     );
    //   },
    //   (err) => {
    //     setLoading((prev) => ({ isLoading: false, loadingMessage: "" }));
    //     return alert("Erro ao adicionar informação ao caixa");
    //   }
    // );
  };

  const getCashier = async () => {
    return await handleGetCashierOpenedWithType(
      dateIso,
      type,
      adminData?.userType === "SUPERADMIN"
        ? filialSelection
        : adminData?.filial!
    ).then(
      (res) => {
        if (res.data.data.length > 0) setCashierData(res.data.data[0]);
        else setCashierData(null);
      },
      (err) => console.log(err.response)
    );
  };

  const handleOpenAddInformations = () => {
    if (cashierData === null)
      return alert("Não há caixa aberto para lançamento!");
    else setAddVisible(true);
  };

  const handleOpenCashier = async () => {
    if (cashierData !== null) return alert("Caixa já aberto!");
    const startDate = formatISO(startOfMonth(dateSelected)).substring(0, 10);
    const endDate = formatISO(endOfMonth(dateSelected)).substring(0, 10);
    const response = await handleGetHasOpenedCashier(startDate, endDate, type);
    const { data: openeds } = response.data;
    // if (openeds.length > 0)
    //   return alert("Há caixas abertos que não foram fechados!");
    // else return setOpenCashier(true);
    setOpenCashier(true); //temporário
  };

  const handleCloseCashier = async () => {
    const data = { hasClosed: true };
    return await handleCloseCashierOfDay(cashierData?.id!, data).then(
      (res) => {
        getCashier();
        alert("Caixa fechado com sucesso!");
      },
      (err) => console.log(err.response)
    );
  };

  const handleConfirmOpenCashier = async () => {
    const date = formatISO(dateSelected).substring(0, 10);
    const adminInfos = { created: adminData?.id!, createTimestamp: new Date() };
    setCookie("oldDate", dateSelected);

    const values = {
      out: 0,
      pix: 0,
      cash: 0,
      debit: 0,
      credit: 0,
      transfer: 0,
      bank_check: 0,
    };
    let cashierData: CreateCashierInterface = {
      data: {
        date,
        type,
        adminInfos,
        cashierInfos: [],
        hasClosed: false,
        total_values: values,
        filial: adminData?.filial,
        location: adminData?.location,
      },
    };

    const success = (res: any) => {
      setCashierData(res.data.data);
      handleCloseOpenCashier();
    };

    return await handleOpenCashierDb(cashierData).then(
      (res) => success(res),
      (err) => console.log(err.response)
    );
  };

  const handleGetMonthValue = useCallback(async () => {
    const startDate = formatISO(startOfMonth(dateSelected)).substring(0, 10);
    const endDate = formatISO(endOfMonth(dateSelected)).substring(0, 10);

    const { data: result } = await handleGetMonthCashiersOfType(
      startDate,
      endDate,
      adminData?.userType === "SUPERADMIN"
        ? filialSelection
        : adminData?.filial!,
      type
    );
    const { data: monthCashArr } = result;

    if (monthCashArr.length === 0) return;

    let monthCash: any[] = monthCashArr.map(
      (v: any) => v.attributes.total_values.cash
    );
    let monthDebit: any[] = monthCashArr.map(
      (v: any) => v.attributes.total_values.debit
    );
    let monthCredit: any[] = monthCashArr.map(
      (v: any) => v.attributes.total_values.credit
    );
    let monthPix: any[] = monthCashArr.map(
      (v: any) => v.attributes.total_values.pix
    );
    let monthBankCheck: any[] = monthCashArr.map(
      (v: any) => v.attributes.total_values.bank_check
    );
    let monthTransfer: any[] = monthCashArr.map(
      (v: any) => v.attributes.total_values.transfer
    );
    let monthOut: any[] = monthCashArr.map(
      (v: any) => v.attributes.total_values.out
    );

    let totalCash = 0;
    let totalDebit = 0;
    let totalCredit = 0;
    let totalPix = 0;
    let totalOut = 0;
    let totalBankCheck = 0;
    let totalTransfer = 0;

    totalCash = monthCash.reduce((prev, curr) => {
      return prev + curr;
    }, 0);
    totalDebit = monthDebit.reduce((prev, curr) => {
      return prev + curr;
    }, 0);
    totalCredit = monthCredit.reduce((prev, curr) => {
      return prev + curr;
    }, 0);
    totalPix = monthPix.reduce((prev, curr) => {
      return prev + curr;
    }, 0);
    totalOut = monthOut.reduce((prev, curr) => {
      return prev + curr;
    }, 0);
    totalBankCheck = monthBankCheck.reduce((prev, curr) => {
      return prev + curr;
    }, 0);
    totalTransfer = monthTransfer.reduce((prev, curr) => {
      return prev + curr;
    }, 0);

    setMonthValues({
      totalDebit,
      totalCash,
      totalCredit,
      totalOut,
      totalPix,
      totalBankCheck,
      totalTransfer,
    });

    /* OBTEM O VALOR SOMADO DE TODOS OS CAIXAS DIÁRIOS */
    return;
  }, [dateSelected, cashierData]);

  const handleChangeDate = (e: any) => {
    setDateSelected(e);
    setCalendarVisible(false);
    return;
  };

  const handleCloseAddVisible = () => setAddVisible(false);
  const handleCloseConfirmModal = () => setConfirmModal(false);
  const handleCloseOpenCashier = () => setOpenCashier(false);

  const handleChangeCashierType = () => {
    setCashierType(null);
    setCookie("cashierType", null);
  };

  useEffect(() => {
    getCashier();
  }, [cashierType, dateSelected, filialSelection]);

  useEffect(() => {
    handleGetMonthValue();
  }, [handleGetMonthValue]);

  const handleSelectCashierType = (type: number) => {
    setCashierType(type);
    setCookie("cashierType", type);
  };

  useEffect(() => {
    if (adminData?.userType === "SUPERADMIN")
      setFilialSelection(adminData?.filial!);
  }, [adminData?.userType]);

  if (cashierType === null)
    return (
      <Stack
        height={"100%"}
        alignItems={"center"}
        justifyContent="center"
        p={2}
      >
        <Typography variant="h3" textAlign="center">
          Escolha o tipo de caixa
        </Typography>
        <Box display="flex" width="50%" mt={2} columnGap={2}>
          <Button
            variant="contained"
            fullWidth
            sx={{ height: "100px" }}
            onClick={() => handleSelectCashierType(0)}
          >
            Caixa Clínico
          </Button>
          <Button
            variant="contained"
            fullWidth
            onClick={() => handleSelectCashierType(1)}
          >
            Caixa Implantes
          </Button>
        </Box>
      </Stack>
    );

  return (
    <Box p={2}>
      <Stack
        direction={"row"}
        alignItems="center"
        justifyContent="space-between"
        columnGap={2}
        mb={2}
      >
        <Button
          variant="contained"
          color="success"
          onClick={handleChangeCashierType}
          fullWidth
        >
          Trocar tipo de Caixa
        </Button>

        {adminData?.userType === "SUPERADMIN" && (
          <Autocomplete
            disablePortal
            fullWidth
            options={["Brasilia", "Uberlandia"]}
            value={filialSelection}
            onChange={(e, v) => setFilialSelection(v as string)}
            renderInput={(params) => (
              <TextField {...params} label="Região para depuração" />
            )}
          />
        )}
      </Stack>

      {/* BEGIN MODALS */}
      <AddCashModal
        closeModal={handleCloseAddVisible}
        visible={addVisible}
        formik={formik}
      />

      <ConfirmCashModal
        closeModal={handleCloseConfirmModal}
        visible={confirmModal}
      />
      <OpenCashierModal
        handleConfirmOpenCashier={handleConfirmOpenCashier}
        closeModal={handleCloseOpenCashier}
        dateSelected={dateSelected}
        visible={openCashier}
      />
      <CModal
        visible={calendarVisible}
        closeModal={() => setCalendarVisible(false)}
      >
        <Box display="flex" alignItems="center" flexDirection="column">
          <Typography variant="subtitle1" mb={1} textAlign="center">
            Selecione a data desejada:
          </Typography>
          <Calendar onChange={handleChangeDate} value={dateSelected} />
        </Box>
      </CModal>
      {/* END MODALS */}

      {adminData?.userType === "ADMIN" ||
      adminData?.userType === "SUPERADMIN" ? (
        <ReportsButtons
          cashierType={cashierType}
          dateSelected={dateSelected}
          onOpenDateSelect={() => setCalendarVisible(true)}
        />
      ) : null}

      {cashierData !== null && (
        <>
          {adminData?.userType === "ADMIN" ||
          adminData?.userType === "SUPERADMIN" ? (
            <CashierBody cashierData={cashierData} monthValues={monthValues} />
          ) : null}
        </>
      )}

      <CashierButtons
        cashierData={cashierData}
        onAddInformations={handleOpenAddInformations}
        onOpenCashier={handleOpenCashier}
        onCloseCashier={handleCloseCashier}
      />

      <CashTable
        items={cashierData?.attributes?.cashierInfos?.data!}
        onSelect={(idCahierInfo) => console.log(idCahierInfo)}
      />
    </Box>
  );
};

CashierAdmin.getLayout = (page: any) => (
  <DashboardLayout>{page}</DashboardLayout>
);

export default CashierAdmin;
