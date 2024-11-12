import React, { useState } from "react";
import {
  styled,
  Paper,
  Typography,
  Divider,
  Grid,
  TextField,
} from "@mui/material";
import { allAnamneseQuestions } from "types/patient";
import { getViaCepInfo } from "@/axios/viacep";
import { makeid } from "@/services/services";
import { useRecoilValue } from "recoil";
import { anamsVal } from "data";
import { FormikConfig, useFormik } from "formik";
import UserForm from "@/components/userForm";
import UserData from "@/atoms/userData";
import AnamneseForm from "@/components/admin/patient/components/anamnese-form";
import {
  getPatientWithSameCardId,
  handleCreatePatient,
} from "@/axios/admin/patients";
import * as Yup from "yup";

interface AnamneseProps {
  onClose: () => void;
}

const LabelBr = {
  name: "Nome Completo*",
  email: "Email*",
  phone: "Telefone*",
  cpf: "CPF*",
  rg: "RG",
  dateBorn: "Data de Nascimento*",
  cro: "CRO",
  percent: "Porcentagem",
  specialty: "Especialidade",
  location: "Localização",
  filial: "Filial",
};

const NewDentistForm = (props: AnamneseProps) => {
  const [page, setPage] = useState(0);
  const adminData: any = useRecoilValue(UserData);

  const formik = useFormik({
    initialValues: {
      userData: {
        cpf: "",
        name: "",
        phone: "",
        rg: "",
        dateBorn: "",
        email: "",
        userType: "DENTIST",
        cro: "",
        percent: "",
        specialty: "",
        filial: "",
        location: "",
      },
      //   locationData: {
      //     neighbor: "",
      //     cep: "",
      //     city: "",
      //     complement: "",
      //     line1: "",
      //     uf: "",
      //     number: "",
      //     address: "",
      //   },
      submit: null,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Nome obrigatório"),
      cpf: Yup.string().required("CPF é obrigatório"),
      phone: Yup.string().required("Telefone é obrigatório"),
      dateBorn: Yup.string().required("Insira uma data de nascimento"),
      email: Yup.string()
        .required("Email é obrigatório")
        .email("Deve conter um formato de email"),
      cro: Yup.string().required("CRO é obrigatório"),
      percent: Yup.string().required("A porcentagem do dentista é obrigatória"),
      specialty: Yup.string().required("Escolha a especialidade do dentista"),
      filial: Yup.string().required("Qual a filial o dentista trabalhará?"),
    }),
    onSubmit: async (values, helpers) => {
      try {
        let partnerId: string = "";
        partnerId = makeid(13);

        const clientData = {
          cpf: values.userData.cpf,
          name: values.userData.name,
          phone: values.userData.phone,
          rg: values.userData.rg,
          dateBorn: values.userData.dateBorn,
          email: values.userData.email,
          userType: "DENTIST",
          cro: values.userData.cro,
          percent: values.userData.percent,
          specialty: values.userData.specialty,
          filial: values.userData.filial,
          location: values.userData.location,
        };

        return await handleCreatePatient(clientData).then(
          (res: any) => {
            if (!!res.alert) return alert(res.alert ?? res.error);
            props.onClose();
          },
          (err) => console.log(err.response)
        );
      } catch (err: any) {
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }
    },
  });

  const handleGetCep = async (e: any) => {
    formik.setFieldValue("locationData.cep", e.target.value);
    let val = e.target.value;
    const jsonCep = await getViaCepInfo(val);
    if (jsonCep) {
      formik.setFieldValue("locationData", jsonCep);
    }
  };

  return (
    <Container elevation={10}>
      <Typography variant="h5" textAlign="center" mb={2}>
        Novo Dentista
      </Typography>

      <Divider />

      <Grid container spacing={2}>
        {Object.keys(LabelBr).map((item, index) => (
          <Grid item xs={12} lg={6} md={6} sm={6} key={index}>
            <TextField
              error={
                !!(
                  (formik.touched as any)[item] && (formik.errors as any)[item]
                )
              }
              fullWidth
              helperText={
                (formik.touched as any)[item] && (formik.errors as any)[item]
              }
              label={(LabelBr as any)[item]}
              name={item}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={(formik.values as any)[item] as any}
              onKeyDown={({ key }) => {
                if (key === "Enter") return formik.handleSubmit();
              }}
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

const Container = styled(Paper)`
  margin: 24px auto;
  width: 90%;
  padding: 24px 16px;
  border: 1px solid #d5d5d5;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  position: relative;

  @media screen and (max-width: 760px) {
    margin: 1rem 0.5rem;
    width: 100%;
  }
  @media screen and (max-width: 550px) {
    margin: 0;
  }
`;

export default NewDentistForm;
