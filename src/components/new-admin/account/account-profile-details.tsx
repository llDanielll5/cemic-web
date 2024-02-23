import { useCallback, useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  Unstable_Grid2 as Grid,
} from "@mui/material";
import { useRecoilState } from "recoil";
import UserData from "@/atoms/userData";
import { cpfMask, phoneMask } from "@/services/services";
import { handleUpdateUser, uploadFile } from "@/axios/admin/profileDetails";
import ProfileImage from "@/atoms/profileImage";

const states = [
  {
    value: "brasilia",
    label: "Brasilia-DF",
  },
];

export const AccountProfileDetails = () => {
  const [userData, setUserData]: any = useRecoilState(UserData);
  const [profileImage, setProfileImage] = useRecoilState(ProfileImage);
  const [values, setValues] = useState({
    name: userData?.name,
    email: userData?.email,
    phone: phoneMask(userData?.phone),
    cpf: cpfMask(userData?.cpf),
    state: "brasilia",
    rg: userData?.rg,
  });

  const handleChange = (e: any) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    if (!values.cpf) return alert("Preencha o campo CPF");
    if (!values.name) return alert("Preencha o campo Nome");
    if (!values.email) return alert("Preencha o campo Email");
    if (!values.state) return alert("Preencha o campo Estado");

    const uploadResult = profileImage
      ? await uploadFile(profileImage.data, profileImage.file.type)
      : undefined;

    const image = uploadResult?.data[0] ?? userData.profileImage;

    const userID = userData!.id;

    const updateData = {
      profileImage: image?.id,
      name: values.name,
      cpf: values.cpf,
      phone: values.phone,
      email: values.email,
    };

    await handleUpdateUser(userID, updateData)
      .then((e) => {
        setUserData((e: any) => ({
          ...e,
          ...values,
          profileImage: image,
        }));
        console.log({ success: e.data });
        alert("Dados foram salvos com sucesso");
      })
      .catch((e) => {
        console.log("err: ", e);
        alert("Ocorreu algum erro!");
      });
  };

  useEffect(() => {
    setValues((prev) => ({
      name: userData?.name,
      email: userData?.email,
      phone: phoneMask(userData?.phone),
      cpf: cpfMask(userData?.cpf),
      state: "brasilia",
      rg: userData?.rg,
    }));
  }, [userData]);

  return (
    <form autoComplete="off" noValidate onSubmit={handleSubmit}>
      <Card>
        <CardHeader
          subheader="Você pode alterar suas informações!"
          title="Perfil"
        />
        <CardContent sx={{ pt: 0 }}>
          <Box sx={{ m: -1.5 }}>
            <Grid container spacing={3}>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  helperText="Esclareça seu nome Completo!"
                  label="Nome Completo!"
                  name="name"
                  onChange={handleChange}
                  required
                  value={values.name}
                  error={!values.name}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  onChange={handleChange}
                  required
                  value={values.email}
                  error={!values.email}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="CPF"
                  name="cpf"
                  onChange={handleChange}
                  required
                  value={cpfMask(values.cpf)}
                  error={!values.cpf}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phone"
                  onChange={handleChange}
                  value={phoneMask(values.phone)}
                />
              </Grid>
              {/* <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Country"
                  name="country"
                  onChange={handleChange}
                  required
                  value={values.country}
                />
              </Grid> */}
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Select State"
                  name="state"
                  onChange={handleChange}
                  required
                  select
                  SelectProps={{ native: true }}
                  value={values.state}
                  error={!values.state}
                >
                  {states.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: "flex-end" }}>
          <Button variant="contained" type="submit">
            Salvar
          </Button>
        </CardActions>
      </Card>
    </form>
  );
};
