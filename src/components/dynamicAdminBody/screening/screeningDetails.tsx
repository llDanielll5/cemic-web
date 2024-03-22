//@ts-nocheck
/* eslint-disable @next/next/no-img-element */

import React, { useState, useEffect, useCallback } from "react";
import Modal from "@/components/modal";

// import ModalPaymentAdmin from "./modalPayment";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { useOnSnapshotQuery } from "@/hooks/useOnSnapshotQuery";
import TransferWithinAStationIcon from "@mui/icons-material/TransferWithinAStation";
import { StyledButton } from "../receipts";
import { useRouter } from "next/router";
import Link from "next/link";
import { ScreeningInformations } from "types";
import {
  Autocomplete,
  Box,
  Button,
  IconButton,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import {
  Timestamp,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { useRecoilValue } from "recoil";
import UserData from "@/atoms/userData";
import Loading from "@/components/loading";

interface ScreeningDetailsProps {
  setIsGeneratePayment: (e: boolean) => void;
  infos: ScreeningInformations;
  onClose: () => void;
}

const iconStyles = { border: "1px solid #d5d5d5", padding: 0, margin: "4px" };

export const successIcon = (props: any) => (
  <IconButton sx={iconStyles} onClick={props.onClick}>
    <CheckIcon color="success" />
  </IconButton>
);
export const closeIcon = (props: any) => (
  <IconButton sx={iconStyles} onClick={props.onClick}>
    <CloseIcon color="error" />
  </IconButton>
);

export interface PaymentShapesArray {
  paymentType: null;
  value: number;
  valueStr: string;
}

interface ReceiptValuesProps {
  total: string;
  patientName: string;
  date: string;
  treatments: any[];
}

type ReceiptType = ReceiptValuesProps | null;
type PayShapeArr = PaymentShapesArray[];

const ScreeningDetailsAdmin = (props: ScreeningDetailsProps) => {
  const { infos, onClose, setIsGeneratePayment } = props;
  const router = useRouter();
  const hasId = infos?.patientId ?? "";
  const [vezes, setVezes] = useState("");
  const [discount, setDiscount] = useState(5);
  const [totalValue, setTotalValue] = useState(0);
  const [patientData, setPatientData] = useState<any>({});
  const [negotiateds, setNegotiateds] = useState<any[]>([]);
  const [receiptVisible, setReceiptVisible] = useState(false);
  const [totalValueString, setTotalValueString] = useState("");
  const [allValue, setAllValue] = useState<string | null>(null);
  const [paymentModal, setPaymentModal] = useState<boolean>(false);
  const [treatmentsToPay, setTreatmentsToPay] = useState<any[]>([]);
  const [paymentShapesValues, setPaymentShapesValues] = useState("");
  const [data, setData] = useState<ScreeningInformations | null>(null);
  const [forwardModalVisible, setForwardModalVisible] = useState(false);
  const [paymentType, setPaymentType] = useState<null>(null);
  const [receiptValues, setReceiptValues] = useState<ReceiptType>(null);
  const [paymentShapesArr, setPaymentsShapesArr] = useState<PayShapeArr>([]);
  const [selectedProfessional, setSelectedProfessional] = useState<any | null>(
    null
  );
  const [clientTreatments, setClientTreatments] =
    useState<ClientTreatmentsProps | null>(null);
  const [forwardsData, setForwardsData] = useState<any | null>(null);
  const [forwardTreatments, setForwardTreatments] = useState<any[]>([]);
  const [isForwarding, setIsForwarding] = useState(false);
  const userData = useRecoilValue(UserData);

  const [yS, mS, dS] = infos?.date?.split?.("-")?.map((v) => parseInt(v));
  const hourScheduled = infos?.hour?.split(":")[0];
  const scheduledScreening = new Date(yS, mS, dS, parseInt(hourScheduled));
  const momentNow = new Date();

  const screeningRef = collection(db, "screenings");
  const q = query(screeningRef, where("patientId", "==", hasId));
  const snapUser = useOnSnapshotQuery("screenings", q, [hasId]);
  const snapProfessionals = useOnSnapshotQuery("professionals");

  useEffect(() => {
    setData(snapUser[0]);
  }, [snapUser]);

  useEffect(() => {
    if (hasId === "") return;
    const getClientInfos = async () => {
      const ref = doc(db, "clients", hasId);
      const querySnapshot = await getDoc(ref);
      setPatientData(querySnapshot.data());
    };
    const getClientTreatments = async () => {
      const ref = collection(db, "clients_treatments");
      const q = query(ref, where("client", "==", hasId));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.docs.length > 0) {
        const document: any = querySnapshot.docs[0];
        return setClientTreatments(document.data());
      }
    };
    const getClientForwards = async () => {
      const ref = collection(db, "forwards_history");
      const q = query(ref, where("client", "==", hasId));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.docs.length > 0) {
        const document: any = querySnapshot.docs[0];
        return setForwardsData(document.data());
      }
    };
    Promise.all([getClientInfos(), getClientTreatments(), getClientForwards()]);
  }, [hasId]);

  const getTotalValue = useCallback(
    (arr: { region: string; treatments: any }[]) => {
      const prices: number[] = [];

      const arrMap = arr?.flatMap((v) =>
        prices.push(parseFloat(v?.treatments?.price.replaceAll(".", "")))
      );

      if (arrMap.length > 0) {
        let reduced = prices?.reduce(
          (prev, curr) =>
            parseFloat(prev.toFixed(2)) + parseFloat(curr.toFixed(2))
        );

        if (paymentType === "cash") {
          let discounted = (reduced * discount) / 100;
          if (!discount) {
            reduced = reduced;
          } else reduced -= discounted;

          setTotalValue(parseFloat(reduced.toFixed(2)));
          setTotalValueString(reduced.toFixed(2));
          return;
        } else if (paymentType === "credit") {
          let percent = (reduced * 10) / 100;
          reduced += percent;
          setTotalValue(parseFloat(reduced.toFixed(2)));
          setTotalValueString(reduced.toFixed(2));
          return;
        } else {
          setTotalValue(parseFloat(reduced.toFixed(2)));
          setTotalValueString(reduced.toFixed(2));
          return;
        }
      } else return;
    },
    [paymentType, discount]
  );

  const handleGetProfessionalName = useCallback(() => {
    const filt = snapProfessionals?.filter(
      (v) => v?.id === clientTreatments?.actualProfessional
    );
    return `${filt[0]?.name}`;
  }, [clientTreatments?.actualProfessional, snapProfessionals]);

  useEffect(() => {
    getTotalValue(negotiateds);
  }, [getTotalValue, negotiateds]);

  const money = totalValueString.replace(".", "");
  const masked = maskValue(money);

  const hasPayedTreatmentPlan = () => {
    const arr1 = clientTreatments?.treatments?.treatment_plan;
    const arr2 = clientTreatments?.negotiateds;

    return JSON.stringify(arr1) === JSON.stringify(arr2);
  };

  if (!infos) return null;
  if (data === null || snapUser.length === 0) return null;

  const hasTreatmentPlan =
    clientTreatments?.treatments?.treatment_plan?.length > 0;
  const notHasPlanTreat =
    data?.hasPay !== null &&
    clientTreatments?.treatments?.treatment_plan?.length === 0;

  const backgroundcolor = data?.isMissed
    ? { backgroundColor: "red" }
    : { backgroundColor: "green" };
  const hasPayed = data?.hasPay
    ? { backgroundColor: "green" }
    : { backgroundColor: "red" };

  const handleUpdateValue = async (field: string, value: any) => {
    const reference = doc(db, "screenings", infos.id!);
    return await updateDoc(reference, { [field]: value }).catch((err) => {
      return alert("Erro ao realizar atualização, " + err.code);
    });
  };
  const handleGeneratePayment = () => {
    const treats = clientTreatments?.treatments?.treatment_plan;
    const neg = clientTreatments?.negotiateds;

    let reduced: any[] = [];
    treats?.forEach((item) => {
      var duplicated =
        neg!.findIndex((val) => {
          return (
            item.region === val.region &&
            item.treatments.cod === val.treatments.cod
          );
        }) > -1;

      if (!duplicated) {
        reduced.push(item);
      }
    });

    setTreatmentsToPay(reduced);
    setPaymentModal(true);
  };
  const onCloseModalPayment = () => {
    setPaymentShapesValues("");
    setPaymentsShapesArr([]);
    setPaymentModal(false);
    setTreatmentsToPay([]);
    setPaymentType(null);
    setNegotiateds([]);
    setAllValue(null);
    setDiscount(5);
    setVezes("");
    return;
  };

  const handleCloseForwardModal = () => {
    setForwardModalVisible(false);
    setSelectedProfessional(null);
    setForwardTreatments([]);
    return;
  };

  function maskValue(value: string) {
    const val = value.replace(/[\D]+/g, "");
    var tmp = val + "";
    tmp = tmp.replace(/([0-9]{2})$/g, ",$1");
    if (tmp.length > 6) tmp = tmp.replace(/([0-9]{3}),([0-9]{2}$)/g, ".$1,$2");
    return tmp;
  }

  const handleViewPayment = async () => {
    if (discount > 8) return alert("Desconto não liberado no sistema");

    const totalValue = masked;
    const patientName = patientData?.name;
    const dateNow = new Date().toLocaleDateString("pt-br");
    const treatmentsString = negotiateds.flatMap(
      (v) =>
        `·${v?.region} - ${v?.treatments?.name} ==> R$ ${maskValue(
          v?.treatments?.price
        )}`
    );

    setReceiptValues({
      total: totalValue,
      patientName,
      date: dateNow,
      treatments: treatmentsString,
    });
    setReceiptVisible(true);
    return;
  };

  const handleCloseReceiptVisible = () => {
    setReceiptValues(null);
    setReceiptVisible(false);
    return;
  };

  const handleFinishPayment = async () => {
    setIsGeneratePayment(true);
    const dateNow = Timestamp.now();
    let paymentShape = [];

    if (paymentType !== null) {
      paymentShape = [
        { type: paymentType, value: totalValue, valueStr: totalValueString },
      ];
    } else {
      let formatShapes: any[] = paymentShapesArr.map((v) => ({
        type: v.paymentType,
        value: v.value,
        valueStr: v.valueStr,
      }));
      paymentShape = formatShapes;
    }

    let generateId = `${infos.patientId!}-${dateNow.seconds}`;

    const receiptData: ReceiptProps = {
      negotiateds,
      paymentShape,
      timestamp: dateNow,
      screeningId: infos.id!,
      patientId: infos?.patientId,
      paymentId: generateId,
      id: generateId,
      total: totalValue,
      totalStr: totalValueString,
    };

    const paymentData = {
      id: generateId,
      patientId: infos.patientId!,
      receiptId: generateId,
      shape: paymentShape,
      total: totalValue,
      totalStr: totalValueString,
    };

    const receiptRef = doc(db, "receipts", generateId);
    const paymentsRef = doc(db, "payments", generateId);
    const clientTreatmentRef = doc(
      db,
      "clients_treatments",
      clientTreatments!.id
    );

    const handleSuccess = async () => {
      const screeningRef = doc(db, "screenings", infos.id!);
      const screeningData: ScreeningInformations | any = {
        paymentId: arrayUnion(generateId),
        receiptId: arrayUnion(generateId),
        negotiated: arrayUnion(...negotiateds),
      };
      return await updateDoc(screeningRef, screeningData)
        .then(async () => {
          const ref = doc(db, "clients", infos!.patientId);
          return await updateDoc(ref, { role: "patient" })
            .then(async () => {
              return await updateDoc(clientTreatmentRef, {
                negotiateds: arrayUnion(...negotiateds),
              })
                .then(() => {
                  setIsGeneratePayment(false);
                  onCloseModalPayment();
                  onClose();
                  return;
                })
                .catch((err) => {
                  setIsGeneratePayment(false);
                });
            })
            .catch(() => {
              setIsGeneratePayment(false);
              return alert("Erro ao atualizar o paciente");
            });
        })
        .catch((err) => {
          return alert("Erro ao atualizar a Triagem" + err);
        });
    };

    await setDoc(receiptRef, receiptData)
      .then(async () => {
        await setDoc(paymentsRef, paymentData).then(handleSuccess, (err) => {
          setIsGeneratePayment(false);
          return alert(err + " Deu erro");
        });
      })
      .catch((err) => {
        setIsGeneratePayment(false);
        return alert("Deu erro ao criar o recibo");
      });

    return;
  };

  const handleAddForwardTreatments = (item: any) => {
    const hasItem = forwardTreatments.filter((v) => v == item);
    if (forwardTreatments.length === 0) return setForwardTreatments([item]);
    if (hasItem.length === 0) {
      return setForwardTreatments((prev) => [...prev, item]);
    } else return;
  };

  const handleSendPatient = async () => {
    setIsForwarding(true);
    const document = doc(db, "clients_treatments", clientTreatments!.id);
    return await updateDoc(document, {
      "treatments.forwardeds": arrayUnion(...forwardTreatments),
    })
      .then(async () => {
        const timeNow = Timestamp.now().seconds;
        const idF = `${infos?.patientId}-${timeNow}`;
        const forwardInformations = {
          timestamp: Timestamp.now(),
          reporter: userData?.id,
          client: infos?.patientId,
          reporter_name: userData?.name,
          professional: selectedProfessional?.id,
          professional_name: selectedProfessional?.name,
          treatments: forwardTreatments,
          realizeds: [],
          medias: [],
          problems: [],
          id: idF,
        };
        const ref = doc(db, "forwards_history", idF);
        const data = forwardInformations;
        return await setDoc(ref, data)
          .then(async () => {
            const ref = doc(db, "clients_treatments", clientTreatments!.id);
            return await updateDoc(ref, {
              actualProfessional: selectedProfessional!.id,
            })
              .then(() => {
                handleCloseForwardModal();
                onClose();
                setIsForwarding(false);
                return alert("Paciente encaminhado com sucesso!");
              })
              .catch(() => {
                setIsForwarding(false);
              });
          })
          .catch((err: any) => {
            setIsForwarding(false);
            return alert(
              "Não foi possível encaminhar o paciente" + err.message
            );
          });
      })
      .catch((err) => {
        setIsForwarding(false);
        return alert("Não foi possível encaminhar o paciente" + err.message);
      });
  };

  return (
    <Container>
      {/* <Modal visible={paymentModal} closeModal={onCloseModalPayment}>
        <ModalPaymentAdmin
          vezes={vezes}
          allValue={allValue}
          discount={discount}
          setVezes={setVezes}
          totalValue={totalValue}
          setAllValue={setAllValue}
          negotiateds={negotiateds}
          paymentType={paymentType}
          setDiscount={setDiscount}
          setTotalValue={setTotalValue}
          setNegotiateds={setNegotiateds}
          setPaymentType={setPaymentType}
          treatmentsToPay={treatmentsToPay}
          paymentShapesArr={paymentShapesArr}
          totalValueString={totalValueString}
          handleViewPayment={handleViewPayment}
          setTreatmentsToPay={setTreatmentsToPay}
          onCloseModalPayment={onCloseModalPayment}
          setTotalValueString={setTotalValueString}
          setPaymentShapesArr={setPaymentsShapesArr}
          paymentShapesValues={paymentShapesValues}
          setPaymentShapesValues={setPaymentShapesValues}
        />
      </Modal> */}

      {/* <Modal visible={receiptVisible} closeModal={handleCloseReceiptVisible}>
        <ReceiptAdmin
          receiptValues={receiptValues}
          onSubmit={handleFinishPayment}
          paymentShapesArr={paymentShapesArr}
          paymentShapesValues={paymentShapesValues}
          paymentType={paymentType}
          discount={discount}
          vezes={vezes}
        />
      </Modal> */}

      <Modal visible={forwardModalVisible} closeModal={handleCloseForwardModal}>
        <Typography variant="subtitle1">Escolha o dentista:</Typography>
        <Autocomplete
          options={snapProfessionals}
          sx={{ width: "85%" }}
          limitTags={2}
          getOptionLabel={(option) => option.name}
          isOptionEqualToValue={(option, value) => option.name === value.name}
          onChange={(e, v) => setSelectedProfessional(v)}
          renderInput={(params) => (
            <TextInput
              {...params}
              placeholder="Selecione o dentista."
              variant="standard"
            />
          )}
        />
        <Typography variant="subtitle1" mt={1}>
          Escolha os tratamentos:
        </Typography>
        <Box display="flex" columnGap={"4px"}>
          {clientTreatments?.treatments?.treatment_plan?.map((v, i) => (
            <StyledButton key={i} onClick={() => handleAddForwardTreatments(v)}>
              {v?.region} - {v?.treatments.name}
            </StyledButton>
          ))}
        </Box>

        <Typography variant="subtitle1" my={1}>
          Tratamentos escolhidos:
        </Typography>
        <Box display="flex" columnGap={"4px"}>
          {forwardTreatments?.length > 0 &&
            forwardTreatments.map((v, i) => (
              <StyledButton key={i}>
                {v?.region} - {v?.treatments?.name}
              </StyledButton>
            ))}
        </Box>

        {selectedProfessional !== null && forwardTreatments.length > 0 ? (
          <StyledButton onClick={handleSendPatient}>Encaminhar</StyledButton>
        ) : null}
      </Modal>

      {isForwarding && (
        <Box position="fixed" top={0} left={0} zIndex={2000}>
          <Loading message="Estamos encaminhando o paciente.." />
        </Box>
      )}

      <Name variant="subtitle1">{infos?.name}</Name>
      <Typography
        my={1}
        variant="caption"
        display={"flex"}
        columnGap={"4px"}
        alignSelf={"center"}
      >
        ID de triagem: <span> {infos?.id}</span>
      </Typography>
      <Typography
        mb={1}
        variant="caption"
        display={"flex"}
        columnGap={"4px"}
        alignSelf={"center"}
      >
        Paciente agendado por: {infos?.reporter_name}
      </Typography>

      <Form px={2}>
        <BoolContainer>
          <Hours variant="subtitle1">
            <AccessTimeIcon /> {data?.hour}h
          </Hours>
          {momentNow < scheduledScreening ? null : data?.hasPay === null ? (
            <>
              <HasMissed>
                <Typography variant="subtitle1">Fechou?</Typography>
                {successIcon({
                  onClick: () => handleUpdateValue("hasPay", true),
                })}
                {closeIcon({
                  onClick: () => handleUpdateValue("hasPay", false),
                })}
              </HasMissed>
            </>
          ) : (
            <BoolsOptions variant="subtitle1" color={"white"} sx={hasPayed}>
              {data?.hasPay ? "Fechou" : "Não-Fechou"}
            </BoolsOptions>
          )}
          {data?.isMissed !== null && (
            <BoolsOptions
              color={"white"}
              variant="subtitle1"
              sx={backgroundcolor}
            >
              {data?.isMissed ? "Faltou" : "Presente"}
            </BoolsOptions>
          )}
        </BoolContainer>

        {data?.hasPay !== null && !data?.hasPay ? (
          <Box
            mb={1}
            display="flex"
            borderRadius="8px"
            alignItems="center"
            justifyContent="center"
            border="1px solid var(--dark-blue)"
          >
            <Typography variant="subtitle1">Paciente fechou depois?</Typography>
            {successIcon({
              onClick: () => handleUpdateValue("hasPay", true),
            })}
          </Box>
        ) : null}

        <DoubleColumn>
          <Box display={"flex"} alignItems={"center"} columnGap={"4px"}>
            <Typography variant="subtitle1">Dentista: </Typography>
            <Typography variant="body2">{infos?.professional_name}</Typography>
          </Box>
          <Box display={"flex"} alignItems={"center"} columnGap={"4px"}>
            <Typography variant="subtitle1">ID Dentista: </Typography>
            <Typography variant="body2">{infos?.professionalId}</Typography>
          </Box>
        </DoubleColumn>

        {hasTreatmentPlan ? (
          <>
            <Typography
              mb={2}
              variant="subtitle1"
              alignSelf={"center"}
              textAlign={"center"}
            >
              Plano de Tratamento:
            </Typography>

            {clientTreatments?.treatments?.treatment_plan?.map((v, i) => (
              <Box
                mb={1}
                key={i}
                width={"100%"}
                display={"flex"}
                columnGap={"4px"}
                alignItems={"center"}
              >
                <Typography variant="subtitle1" sx={{ color: "var(--red)" }}>
                  {v?.region} -{" "}
                </Typography>
                <Typography variant="subtitle1">
                  {v?.treatments?.name}
                </Typography>
              </Box>
            ))}
          </>
        ) : notHasPlanTreat ? (
          <Typography
            variant="subtitle1"
            alignSelf={"center"}
            textAlign={"center"}
            mb={2}
          >
            Ainda não há Plano de tratamento
          </Typography>
        ) : null}

        {clientTreatments?.treatments?.treatment_plan.length > 0 &&
        !hasPayedTreatmentPlan() ? (
          <Button50
            color={"inherit"}
            variant="outlined"
            onClick={handleGeneratePayment}
          >
            Gerar Pagamento
          </Button50>
        ) : null}

        {data?.negotiated?.length > 0 && (
          <>
            <Typography
              mb={2}
              variant="subtitle1"
              alignSelf={"center"}
              textAlign={"center"}
            >
              Tratamentos negociados na Triagem:
            </Typography>

            {data?.negotiated?.map((v, i) => (
              <Box
                mb={1}
                key={i}
                width={"100%"}
                display={"flex"}
                columnGap={"4px"}
                alignItems={"center"}
              >
                <Typography variant="subtitle1" sx={{ color: "var(--red)" }}>
                  {v?.region} -{" "}
                </Typography>
                <Typography variant="subtitle1">
                  {v?.treatments?.name}
                </Typography>
              </Box>
            ))}
          </>
        )}

        {data?.receiptId.length > 0 && (
          <Box display="flex" alignItems="center" flexDirection="column">
            <Typography variant="subtitle1">Recibos</Typography>
            <Box display="flex" alignItems="center">
              {data?.receiptId.map((v, i) => (
                <Link
                  passhref="true"
                  key={i}
                  target="_blank"
                  href={`/admin/receipt/${v}`}
                  style={{ margin: "4px" }}
                >
                  <StyledButton>Recibo-{i + 1}</StyledButton>
                </Link>
              ))}
            </Box>
          </Box>
        )}

        {clientTreatments !== null && forwardsData === null ? (
          <StyledButton
            onClick={() => setForwardModalVisible(true)}
            endIcon={<TransferWithinAStationIcon />}
          >
            Encaminhar paciente
          </StyledButton>
        ) : null}
        {forwardsData !== null && (
          <Box display="flex" alignItems="center" justifyContent="center">
            <Typography variant="subtitle1">
              Paciente encaminhado para:
            </Typography>
            <Button variant="text" color="warning">
              {handleGetProfessionalName()}
            </Button>
          </Box>
        )}
      </Form>
    </Container>
  );
};

