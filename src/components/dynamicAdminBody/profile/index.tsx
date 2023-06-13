//@ts-nocheck
import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { Timestamp, doc, updateDoc } from "firebase/firestore";
import { chooseImgStyle } from "@/components/pre-register/profile";
import { db } from "@/services/firebase";
import Input from "@/components/input";
import Loading from "@/components/loading";
import uploadFile from "@/services/uploadFile";
import SaveIcon from "@mui/icons-material/Save";
import { StyledButton } from "@/components/dynamicAdminBody/receipts";
import { cpfMask, phoneMask } from "@/services/services";
import * as S from "../../dynamicProfBody/profile/styles";
import { useRecoilValue, useSetRecoilState } from "recoil";
import UserData from "@/atoms/userData";

interface ProfileAdminProps {}

interface UserInformations {
  name: string;
  cpf: string;
  rg: string;
  dateBorn: string;
  phone: string;
}

const ProfileAdmin = (props: ProfileAdminProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [userInformations, setUserInformations] = useState<UserInformations>();
  const userData = useRecoilValue(UserData);
  const setUserData = useSetRecoilState(UserData);

  const handleChangeInfos = (field: string, e: any) => {
    return setUserInformations((prev: any) => ({ ...prev, [field]: e }));
  };

  const handleChangeUserImage = async (img: string) => {
    const adminRef = doc(db, "admins", userData!.cpf);
    await updateDoc(adminRef, { profileImage: img })
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
    const imgName = `${userData!.id}-${timestamp}`;
    const imgUpload = await uploadFile("admins", imgName, targetImg);

    if (imgUpload.state === "Success") {
      return await handleChangeUserImage(imgUpload.url);
    } else {
      return alert("Erro ao realizar upload de imagem");
    }
  };

  const handleUpdateUser = async () => {
    const adminRef = doc(db, "admins", userData!.id);
    if (
      userInformations?.name === "" ||
      userInformations!.cpf.length < 14 ||
      userInformations!.phone.length < 14 ||
      userInformations?.rg === "" ||
      userInformations?.dateBorn === ""
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
      rg: userInformations?.rg,
      dateBorn: userInformations?.dateBorn,
      phone: phoneReplaced,
      firstLetter: userInformations?.name.charAt(0).toUpperCase(),
    };
    return await updateDoc(adminRef, data)
      .then(() => {
        setIsLoading(false);
        setUserData((prev) => ({ ...prev, ...userInformations }));
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
        dateBorn: userData?.dateBorn ?? "",
        rg: userData?.rg,
        phone: phoneMask(userData.phone),
      });
    };

    getUserInformations();
  }, [userData]);

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
      <S.Title variant="bold">Seus Dados</S.Title>

      <S.Form>
        <S.FieldForm>
          <S.AvatarContainer>
            <S.ProfileImage src={userData?.profileImage ?? undefined}>
              {!userData?.profileImage ? userData?.name?.charAt(0) : undefined}
              <input
                type="file"
                onChange={handleChangeFile}
                title="Escolher imagem"
                style={{ ...chooseImgStyle }}
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
            <Input
              label="Nome Completo"
              value={userInformations?.name}
              onChange={(e) => handleChangeInfos("name", e)}
            />
            <S.DoubleInputs>
              <Input
                label="CPF"
                onChange={(e) => handleChangeInfos("cpf", cpfMask(e))}
                maxLenght={14}
                value={userInformations?.cpf}
              />
              <Input
                label="RG"
                value={userInformations?.rg}
                onChange={(e) => handleChangeInfos("rg", e)}
              />
            </S.DoubleInputs>
            <S.DoubleInputs>
              <Input
                label="Data Nascimento"
                value={userInformations?.dateBorn}
                onChange={(e) => handleChangeInfos("dateBorn", e)}
                type="date"
              />
              <Input
                label="Telefone"
                value={userInformations?.phone}
                onChange={(e) => handleChangeInfos("phone", phoneMask(e))}
                maxLenght={14}
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

export default ProfileAdmin;
