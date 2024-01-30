import React, { useCallback, useEffect, useState } from "react";
import { PaymentTypes } from "types/payments";
import { Button50, PaymentShapesArray } from "./screeningDetails";
import {
  Box,
  Typography,
  styled,
  Button,
  IconButton,
  FormControl,
  FormLabel,
  Radio,
  FormControlLabel,
  TextField,
  RadioGroup,
} from "@mui/material";
import { IconClose } from "@/components/dynamicProfBody/screening/details/treatmentPlan";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import CalculateIcon from "@mui/icons-material/Calculate";
import RenderPaymentTypes from "./paymentTypes";
import { maskValue } from "@/services/services";

interface ModalPaymentProps {
  vezes: string;
  setVezes: any;
  discount: number;
  setTotalValueString: any;
  negotiateds: any[];
  totalValue: number;
  setNegotiateds: any;
  treatmentsToPay: any[];
  allValue: string | null;
  setTreatmentsToPay: any;
  onCloseModalPayment: any;
  totalValueString: string;
  setTotalValue: any;
  handleViewPayment: () => void;
  paymentType: PaymentTypes | null;
  setAllValue: (e: string) => void;
  setDiscount: (e: number) => void;
  setPaymentType: (e: PaymentTypes | null) => void;
  paymentShapesValues: string;
  setPaymentShapesValues: (e: string) => void;
  paymentShapesArr: PaymentShapesArray[];
  setPaymentShapesArr: (e: PaymentShapesArray[]) => void;
  negotiatedsToRealize: any;
  setNegotiatedsToRealize: any;
}

export type AnswerOptions = "Sim" | "Não";