const Container = styled(Box)`
  padding: 6px;
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  position: relative;
`;

const Name = styled(Typography)`
  text-align: center;
  width: 100%;
  margin: 12px 0 4px 0;
`;

const Form = styled(Box)`
  display: flex;
  flex-direction: column;
  border: 1.5px solid var(--dark-blue);
`;

const BoolContainer = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  column-gap: 4px;
  padding: 0 4px;
  width: 100%;
  margin: 12px 0;
  @media screen and (max-width: 900px) {
    flex-direction: column;
    width: 100%;
    align-items: center;
    justify-content: center;
  }
`;

const HasMissed = styled(Box)`
  display: flex;
  align-items: center;
  border: 1.3px solid var(--dark-blue);
  margin: 8px 0;
  border-radius: 4px;
  padding: 0 2px 0 8px;
  @media screen and (max-width: 900px) {
    margin: 4px 0;
    padding: 0 1px 0 4px;
    justify-content: center;
    font-size: 12px;
  }
`;

const BoolsOptions = styled(Typography)`
  padding: 2px 4px;
  border-radius: 4px;
  margin: 4px 0;
`;

const Hours = styled(Typography)`
  display: flex;
  align-items: center;
`;

export const Button50 = styled(Button)`
  width: 50%;
  align-self: center;
  margin: 8px 0;
  color: white;
  background-color: var(--dark-blue);
  @media screen and (max-width: 900px) {
    width: 90%;
  }
  :hover {
    background-color: var(--red);
  }
`;

const DoubleColumn = styled(Box)`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  @media screen and (max-width: 500px) {
    flex-direction: column;
  }
`;

export const TextInput = styled(TextField)`
  border-radius: 4px;
  .MuiAutocomplete-input {
    border: none;
    outline: none;
  }
`;

export default ScreeningDetailsAdmin;
