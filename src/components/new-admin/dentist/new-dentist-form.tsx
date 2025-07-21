import React, { useEffect, useState } from "react";
import {
  styled,
  Paper,
  Typography,
  Divider,
  Grid,
  Button,
  Stack,
  MenuItem,
} from "@mui/material";
import { makeid } from "@/services/services";
import { useRecoilValue } from "recoil";
import { Formik, FormikHelpers } from "formik";
import { getAllEnterpriseAddress } from "@/pages/auth/register";
import { EnterpriseBranches } from "types/company";
import { DENTIST_SPECIALTIES_LABELS } from "@/utils/dentists";
import { AdminType, UserRole } from "types";
import { unmaskText } from "@/utils";
import { createNewDentist } from "@/axios/admin/dentists";
import UserData from "@/atoms/userData";
import * as Yup from "yup";
import CustomTextField from "@/components/customTextField";
import axiosInstance, { serverUrl } from "@/axios";
import { UserPermissionsJsonInterface } from "types/admin";
import { defaultDentistPermissions } from "@/_mock/users";
import { toast } from "react-toastify";
import axios from "axios";

interface AnamneseProps {
  onClose: () => void;
}

interface RegisterNewUser {
  email: string;
  password: string;
  name: string;
  phone: string;
  cpf: string;
  rg: string;
  userType: UserRole;
  firstLetter: string;
  dateBorn: string;
  username: string;
  location: string;
  filial: string;
  permissions: UserPermissionsJsonInterface;
}

const formFields = [
  "name",
  "phone",
  "cpf",
  "rg",
  "dateBorn",
  "email",
  "cro",
  "percent",
  "specialty",
  "filial",
] as const;
interface ProfessionalSubmitValues {
  name: string;
  phone: string;
  cpf: string;
  rg: string;
  dateBorn: string;
  email: string;
  userType: UserRole;
  cro: string;
  percent: string;
  specialty: DENTIST_SPECIALTIES;
  filial: string;
  location?: string;
}

type ProfessionalField = (typeof formFields)[number];
// type ProfessionalValuesType = keyof typeof initialValues;

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
};

const NewDentistForm = (props: AnamneseProps) => {
  const [page, setPage] = useState(0);
  const adminData: any = useRecoilValue(UserData);
  const [enterpriseBranches, setEnterpriseBranches] = useState<
    { attributes: EnterpriseBranches; id: string }[]
  >([]);

  const initialValues: ProfessionalSubmitValues = {
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
    rg: Yup.string().optional(),
  });

  const handleSubmit = async (
    values: ProfessionalSubmitValues,
    helpers: FormikHelpers<ProfessionalSubmitValues>
  ) => {
    try {
      let partnerId: string = "";
      partnerId = makeid(13);

      const location = enterpriseBranches.find(
        (t: any) => t.attributes.filial === values.filial
      )?.attributes?.location;

      const formikData = {
        cpf: unmaskText(values.cpf),
        name: values.name,
        phone: unmaskText(values.phone),
        rg: values.rg,
        dateBorn: values.dateBorn,
        email: values.email,
        userType: "DENTIST" as UserRole,
        cro: values.cro,
        percent: values.percent,
        specialty: values.specialty,
        filial: values.filial,
        location,
      };

      const {
        cpf,
        cro,
        dateBorn,
        email,
        filial,
        name,
        percent,
        phone,
        rg,
        specialty,
        userType,
      } = formikData;

      const dentistData = {
        cro,
        percent,
        specialty,
      };

      const userData: RegisterNewUser = {
        email,
        password: "cemic123",
        name,
        phone,
        cpf,
        rg,
        userType,
        firstLetter: name.charAt(0).toUpperCase(),
        dateBorn,
        username: name.replaceAll(" ", "-").toLowerCase() + "-" + makeid(4),
        location: location as string,
        filial,
        permissions: defaultDentistPermissions,
      };

      const { data }: { data: { jwt: string; user: Partial<AdminType> } } =
        await axios.post(`${serverUrl}/api/auth/local/register`, userData);

      const userId = data?.user?.id;

      const { data: axiosData } = await createNewDentist({
        user: userId,
        ...dentistData,
      });

      if (!!axiosData.alert)
        return toast.error(axiosData.alert ?? axiosData?.error);

      toast.success("Dentista cadastrado com sucesso!");
      props.onClose();
    } catch (error: any) {
      console.log({ error: error?.response ?? error });
      toast.error(
        error?.alert ??
          error?.response?.error ??
          error?.response?.alert ??
          "Erro ao cadastrar novo Dentista"
      );
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

  useEffect(() => {
    getAllEnterpriseAddress().then((res) =>
      setEnterpriseBranches(res.data.data)
    );
  }, []);

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
        {({ handleBlur, values, handleSubmit: EnterSubmit, setFieldValue }) => (
          <Stack gap={2}>
            <Grid container spacing={2}>
              {formFields.map((item, index) => (
                <Grid item xs={12} lg={6} md={6} sm={6} key={index}>
                  <CustomTextField
                    fullWidth
                    select={item === "filial" || item === "specialty"}
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
                    value={values[item]}
                    onKeyDown={({ key }) => {
                      if (key === "Enter") return EnterSubmit();
                    }}
                  >
                    {item === "filial"
                      ? enterpriseBranches.map((option, i) => (
                          <MenuItem key={i} value={option.attributes.filial}>
                            {option.attributes.filial}
                          </MenuItem>
                        ))
                      : item === "specialty"
                      ? Object.keys(DENTIST_SPECIALTIES_LABELS).map(
                          (spec, index) => (
                            <MenuItem key={index} value={spec}>
                              {
                                DENTIST_SPECIALTIES_LABELS[
                                  spec as DENTIST_SPECIALTIES
                                ]
                              }
                            </MenuItem>
                          )
                        )
                      : undefined}
                  </CustomTextField>
                </Grid>
              ))}
            </Grid>

            <Button
              onClick={(e) => {
                e.preventDefault();
                EnterSubmit();
              }}
              variant="contained"
            >
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
