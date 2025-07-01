import React, { useEffect, useState } from "react";
import {
  styled,
  Paper,
  Typography,
  Divider,
  Grid,
  TextField,
  Button,
  Stack,
  MenuItem,
} from "@mui/material";
import { allAnamneseQuestions } from "types/patient";
import { getViaCepInfo } from "@/axios/viacep";
import { makeid } from "@/services/services";
import { useRecoilValue } from "recoil";
import { anamsVal } from "data";
import { Formik, FormikConfig, useFormik } from "formik";
import UserForm from "@/components/userForm";
import UserData from "@/atoms/userData";
import AnamneseForm from "@/components/admin/patient/components/anamnese-form";
import {
  getPatientWithSameCardId,
  handleCreatePatient,
} from "@/axios/admin/patients";
import * as Yup from "yup";
import CustomTextField from "@/components/customTextField";
import { getAllEnterpriseAddress } from "@/pages/auth/register";
import { EnterpriseBranches } from "types/company";

interface AnamneseProps {
  onClose: () => void;
}

const LabelBr = {
  name: "Nome Completo*",
  phone: "Telefone*",
  cpf: "CPF*",
  rg: "RG",
  dateBorn: "Data de Nascimento*",
  email: "Email*",
  cro: "CRO",
  percent: "Porcentagem",
  specialty: "Especialidade",
  filial: "Filial",
  location: "Localização",
};

const NewDentistForm = (props: AnamneseProps) => {
  const [page, setPage] = useState(0);
  const adminData: any = useRecoilValue(UserData);
  const [enterpriseBranches, setEnterpriseBranches] = useState<
    { attributes: EnterpriseBranches; id: string }[]
  >([]);

  const initialValues = {
    name: "",
    phone: "",
    cpf: "",
    rg: "",
    dateBorn: "",
    email: "",
    userType: "DENTIST",
    cro: "",
    percent: "",
    specialty: "",
    filial: "",
    location: "",

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
  };

  const validationSchema = Yup.object({
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
  });

  const handleSubmit = async (values: any, helpers: any) => {
    try {
      let partnerId: string = "";
      partnerId = makeid(13);

      return console.log({ values });

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
  };

  // const onChangeLocation = (
  //     e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  //   ) => {
  //     formik.handleChange(e);
  //     const finded = enterpriseBranches.find(
  //       (find) => find.attributes.filial === e.target.value
  //     );
  //     formik.values.location = finded?.attributes.location as string;
  //   };

  // useEffect(() => {
  //   getAllEnterpriseAddress().then((res) =>
  //     setEnterpriseBranches(res.data.data)
  //   );
  // }, []);

  // const handleGetCep = async (e: any) => {
  //   formik.setFieldValue("locationData.cep", e.target.value);
  //   let val = e.target.value;
  //   const jsonCep = await getViaCepInfo(val);
  //   if (jsonCep) {
  //     formik.setFieldValue("locationData", jsonCep);
  //   }
  // };

  return (
    <Container elevation={10}>
      <Typography variant="h5" textAlign="center" mb={2}>
        Novo Dentista
      </Typography>

      <Divider />

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ handleBlur, values, handleSubmit, setFieldValue }) => (
          <Stack gap={2}>
            <Grid container spacing={2}>
              {Object.keys(LabelBr).map((item, index) => (
                <Grid item xs={12} lg={6} md={6} sm={6} key={index}>
                  <CustomTextField
                    fullWidth
                    type={item === "dateBorn" ? "date" : undefined}
                    name={item}
                    mask={
                      item === "phone"
                        ? "phone"
                        : item === "cpf"
                        ? "cpf"
                        : undefined
                    }
                    label={(LabelBr as any)[item]}
                    onBlur={handleBlur}
                    onChange={({ target }) => setFieldValue(item, target.value)}
                    InputLabelProps={
                      item === "dateBorn" ? { shrink: true } : undefined
                    }
                    croUfAddon={item === "cro"}
                    value={(values as any)[item] as any}
                    onKeyDown={({ key }) => {
                      if (key === "Enter") return handleSubmit();
                    }}
                  >
                    {item === "filial" ? (
                      enterpriseBranches.map((option) => (
                        <MenuItem
                          key={option.attributes.filial}
                          value={option.attributes.filial}
                        >
                          {option.attributes.filial}
                        </MenuItem>
                      ))
                    ) : item === "specialty" ? (
                      <></>
                    ) : undefined}
                  </CustomTextField>
                </Grid>
              ))}
            </Grid>
            <Button type="submit" variant="contained">
              Cadastrar Dentista
            </Button>
          </Stack>
        )}
      </Formik>
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
