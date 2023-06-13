/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from "react";
import uploadFile from "@/services/uploadFile";
import Loading from "@/components/loading";
import Input from "@/components/input";
import { ClientType } from "types";
import { db } from "@/services/firebase";
import { Box, styled, Typography } from "@mui/material";
import { doc, Timestamp, updateDoc } from "firebase/firestore";
import { StyledButton } from "@/components/dynamicAdminBody/receipts";
import { ProfileImage } from "@/components/dynamicProfBody/profile/styles";
import { cpfMask, nameCapitalized, phoneMask } from "@/services/services";
import { StyledTextField } from "@/components/patient/profile";

interface PreRegisterProfileProps {
  userData?: any;
}

export const chooseImgStyle: React.CSSProperties = {
  backgroundColor: "red",
  position: "absolute",
  borderRadius: "50%",
  cursor: "pointer",
  height: "80px",
  width: "80px",
  zIndex: 1000,
  opacity: 0,
  left: 0,
};

const PreRegisterProfile = (props: PreRegisterProfileProps) => {
  const { userData } = props;
  const clientRef = doc(db, "clients", userData.cpf ?? "");
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [userInformations, setUserInformations] = useState<ClientType | any>(
    {}
  );

  const handleChangeUserImage = async (img: string) => {
    await updateDoc(clientRef, { profileImage: img })
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
    const imgUpload = await uploadFile("clients", imgName, targetImg);

    if (imgUpload.state === "Success") {
      return await handleChangeUserImage(imgUpload.url);
    } else {
      return alert("Erro ao realizar upload de imagem");
    }
  };

  const handleChangeInfos = (field: string, e: any) => {
    return setUserInformations((prev: any) => ({ ...prev, [field]: e }));
  };

  const handleUpdateUser = async () => {
    const { name, cpf, phone, email } = userInformations;
    if (name === "" || cpf.length < 14 || phone.length < 14 || email === "")
      return alert("Não foi possível atualizar. Verifique os campos");

    setIsUpdating(true);
    const phoneReplaced = userInformations
      ?.phone!.replace("(", "")
      .replace(")", "")
      .replace("-", "")
      .replace(" ", "");
    const cpfReplaced = userInformations
      ?.cpf!.replace(".", "")
      .replace("-", "")
      .replace(".", "");
    const completeName = nameCapitalized(userInformations?.name);

    const data: any = {
      name: completeName,
      cpf: cpfReplaced,
      email: userInformations.email,
      phone: phoneReplaced,
      firstLetter: userInformations.name.charAt(0).toUpperCase(),
    };
    return await updateDoc(clientRef, data)
      .then(() => {
        setIsUpdating(false);
        return alert("Usuário atualizado");
      })
      .catch((err) => {
        setIsUpdating(false);
        return alert("Erro ao realizar atualização de cadastro!" + err);
      });
  };

  useEffect(() => {
    if (!userData) return;

    const getUserInformations = () => {
      setUserInformations({
        name: userData.name,
        cpf: cpfMask(userData.cpf),
        email: userData.email,
        phone: phoneMask(userData.phone),
      });
    };

    getUserInformations();
  }, [userData]);

  if (!userData) return null;
  else
    return (
      <Box width="100%" display="flex" flexDirection="column">
        {isLoading && (
          <Box sx={{ position: "fixed", left: 0, top: 0, zIndex: 2000 }}>
            <Loading message="Atualizando imagem do usuário..." />
          </Box>
        )}
        {isUpdating && (
          <Box sx={{ position: "fixed", left: 0, top: 0, zIndex: 2000 }}>
            <Loading message="Atualizando dados do usuário..." />
          </Box>
        )}

        <Text variant="bold" textAlign="center">
          Ficha do Paciente
        </Text>

        <Field>
          <ImageProfile>
            <ImageSingle>
              <input
                type="file"
                onChange={handleChangeFile}
                title="Escolher imagem"
                style={{ ...chooseImgStyle }}
              />
              <ProfileImage
                src={userData?.profileImage ?? undefined}
                alt="Image Profile"
                sx={{ width: "80px", height: "80px" }}
              >
                {!userData?.profileImage
                  ? userData?.name.charAt(0) +
                    userData?.name.split(" ")?.[1].charAt(0)
                  : undefined}
              </ProfileImage>
            </ImageSingle>
            <Typography variant="semibold">
              Toque na imagem para alterar
            </Typography>
          </ImageProfile>

          <StyledTextField
            label="Nome"
            value={userInformations?.name}
            disabled
            margin="dense"
          />
          <StyledTextField
            disabled
            label="CPF"
            margin="dense"
            value={userInformations?.cpf}
            inputProps={{ maxLength: 14 }}
            onFocus={() => handleChangeInfos("cpf", "")}
          />
          <StyledTextField
            label="Telefone"
            margin="dense"
            onChange={(e) =>
              handleChangeInfos("phone", phoneMask(e.target.value))
            }
            value={userInformations?.phone}
            inputProps={{ maxLength: 15 }}
          />
        </Field>
        <StyledButton sx={{ alignSelf: "center" }} onClick={handleUpdateUser}>
          Salvar
        </StyledButton>
      </Box>
    );
};

const Text = styled(Typography)`
  font-size: 20px;

  @media screen and (max-width: 760px) {
    font-size: 16px;
  }
`;

const Field = styled(Box)`
  border: 1.4px solid var(--dark-blue);
  border-radius: 4px;
  padding: 4px 16px;
  margin: 8px 8px;
  display: flex;
  flex-direction: column;
`;

const ImageProfile = styled(Box)`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const ImageSingle = styled(Box)`
  width: 80px;
  height: 80px;
  border-radius: 8px;
  position: relative;
  margin: 8px 0;
  cursor: pointer;
`;

export default PreRegisterProfile;
