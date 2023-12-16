import React, { useCallback, useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { DashboardLayout } from "@/layouts/dashboard/layout";
import {
  Box,
  Button,
  IconButton,
  SvgIcon,
  Tooltip,
  Typography,
  styled,
} from "@mui/material";
import { CashTable } from "@/components/new-admin/cash/cashTable";
import ReplyIcon from "@mui/icons-material/Reply";
import {
  Timestamp,
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import AddCashModal from "./modals/add";
import ConfirmCashModal from "./modals/confirm";
import { useFormik } from "formik";
import * as Yup from "yup";
import { db } from "@/services/firebase";
import { useRecoilState, useRecoilValue } from "recoil";
import UserData from "@/atoms/userData";
import CModal from "@/components/modal";
import Calendar from "react-calendar";
import { nameCapitalized } from "@/services/services";
import OpenCashierModal from "./modals/open";
import "react-calendar/dist/Calendar.css";
import LoadingServer from "@/atoms/components/loading";
import { useOnSnapshotQuery } from "@/hooks/useOnSnapshotQuery";
import { getCookie, setCookie } from "cookies-next";

const refInformations = collection(db, "cashiers_informations");
const refCashiers = collection(db, "cashiers");

interface CashierData {
  date: string;
  timestamp?: Timestamp;
  id?: string;
  closed: boolean;
  totalCash: number;
  totalCard: number;
  totalOut: number;
  totalPix: number;
  totalCredit: number;
  type?: "clinic" | "implant";
  createdBy?: {
    id: string;
    name: string;
    role: string;
  };
}

const CashAdmin = () => {
  const cookieDate: any = getCookie("oldDate");
  const cookieCashier: any = getCookie("cashierType");
  const [cashierType, setCashierType] = useState<number | null>(
    !cookieCashier ? null : Number(cookieCashier)
  );
  const [loading, setLoading] = useRecoilState(LoadingServer);
  const [addVisible, setAddVisible] = useState(false);
  const [openCashier, setOpenCashier] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [dateSelected, setDateSelected] = useState<Date>(
    !cookieDate ? new Date() : new Date(cookieDate)
  );
  const [monthValues, setMonthValues] = useState({
    totalCard: 0,
    totalCredit: 0,
    totalCash: 0,
    totalPix: 0,
    totalOut: 0,
  });

  const [cashierData, setCashierData] = useState<CashierData | null>(null);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const userData: any = useRecoilValue(UserData);

  const qInfs = query(
    refInformations,
    where("date", "==", dateSelected.toISOString().substring(0, 10)),
    where("idCashier", "==", cashierData?.id! ?? "")
  );
  const snapshotInformations = useOnSnapshotQuery(
    "cashiers_informations",
    qInfs,
    [cashierData, cashierType, dateSelected]
  );

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
        setLoading((prev) => ({ isLoading: true }));
        await handleSubmit(values);
      } catch (err: any) {
        setLoading((prev) => ({ isLoading: false, loadingMessage: "" }));
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
    if (
      cashIn === 0 &&
      cardIn === 0 &&
      out === 0 &&
      pix === 0 &&
      creditIn === 0
    )
      return alert("Adicione as informações de valores");

    if (cashierData === null) return alert("Caixa não aberto!");

    setCookie("oldDate", dateSelected);

    setLoading((prev) => ({
      isLoading: true,
      loadingMessage: "Estamos salvando os dados adicionados...",
    }));

    let nameCapital = nameCapitalized(name);
    let data: any = {
      name: nameCapital,
      description,
      date: dateSelected.toISOString().substring(0, 10),
      timestamp: dateSelected.getSeconds(),
      cashIn,
      out,
      cardIn,
      creditIn,
      pix,
      isChecked: false,
      idCashier: cashierData?.id,
    };

    return await addDoc(refInformations, data).then(
      async (querySnap) => {
        setLoading((prev) => ({
          ...prev,
          loadingMessage: "Estamos criando o documento no Banco de Dados",
        }));

        let document = doc(db, "cashiers", cashierData?.id!);

        setLoading((prev) => ({
          ...prev,
          loadingMessage: "Estamos somando o valor no caixa",
        }));
        await updateDoc(document, {
          totalCash: cashierData?.totalCash + cashIn,
          totalPix: cashierData?.totalPix + pix,
          totalCard: cashierData?.totalCard + cardIn,
          totalOut: cashierData?.totalOut + out,
          totalCredit: cashierData?.totalCredit + creditIn,
        }).then(
          () => {
            setLoading((prev) => ({ isLoading: false, loadingMessage: "" }));
            setAddVisible(false);
            formik.resetForm();
          },
          () => {
            setLoading((prev) => ({ isLoading: false, loadingMessage: "" }));
            alert("Erro ao somar o valor no caixa");
          }
        );
      },
      (err) => {
        setLoading((prev) => ({ isLoading: false, loadingMessage: "" }));
        return alert("Erro ao adicionar informação ao caixa");
      }
    );
  };

  const handleOpenAddInformations = () => {
    if (cashierData === null)
      return alert("Não há caixa aberto para lançamento!");
    else setAddVisible(true);
  };

  const getCashierData = async () => {
    let q = query(
      refCashiers,
      where("date", "==", dateSelected.toISOString().substring(0, 10)),
      where("type", "==", cashierType === 0 ? "clinic" : "implant")
    );
    let querySnapshot = await getDocs(q);

    setLoading((prev) => ({
      isLoading: true,
      loadingMessage: "Carregando o caixa",
    }));

    if (querySnapshot.docs.length === 0) {
      setCashierData(null);
      return setLoading((prev) => ({ isLoading: false, loadingMessage: "" }));
    } else {
      let data: any = querySnapshot.docs[0].data();
      setCashierData(data);
      return setLoading((prev) => ({ isLoading: false, loadingMessage: "" }));
    }
  };

  const handleOpenCashier = () => {
    if (cashierData !== null) return alert("Caixa já aberto!");
    else setOpenCashier(true);
  };

  const handleConfirmOpenCashier = async () => {
    let q = query(
      refCashiers,
      where("date", "==", dateSelected.toISOString().substring(0, 10)),
      where("type", "==", cashierType === 0 ? "clinic" : "implant")
    );
    let querySnapshot = await getDocs(q);
    setLoading((prev) => ({
      isLoading: true,
      loadingMessage: "Estamos verificando a abertura do caixa!",
    }));

    setCookie("oldDate", dateSelected);

    let cashierData: CashierData = {
      date: dateSelected.toISOString().substring(0, 10),
      timestamp: Timestamp.now(),
      closed: false,
      totalCard: 0,
      totalCash: 0,
      totalOut: 0,
      totalPix: 0,
      totalCredit: 0,
      type: cashierType === 0 ? "clinic" : "implant",
      createdBy: {
        id: userData?.id,
        name: userData?.name,
        role: userData?.role,
      },
    };

    if (querySnapshot.docs.length === 0) {
      setLoading((prev) => ({
        ...prev,
        loadingMessage: "Estamos Salvando o documento no Banco de Dados!",
      }));
      return await addDoc(refCashiers, cashierData).then(
        async (querySnap) => {
          let ref = doc(db, "cashiers", querySnap.id);
          return await updateDoc(ref, { id: querySnap.id }).then(
            async () => {
              setLoading((prev) => ({
                ...prev,
                loadingMessage: "Estamos alterando o ID primário do Caixa",
              }));
              setOpenCashier(false);
              getCashierData();
            },
            () => {
              setLoading((prev) => ({ isLoading: false, loadingMessage: "" }));
              return alert("Erro ao adicionar ID do caixa");
            }
          );
        },
        () => {
          setLoading((prev) => ({ isLoading: false, loadingMessage: "" }));
          return alert("Erro ao adicionar novo caixa!");
        }
      );
    } else {
      let data: any = querySnapshot.docs[0].data();
      setCashierData(data);
      setLoading((prev) => ({ isLoading: false, loadingMessage: "" }));
    }
  };

  const handleGetMonthValue = useCallback(async () => {
    if (cashierData === null) return;

    let actualMonth = dateSelected.getMonth();
    let actualYear = dateSelected.getFullYear();

    let firstDayMonth = new Date(actualYear, actualMonth, 1)
      .toISOString()
      .substring(0, 10);
    let lastDayMonth = new Date(actualYear, actualMonth + 1, 0)
      .toISOString()
      .substring(0, 10);

    const qMonthValues = query(
      refCashiers,
      where("date", ">=", firstDayMonth),
      where("date", "<=", lastDayMonth),
      where(
        "type",
        "==",
        cashierType === null ? "" : cashierType === 0 ? "clinic" : "implant"
      )
    );
    const snapshotMonth = await getDocs(qMonthValues);

    if (snapshotMonth.docs.length === 0) return;

    let monthCash: any[] = [];
    let monthCard: any[] = [];
    let monthCredit: any[] = [];
    let monthPix: any[] = [];
    let monthOut: any[] = [];

    snapshotMonth.forEach((docs) => {
      monthCash.push(docs.data().totalCash);
      monthCard.push(docs.data().totalCard);
      monthCredit.push(docs.data().totalCredit);
      monthPix.push(docs.data().totalPix);
      monthOut.push(docs.data().totalOut);
    });

    let totalCash = 0;
    let totalCard = 0;
    let totalCredit = 0;
    let totalPix = 0;
    let totalOut = 0;

    totalCash = monthCash.reduce((prev, curr) => {
      return prev + curr;
    }, 0);
    totalCard = monthCard.reduce((prev, curr) => {
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

    setMonthValues((prev) => ({
      totalCard,
      totalCash,
      totalCredit,
      totalOut,
      totalPix,
    }));

    return;
  }, [dateSelected, cashierData]);

  const handleChangeDate = (e: any) => {
    setDateSelected(e);
    setCalendarVisible(false);
    return;
  };

  const getCreditDiscount = (creditVal: number) => {
    let discount = (creditVal * 10) / 100;
    let discounted = creditVal - discount;
    return discounted.toFixed(2);
  };

  const handleCloseAddVisible = () => setAddVisible(false);
  const handleCloseConfirmModal = () => setConfirmModal(false);
  const handleOpenCashierModal = () => setOpenCashier(false);

  const getMonthTotal = useCallback(() => {
    const { totalCard, totalCash, totalCredit, totalPix, totalOut } =
      monthValues;
    let total = 0;

    let creditDiscounted = parseFloat(getCreditDiscount(totalCredit));

    total = totalCard + totalCash + totalPix + creditDiscounted;
    if (totalOut === 0) return total;
    else {
      total = total - totalOut;
      return total;
    }
  }, [monthValues]);

  useEffect(() => {
    getCashierData();
  }, []);

  useEffect(() => {
    getCashierData();
  }, [dateSelected, cashierType]);

  useEffect(() => {
    handleGetMonthValue();
  }, [handleGetMonthValue]);

  useEffect(() => {
    getMonthTotal();
  }, [getMonthTotal]);

  if (userData?.role !== "admin") return;

  const handleSelectCashierType = (type: number) => {
    setCashierType(type);
    setCookie("cashierType", type);
  };

  if (cashierType === null)
    return (
      <Box
        display="flex"
        alignItems={"center"}
        width="100%"
        height="100%"
        justifyContent="center"
        flexDirection="column"
      >
        <Typography variant="h3">Escolha o tipo de caixa</Typography>
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
      </Box>
    );

  return (
    <Box p={2}>
      <Tooltip title={"Escolher Caixa"}>
        <IconButton
          onClick={() => {
            setCashierType(null);
            setCookie("cashierType", null);
          }}
        >
          <SvgIcon>
            <ReplyIcon fontSize="large" />
          </SvgIcon>
        </IconButton>
      </Tooltip>

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
        closeModal={handleOpenCashierModal}
        visible={openCashier}
        handleConfirmOpenCashier={handleConfirmOpenCashier}
        dateSelected={dateSelected}
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

      <Box display="flex" justifyContent={"space-between"} px={2}>
        <Typography variant="h4">
          Caixa {`${cashierType === 0 ? "Clínico" : "de Implantes"}`} do dia{" "}
          {dateSelected.toLocaleDateString()}
        </Typography>
        <Button variant="outlined" onClick={() => setCalendarVisible(true)}>
          Alterar Data
        </Button>
      </Box>

      {cashierData !== null && (
        <Box
          display="grid"
          flexDirection={"column"}
          border={"1.4px solid #f5f5f5"}
          sx={{ backgroundColor: "#f5f5f5" }}
          columnGap={1}
          rowGap={2}
          borderRadius={4}
          px={4}
          py={2}
          mt={2}
        >
          <Typography variant="h6" textAlign={"center"} color="goldenrod">
            Movimentação do Mês
          </Typography>
          <Box
            display={"flex"}
            flexDirection={"row"}
            justifyContent={"space-between"}
            width="100%"
          >
            <Typography variant="subtitle2">
              Dinheiro: <b> R$ {monthValues?.totalCash.toFixed(2)}</b>
            </Typography>
            <Typography variant="subtitle2">
              Débito: <b> R$ {monthValues?.totalCard.toFixed(2)}</b>
            </Typography>
            <Typography variant="subtitle2">
              Crédito:{" "}
              <b>
                {" "}
                R$ {monthValues?.totalCredit.toFixed(2)}{" "}
                {`(R$ ${getCreditDiscount(monthValues?.totalCredit)})`}
              </b>
            </Typography>
          </Box>

          <Box display="flex" justifyContent={"space-between"} width="100%">
            <Typography variant="subtitle2">
              Pix: <b> R$ {monthValues?.totalPix.toFixed(2)}</b>
            </Typography>
            <Typography variant="subtitle2" color="red">
              Saída: <b> R$ {monthValues?.totalOut.toFixed(2)}</b>
            </Typography>
            <Typography
              variant="subtitle2"
              color="black"
              sx={{
                backgroundColor: "white",
                padding: ".5rem 1rem",
                borderRadius: 2,
                border: "1.5px solid #e4e4e4",
              }}
            >
              Total: <b> R$ {getMonthTotal()}</b>
            </Typography>
          </Box>
        </Box>
      )}

      {cashierData !== null && (
        <Box
          display="grid"
          flexDirection={"column"}
          border={"1.4px solid #f5f5f5"}
          sx={{ backgroundColor: "#f5f5f5" }}
          columnGap={1}
          rowGap={2}
          borderRadius={4}
          px={4}
          py={2}
          mt={2}
        >
          <Typography variant="h6" textAlign={"center"} color="green">
            Movimentação do Dia
          </Typography>
          <Box
            display={"flex"}
            flexDirection={"row"}
            justifyContent={"space-between"}
            width="100%"
          >
            <Typography variant="subtitle2">
              Dinheiro: <b> R$ {cashierData?.totalCash.toFixed(2)}</b>
            </Typography>
            <Typography variant="subtitle2">
              Débito: <b> R$ {cashierData?.totalCard.toFixed(2)}</b>
            </Typography>
            <Typography variant="subtitle2">
              Crédito:{" "}
              <b>
                {" "}
                R$ {cashierData?.totalCredit.toFixed(2)}{" "}
                {`(R$ ${getCreditDiscount(cashierData?.totalCredit)})`}
              </b>
            </Typography>
          </Box>

          <Box display="flex" justifyContent={"space-between"} width="100%">
            <Typography variant="subtitle2">
              Pix: <b> R$ {cashierData?.totalPix.toFixed(2)}</b>
            </Typography>
            <Typography variant="subtitle2" color="red">
              Saída : <b> R$ {cashierData?.totalOut.toFixed(2)}</b>
            </Typography>
          </Box>
        </Box>
      )}

      <ButtonsContainer>
        <Typography
          width={"100%"}
          variant="subtitle1"
          fontWeight={"bold"}
          color={
            cashierData === null
              ? "orange"
              : cashierData.closed
              ? "green"
              : "red"
          }
        >
          {cashierData === null
            ? "Caixa não aberto"
            : cashierData.closed
            ? "Caixa fechado"
            : "Caixa não fechado"}
        </Typography>
        <Buttons>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenAddInformations}
          >
            Add
          </Button>
          {cashierData === null && (
            <Button
              variant="contained"
              color={"success"}
              onClick={handleOpenCashier}
            >
              Abrir Caixa
            </Button>
          )}
          {cashierData !== null && (
            <Button
              variant="contained"
              color={"warning"}
              onClick={() => alert("fechar caixa")}
            >
              Fechar Caixa
            </Button>
          )}
        </Buttons>
      </ButtonsContainer>
      {cashierData !== null ? (
        <CashTable items={snapshotInformations} />
      ) : (
        <Box display="flex" justifyContent={"center"}>
          <Typography variant="h5" pt={2}>
            Não há caixa aberto nesse dia
          </Typography>
        </Box>
      )}
    </Box>
  );
};

CashAdmin.getLayout = (page: any) => <DashboardLayout>{page}</DashboardLayout>;

const ButtonsContainer = styled(Box)`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
`;
const Buttons = styled(Box)`
  display: flex;
  justify-content: flex-end;
  width: 100%;
  column-gap: 1rem;
`;

export default CashAdmin;
