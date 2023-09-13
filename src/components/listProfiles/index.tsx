/* eslint-disable @next/next/no-img-element */
import React from "react";
import styles from "../../styles/Admin.module.css";
import { Avatar, Box, styled, Typography } from "@mui/material";
import { defaultImage, getImage } from "@/services/services";

interface BasicProfiles {
  name: string;
  profileImage: string;
  phone: string;
  cpf: string;
  type?: string;
  role?: string;
  id: string;
}

interface ListProfilesProps {
  notHaveMessage: string;
  profiles: BasicProfiles[];
  setClientID: (e: string) => void;
  setClientDetailsVisible: (e: boolean) => void;
}

const ListProfiles = (props: ListProfilesProps) => {
  const getClientDetails = (item: any) => {
    props.setClientID(item?.id);
    props.setClientDetailsVisible(true);
    return;
  };
  const getCpfReplaced = (cpf: string) => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, "$1.$2.$3-$4");
  };
  const getPatientRole = (item: any) => {
    if (item?.role === "patient") return <Patient>Paciente</Patient>;
    else if (item?.role === "pre-register")
      return <NotPatient>Não-Paciente</NotPatient>;
    else return <Selected>Selecionado</Selected>;
  };

  return (
    <UserContainer>
      {props.profiles.length === 0 ? (
        <Typography variant="bold">{props.notHaveMessage}</Typography>
      ) : (
        props.profiles.map((item, index) => (
          <AvatarContainer key={index} onClick={() => getClientDetails(item)}>
            <UserImage src={getImage(item.profileImage)} alt="" />
            <AvatarContent>
              <span className={styles.name}>Nome: {item.name}</span>
              <p className={styles.cpf}>CPF: {getCpfReplaced(item.cpf)}</p>
            </AvatarContent>
            <RoleCard>{getPatientRole(item)}</RoleCard>
          </AvatarContainer>
        ))
      )}
    </UserContainer>
  );
};

const UserContainer = styled(Box)`
  padding: 8px;
  margin: 16px 0;
  border-radius: 8px;
  background-color: white;
  box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.14);
`;
const AvatarContainer = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 2px solid #ccc;
  column-gap: 8px;
  cursor: pointer;
  width: 100%;
  padding: 8px 0;
  :last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
  @media screen and (max-width: 400px) {
    flex-direction: column;
  }
`;
const UserImage = styled(Avatar)`
  @media screen and (max-width: 500px) {
    display: none;
  }
`;
const AvatarContent = styled(Box)`
  display: flex;
  flex-direction: column;
  width: 50%;
  @media screen and (max-width: 500px) {
    width: 70%;
  }
  @media screen and (max-width: 400px) {
    width: 100%;
    margin-bottom: 8px;
  }
`;
const RoleCard = styled(Box)`
  color: var(--dark-blue);
  width: fit-content;
`;
const Patient = styled(Typography)`
  background-color: green;
  color: white;
  padding: 2px 4px;
  border-radius: 4px;
  font-size: 0.8rem;
`;
const NotPatient = styled(Typography)`
  background-color: var(--red);
  color: white;
  padding: 2px 4px;
  border-radius: 4px;
  font-size: 0.8rem;
`;
const Selected = styled(Typography)`
  background-color: goldenrod;
  color: white;
  padding: 2px 4px;
  border-radius: 4px;
  font-size: 0.8rem;
`;

export default ListProfiles;