const ModalPaymentAdmin = (props: ModalPaymentProps) => {
  const {
    vezes,
    setVezes,
    discount,
    allValue,
    totalValue,
    setTotalValue,
    negotiateds,
    setAllValue,
    setDiscount,
    paymentType,
    setPaymentType,
    setNegotiateds,
    treatmentsToPay,
    totalValueString,
    paymentShapesArr,
    handleViewPayment,
    setTreatmentsToPay,
    setTotalValueString,
    setPaymentShapesArr,
    onCloseModalPayment,
    paymentShapesValues,
    setPaymentShapesValues,
    negotiatedsToRealize,
    setNegotiatedsToRealize,
  } = props;

  const paymentTypeText = () => {
    if (paymentType === "credit") return "Cartão de Crédito";
    if (paymentType === "pix/cash") return "Pix ou Dinheiro";
    if (paymentType === "debit") return "No Débito";
  };

  const handleAddToPay = (value: any) => {
    const filter = treatmentsToPay.filter((v) => v !== value);
    setTreatmentsToPay(filter);
    const arr: any[] = [];
    arr.push(value);
    negotiateds.length === 0
      ? setNegotiateds(arr)
      : setNegotiateds((prev: any) => [...prev, ...arr]);
    return;
  };
  const handleDeleteToPay = (index: number) => {
    const filter = negotiateds.filter((v, i) => i !== index);
    const value = negotiateds.filter((v, i) => i === index);
    setNegotiateds(filter);
    const arr: any[] = [];
    arr.push(...value);
    treatmentsToPay.length === 0
      ? setTreatmentsToPay(arr)
      : setTreatmentsToPay((prev: any) => [...prev, ...arr]);
    return;
  };

  const handleAddPaymentShapes = (e: any) => {
    const shapes: PaymentShapesArray = {
      paymentType: null,
      value: 0,
      valueStr: "",
    };
    setPaymentShapesValues(e.target.value);
    if (e.target.value === "2") return setPaymentShapesArr([shapes, shapes]);
    else if (e.target.value === "3")
      return setPaymentShapesArr([shapes, shapes, shapes]);
  };

  function handlePress(type: PaymentTypes, index: number) {
    if (paymentShapesValues === "2") {
      const updateArr0 = {
        paymentType: type,
        value: paymentShapesArr[0].value,
        valueStr: paymentShapesArr[0].valueStr,
      };
      const updateArr1 = {
        paymentType: type,
        value: paymentShapesArr[1].value,
        valueStr: paymentShapesArr[1].valueStr,
      };

      if (index === 0) {
        return setPaymentShapesArr([updateArr0, paymentShapesArr[1]]);
      } else if (index === 1) {
        return setPaymentShapesArr([paymentShapesArr[0], updateArr1]);
      }
    }

    if (paymentShapesValues === "3") {
      const updateArr0 = {
        paymentType: type,
        value: paymentShapesArr[0].value,
        valueStr: paymentShapesArr[0].valueStr,
      };
      const updateArr1 = {
        paymentType: type,
        value: paymentShapesArr[1].value,
        valueStr: paymentShapesArr[1].valueStr,
      };
      const updateArr2 = {
        paymentType: type,
        value: paymentShapesArr[2].value,
        valueStr: paymentShapesArr[2].valueStr,
      };

      if (index === 0) {
        return setPaymentShapesArr([
          updateArr0,
          paymentShapesArr[1],
          paymentShapesArr[2],
        ]);
      } else if (index === 1) {
        return setPaymentShapesArr([
          paymentShapesArr[0],
          updateArr1,
          paymentShapesArr[2],
        ]);
      } else if (index === 2) {
        return setPaymentShapesArr([
          paymentShapesArr[0],
          paymentShapesArr[1],
          updateArr2,
        ]);
      }
    }
  }

  const handleViewPaymentWithShapes = () => {
    const notHasValues = paymentShapesArr.filter((v) => v.valueStr === "");
    if (notHasValues.length > 0)
      return alert("Preencha o valor para todas as formas de pagamento");

    return handleViewPayment();
  };

  const handleChangeValueShapes = (e: any, i: number) => {
    const clone = [...paymentShapesArr];

    clone[i].valueStr = maskValue(e);
    let float = parseFloat(e);
    clone[i].value = float;
    setPaymentShapesArr(clone);
  };

  const handleCalculateCredit = (v: PaymentShapesArray, i: number) => {
    const clone = [...paymentShapesArr];

    let val = v.valueStr;
    if (val === "" || val === ",") {
      return alert("Coloque um valor válido");
    }
    if (v.value > 0) {
      return alert("Valor já calculado");
    }
    let float = parseFloat(val.replaceAll(".", ""));

    let acrescimo = (float * 10) / 100;
    float += acrescimo;
    let parsedFloat = maskValue(float.toFixed(2).toString());

    let oldTotal = totalValueString;
    let parseOld = parseFloat(oldTotal);
    let finalValue = parseOld + acrescimo;
    let valueString = finalValue.toFixed(2).toString();

    setTotalValue(finalValue.toFixed(2));
    setTotalValueString(valueString);
    clone[i].valueStr = parsedFloat;
    clone[i].value = float;
    setPaymentShapesArr(clone);
  };

  const handleChangeRadio = (e: any) => {
    setAllValue(e.target.value);
    setPaymentType(null);
    setPaymentShapesValues("");
    setPaymentShapesArr([]);
    return;
  };

  return (
    <Box
      display={"flex"}
      alignItems={"center"}
      flexDirection={"column"}
      sx={{ position: "relative" }}
      pt={1}
    >
      <IconClose title={"Sair de pagamento"} onClick={onCloseModalPayment}>
        <HighlightOffIcon />
      </IconClose>
      <Typography variant="subtitle1">Gerar Pagamento</Typography>

      {treatmentsToPay.length > 0 && (
        <Typography variant="subtitle1" color="green" my={1}>
          Escolha os tratamentos que serão pagos:
        </Typography>
      )}

      {treatmentsToPay.map((v, i) => (
        <TreatmentsChoice key={i} onClick={() => handleAddToPay(v)}>
          <Typography variant="subtitle1">{v?.region} - </Typography>
          <Typography variant="subtitle1">{v?.treatment?.name}</Typography>
        </TreatmentsChoice>
      ))}

      {negotiateds?.length > 0 && (
        <Typography variant="subtitle1" my={1} color="orangered">
          Os tratamentos a pagar serão:
        </Typography>
      )}
      {negotiateds?.length > 0 &&
        negotiateds?.map((v, i) => (
          <TreatmentsChoice key={i} onClick={() => handleDeleteToPay(i)}>
            <Typography variant="subtitle1">{v?.region} - </Typography>
            <Typography variant="subtitle1">{v?.treatment?.name}</Typography>
          </TreatmentsChoice>
        ))}

      {negotiateds.length > 0 && <h3>Total: {totalValueString}</h3>}

      {negotiateds.length > 0 && (
        <Box>
          <Former>
            <FormLabel color="warning" id="demo-radio-buttons-group-label">
              Será o valor todo no mesmo tipo de pagamento?
            </FormLabel>
            <RadioGroup>
              <FormControlLabel
                value={"Sim"}
                checked={allValue === "Sim"}
                control={<Radio onChange={handleChangeRadio} color="warning" />}
                label="Sim"
              />
              <FormControlLabel
                checked={allValue === "Não"}
                value={"Não"}
                control={<Radio onChange={handleChangeRadio} color="warning" />}
                label="Não"
              />
            </RadioGroup>
          </Former>
        </Box>
      )}

      {allValue !== null && (
        <Typography variant="h5" my={2}>
          Adicione a forma de pagamento:
        </Typography>
      )}

      {allValue === "Não" && (
        <Box>
          <Typography variant="body1">
            Seriam quantas formas de pagamento?
          </Typography>
          <Box display="flex" alignItems="center" justifyContent="center">
            <FormControlLabel
              checked={paymentShapesValues === "2"}
              value={"2"}
              control={
                <Radio onChange={handleAddPaymentShapes} color="warning" />
              }
              label="2(Duas)"
            />
            <FormControlLabel
              checked={paymentShapesValues === "3"}
              value={"3"}
              control={
                <Radio onChange={handleAddPaymentShapes} color="warning" />
              }
              label="3(Três)"
            />
          </Box>
        </Box>
      )}

      {allValue === "Não" && paymentShapesValues !== ""
        ? paymentShapesArr.map((v, i) => {
            return (
              <Box
                key={i}
                p={"4px"}
                width="100%"
                display="flex"
                flexDirection="column"
              >
                {RenderPaymentTypes({
                  onClickCard: () => handlePress("credit", i),
                  onClickCash: () => handlePress("pix/cash", i),
                  onClickDebit: () => handlePress("debit", i),
                  valueCard: v.paymentType === "credit",
                  valueDebit: v.paymentType === "debit",
                  valueCash: v.paymentType === "pix/cash",
                })}
                {v.paymentType !== null && (
                  <Box
                    width="50%"
                    alignSelf="center"
                    display="flex"
                    alignItems="center"
                    columnGap={1}
                    m={1}
                  >
                    <TextField
                      label="Valor"
                      type="text"
                      margin="dense"
                      sx={{ width: "100%" }}
                      value={v.valueStr}
                      onChange={(e) =>
                        handleChangeValueShapes(e.target.value, i)
                      }
                    />
                    {v.paymentType === "credit" && (
                      <ButtonCredit
                        title="Calcular Acréscimo"
                        onClick={() => handleCalculateCredit(v, i)}
                      >
                        <CalculateIcon />
                      </ButtonCredit>
                    )}
                  </Box>
                )}
              </Box>
            );
          })
        : null}

      {allValue === "Sim" && (
        <RenderPaymentTypes
          onClickCard={() => setPaymentType("credit")}
          onClickCash={() => setPaymentType("pix/cash")}
          onClickDebit={() => setPaymentType("debit")}
          valueCard={paymentType === "credit"}
          valueCash={paymentType === "pix/cash"}
          valueDebit={paymentType === "debit"}
        />
      )}

      {paymentType !== null && allValue === "Sim" ? (
        <Typography variant="body1" mt={1}>
          {paymentTypeText()}
        </Typography>
      ) : null}

      {paymentType === "credit" && allValue === "Sim" ? (
        <CreditDivide>
          <Typography variant="body2">Em quantas vezes?</Typography>
          {/* <ReactDropdown
            options={parcelado}
            onChange={({ value }) => setVezes(value)}
            value={vezes}
            className={"dropdown"}
          /> */}
        </CreditDivide>
      ) : null}

      {paymentType === "pix/cash" && allValue !== null ? (
        <Box
          width="50%"
          display="flex"
          alignItems="center"
          justifyContent={"center"}
          columnGap="4px"
        >
          <Box width={"40%"}>
            <TextField
              type="number"
              label="Desconto"
              margin="dense"
              value={discount.toString()}
              onChange={(e) => setDiscount(parseFloat(e.target.value))}
              inputProps={{ maxLength: 2 }}
            />
          </Box>
          <Typography variant="h5" fontSize="30px">
            %
          </Typography>
        </Box>
      ) : null}

      {negotiateds.length > 0 && paymentType !== null ? (
        <Button50 variant="contained" onClick={handleViewPayment}>
          Confirmar?
        </Button50>
      ) : null}

      {allValue === "Não" && paymentShapesValues !== "" ? (
        <Button50 variant="contained" onClick={handleViewPaymentWithShapes}>
          Confirmar?
        </Button50>
      ) : null}
    </Box>
  );
};

const TreatmentsChoice = styled(Button)`
  display: flex;
  align-items: center;
  column-gap: 4px;
  width: 100%;
  padding: 4px;
  border: 1.2px solid var(--dark-blue);
  margin-bottom: 8px;
`;

const CreditDivide = styled(Box)`
  display: flex;
  align-items: center;
  column-gap: 8px;
  width: 50%;
  .dropdown {
    width: 40%;
  }
`;

const Former = styled(FormControl)`
  display: flex;
  text-align: center;
  align-items: center;
  justify-content: center;
`;

const ButtonCredit = styled(IconButton)`
  background-color: var(--dark-blue);
  color: white;
  font-weight: bold;
  border-radius: 8px;
  :hover {
    background-color: var(--red);
  }
`;

export default ModalPaymentAdmin;
