import React, { useState, useEffect } from "react";
import { Box, Typography, Autocomplete, TextField } from "@mui/material";
import { Timestamp, doc, updateDoc } from "firebase/firestore";
// import { chooseImgStyle } from "@/components/pre-register/profile";
import { db } from "@/services/firebase";
import Input from "@/components/input";
import Loading from "@/components/loading";
import uploadFile from "@/services/uploadFile";
import SaveIcon from "@mui/icons-material/Save";
import { StyledButton } from "@/components/dynamicAdminBody/receipts";
import { cpfMask, phoneMask } from "@/services/services";
import { specialties } from "data";
import * as S from "./styles";

interface ProfileProfessionalProps {
  userData?: any;
}

interface UserInformations {
  name: string;
  phone: string;
  cro: string;
  cpf: string;
  rg: string;
  specialty: string;
}

const ProfileProfessional = (props: ProfileProfessionalProps) => {
  const { userData } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [userInformations, setUserInformations] = useState<UserInformations>();
  const hasId = userData?.id ?? "";

  const handleChangeInfos = (field: string, e: any) => {
    return setUserInformations((prev: any) => ({ ...prev, [field]: e }));
  };

  const handleChangeUserImage = async (img: string) => {
    const professionalRef = doc(db, "professionals", hasId);
    await updateDoc(professionalRef, { profileImage: img })
      .then(() => {
        setIsLoading(false);
        return alert("Imagem do usuário atualizada.");
      })
      .catch((err) => {
        setIsLoading(false);
        return alert("Erro ao atualizar imagem do usuário");
      });
  };

  const handleChangeFile = async (e: any) => {
    setIsLoading(true);
    const targetImg = e.target.files[0];
    const timestamp = Timestamp.now().seconds;
    const imgName = `${userData?.id}-${timestamp}`;
    const imgUpload = await uploadFile("professionals", imgName, targetImg);

    if (imgUpload.state === "Success") {
      return await handleChangeUserImage(imgUpload.url);
    } else {
      return alert("Erro ao realizar upload de imagem");
    }
  };

  const handleUpdateUser = async () => {
    const professionalRef = doc(db, "professionals", hasId);
    if (
      userInformations?.name === "" ||
      userInformations!.cpf.length < 14 ||
      userInformations!.phone.length < 14 ||
      userInformations?.cro === "" ||
      userInformations?.rg === "" ||
      userInformations?.specialty === ""
    )
      return alert("Não foi possível atualizar. Verifique os campos");

    setIsLoading(true);
    const phoneReplaced = userInformations
      ?.phone!.replace("(", "")
      .replace(")", "")
      .replace("-", "")
      .replace(" ", "");
    const cpfReplaced = userInformations
      ?.cpf!.replace(".", "")
      .replace("-", "")
      .replace(".", "");
    const data: any = {
      name: userInformations?.name,
      cpf: cpfReplaced,
      cro: userInformations?.cro,
      rg: userInformations?.rg,
      specialty: userInformations?.specialty,
      phone: phoneReplaced,
      firstLetter: userInformations?.name.charAt(0).toUpperCase(),
    };
    return await updateDoc(professionalRef, data)
      .then(() => {
        setIsLoading(false);
        return alert("Usuário atualizado");
      })
      .catch((err) => {
        setIsLoading(false);
        return alert("Erro ao realizar atualização de cadastro!");
      });
  };

  useEffect(() => {
    if (!userData) return;

    const getUserInformations = () => {
      setUserInformations({
        name: userData.name,
        cpf: cpfMask(userData.cpf),
        cro: userData?.cro,
        rg: userData?.rg,
        specialty: userData?.specialty,
        phone: phoneMask(userData.phone),
      });
    };

    getUserInformations();
  }, [userData]);

  const getSpecialty =
    userInformations?.specialty === "implant"
      ? "Implante"
      : userInformations?.specialty === "ortho"
      ? "Ortodontia"
      : userInformations?.specialty === "prosthesis"
      ? "Próteses"
      : "Clínico Geral";

  if (!userInformations?.name)
    return (
      <Box position="fixed" left={0} top={0}>
        <Box sx={{ position: "absolute", left: 0, top: 0 }}>
          <Loading message="Carregando informações do profissional..." />
        </Box>
      </Box>
    );

  if (isLoading)
    return (
      <Box position="fixed" left={0} top={0}>
        <Box sx={{ position: "absolute", left: 0, top: 0 }}>
          <Loading message="Atualizando usuário..." />
        </Box>
      </Box>
    );

  return (
    <S.Container>
      <S.Title variant="subtitle1">Seus Dados</S.Title>

      <S.Form>
        <S.FieldForm>
          <S.AvatarContainer>
            <S.ProfileImage src={userData?.profileImage ?? undefined}>
              {!userData?.profileImage ? userData?.name?.charAt(0) : undefined}
              <input
                type="file"
                onChange={handleChangeFile}
                title="Escolher imagem"
                // style={{ ...chooseImgStyle }}
              />
            </S.ProfileImage>
          </S.AvatarContainer>
          <Typography
            variant="body2"
            textAlign="center"
            py={1}
            fontWeight={500}
          >
            Toque na imagem para alterar
          </Typography>

          <Box px={2}>
            <TextField
              label="Nome Completo"
              value={userInformations?.name}
              onChange={(e) => handleChangeInfos("name", e)}
              disabled
              sx={{ width: "100%" }}
              margin="dense"
            />
            <S.DoubleInputs>
              <TextField
                label="CPF"
                onChange={(e) =>
                  handleChangeInfos("cpf", cpfMask(e.target.value))
                }
                inputProps={{ maxLength: 14 }}
                value={userInformations?.cpf}
                sx={{ width: "100%" }}
                margin="dense"
              />
              <TextField
                label="RG"
                value={userInformations?.rg}
                onChange={(e) => handleChangeInfos("rg", e.target.value)}
                sx={{ width: "100%" }}
                margin="dense"
              />
            </S.DoubleInputs>
            <S.DoubleInputs>
              <TextField
                label="CRO"
                value={userInformations?.cro}
                onChange={(e) => handleChangeInfos("cro", e.target.value)}
                sx={{ width: "100%" }}
                margin="dense"
              />
              <TextField
                label="Telefone"
                value={userInformations?.phone}
                onChange={(e) =>
                  handleChangeInfos("phone", phoneMask(e.target.value))
                }
                inputProps={{ maxLength: 14 }}
                sx={{ width: "100%" }}
                margin="dense"
              />
            </S.DoubleInputs>

            <S.DoubleInputs>
              <Autocomplete
                disablePortal
                options={specialties}
                value={{
                  label: getSpecialty,
                  option: userInformations.specialty,
                }}
                isOptionEqualToValue={(option, value) =>
                  option.option === value.option
                }
                sx={{ width: "100%" }}
                onChange={(e, v) => handleChangeInfos("specialty", v?.option)}
                renderInput={(params) => (
                  <S.OptionsSpecialties
                    {...params}
                    label="Especialidade"
                    color="info"
                  />
                )}
              />
              <TextField
                value={userData?.id}
                disabled
                variant="outlined"
                label="ID Dentista"
              />
            </S.DoubleInputs>
          </Box>
        </S.FieldForm>

        <Box display="flex" width="100%" justifyContent="center">
          <StyledButton onClick={handleUpdateUser} endIcon={<SaveIcon />}>
            Salvar
          </StyledButton>
        </Box>
      </S.Form>
    </S.Container>
  );
};

export default ProfileProfessional;
