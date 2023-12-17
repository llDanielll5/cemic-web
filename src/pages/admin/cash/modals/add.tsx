//@ts-nocheck
import React from "react";
import CModal from "@/components/modal";
import { Box, Button, TextField, Typography, styled } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

const AddCashModal = (props: any) => {
  const { closeModal, visible, formik } = props;
  return (
    <CModal closeModal={closeModal} visible={visible} styles={{ width: "80%" }}>
      <Typography variant="h6" mb={1}>
        Adicionar informações
      </Typography>

      <TextField
        error={!!(formik.touched.name && formik.errors.name)}
        fullWidth
        margin="dense"
        helperText={formik.touched.name && formik.errors.name}
        label="Nome"
        name="name"
        onBlur={formik.handleBlur}
        onChange={formik.handleChange}
        value={formik.values.name}
        onKeyDown={({ key }) => {
          if (key === "Enter") return formik.handleSubmit();
        }}
      />

      <TextField
        error={!!(formik.touched.description && formik.errors.description)}
        fullWidth
        helperText={formik.touched.description && formik.errors.description}
        label="Descrição"
        name="description"
        onBlur={formik.handleBlur}
        onChange={formik.handleChange}
        value={formik.values.description}
        multiline
        rows={5}
      />
      <DoubleInputs>
        <TextField
          type="number"
          error={!!(formik.touched.cashIn && formik.errors.cashIn)}
          fullWidth
          helperText={formik.touched.cashIn && formik.errors.cashIn}
          label="Entrada A Vista"
          name="cashIn"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          value={formik.values.cashIn}
        />
        <TextField
          type="number"
          error={!!(formik.touched.cardIn && formik.errors.cardIn)}
          fullWidth
          helperText={formik.touched.cardIn && formik.errors.cardIn}
          label="Entrada Débito"
          name="cardIn"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          value={formik.values.cardIn}
        />
        <TextField
          type="number"
          error={!!(formik.touched.creditIn && formik.errors.creditIn)}
          fullWidth
          helperText={formik.touched.creditIn && formik.errors.creditIn}
          label="Entrada Crédito"
          name="creditIn"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          value={formik.values.creditIn}
        />
        <TextField
          type="number"
          error={!!(formik.touched.pix && formik.errors.pix)}
          fullWidth
          helperText={formik.touched.pix && formik.errors.pix}
          label="Entrada Pix"
          name="pix"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          value={formik.values.pix}
        />
        <TextField
          type="number"
          error={!!(formik.touched.out && formik.errors.out)}
          fullWidth
          helperText={formik.touched.out && formik.errors.out}
          label="Saída"
          name="out"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          value={formik.values.out}
        />
      </DoubleInputs>

      <Box width="100%" display="flex" justifyContent={"center"}>
        <Button
          variant="contained"
          fullWidth
          endIcon={<AddIcon />}
          onClick={formik.handleSubmit}
        >
          Lançar
        </Button>
      </Box>
    </CModal>
  );
};

const DoubleInputs = styled(Box)`
  display: flex;
  width: 100%;
  justify-content: space-between;
  column-gap: 1rem;
  padding: 1rem 0;
`;

export default AddCashModal;
