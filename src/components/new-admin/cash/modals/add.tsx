import React, { useState } from "react";
import CModal from "@/components/modal";
import { Box, Button, TextField, Typography, styled } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { maskValue, phoneMask } from "@/services/services";

const AddCashModal = (props: any) => {
  const { closeModal, visible, formik, onSubmit } = props;

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

      <TextField
        error={!!(formik.touched.out && formik.errors.out)}
        fullWidth
        helperText={formik.touched.out && formik.errors.out}
        label="Saída"
        name="out"
        onBlur={formik.handleBlur}
        onChange={({ target }) =>
          formik.setFieldValue("out", maskValue(target.value))
        }
        value={formik.values.out}
        margin="dense"
      />

      {/* <Paper sx={{ width: "100%", my: 2, p: 2 }} elevation={10}>
        <Typography variant="subtitle1">Escolha o tipo de Caixa</Typography>
        <Stack
          direction={"row"}
          alignItems="center"
          justifyContent="space-between"
          columnGap={2}
        >
          <Button
            variant="contained"
            sx={{ width: "35%" }}
            onClick={() => setDateSelectedModal(true)}
          >
            Selecionar Data
          </Button>
        </Stack>
      </Paper> */}

      <Box width="100%" display="flex" justifyContent={"center"} mt={2}>
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
