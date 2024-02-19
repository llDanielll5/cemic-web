import React, { useEffect } from "react";
import { Button, Paper, Typography, styled } from "@mui/material";
import AddBoxIcon from "@mui/icons-material/AddBox";
import PaymentTypesPatient from "./payment-types";

interface AddPaymentShapeInterface {
  paymentShapes: any[];
  handleAddPaymentShape: any;
  onChangePaymentShape: (val: any) => void;
  onChangeBankCheckInfos: (v: any) => void;
}

const AddPaymentShape = (props: AddPaymentShapeInterface) => {
  const {
    paymentShapes,
    handleAddPaymentShape,
    onChangePaymentShape,
    onChangeBankCheckInfos,
  } = props;

  const handleUpdateShapes = (shape: any, index: number) => {
    const paymentShapeClone = paymentShapes;
    const indexPaymentShape = paymentShapes.findIndex((val, i) => i === index);
    paymentShapeClone[indexPaymentShape] = shape;
    onChangePaymentShape(paymentShapeClone);
  };

  const handleDeleteShape = (index: number) => {
    const filter = paymentShapes.filter((v, i) => i !== index);
    onChangePaymentShape(filter);
  };

  return (
    <Container elevation={15} sx={{ mt: 2 }}>
      <Typography variant="subtitle1">
        Adicione as formas de pagamento:
      </Typography>

      {paymentShapes.length === 0 && (
        <Typography variant="body2" textAlign="center">
          Não há formas de pagamento! Adicione no botão abaixo!
        </Typography>
      )}

      {paymentShapes.length > 0 &&
        paymentShapes.map((v: any, i: number) => (
          <PaymentTypesPatient
            key={i}
            index={i}
            onChangeShape={(shape) => handleUpdateShapes(shape, i)}
            onChangeBankCheckInformations={onChangeBankCheckInfos}
            onRemoveShape={handleDeleteShape}
          />
        ))}

      <Button
        startIcon={<AddBoxIcon />}
        variant="contained"
        onClick={handleAddPaymentShape}
        sx={{ mt: 2 }}
      >
        Formas de Pagamento
      </Button>
    </Container>
  );
};

const Container = styled(Paper)`
  display: flex;
  align-items: center;
  justify-content: center;
  justify-content: space-between;
  padding: 1rem;
  flex-direction: column;
  width: 100%;
  :hover {
    opacity: 0.8;
  }
`;

export default AddPaymentShape;
