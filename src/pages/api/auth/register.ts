"use server";

import type { NextApiRequest, NextApiResponse } from "next";
import { serverUrl } from "@/axios";
import axios, { AxiosError } from "axios";
import {
  defaultAdminPermissions,
  defaultEmployeePermissions,
} from "@/_mock/users";
import { AxiosErrorResponseData } from "@/pages/auth/register";
import { APIResponse } from "types/utils";

export default async function registerNewUser(
  req: NextApiRequest,
  res: NextApiResponse<APIResponse>
) {
  const {
    role,
    password,
    email,
    phone,
    rg,
    cpf,
    dateBorn,
    name,
    username,
    location,
    filial,
  } = req.body;

  if (
    username.length === 0 ||
    email.length === 0 ||
    password.length === 0 ||
    rg.length < 5 ||
    cpf.length === 0 ||
    location.length === 0 ||
    filial.length === 0 ||
    phone.length === 0 ||
    name.length === 0
  )
    return res.status(400).send({
      error: {
        status: 400,
        details: "Preencha todos os campos obrigatórios para o usuário!",
      },
      data: null,
    });

  await axios
    .get(
      `${serverUrl}/users?filters[$or][0][cpf][$eq]=${cpf}&filters[$or][1][rg][$eq]=${rg}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_ACCESS_KEY}`,
        },
      }
    )
    .then(({ data }) => {
      if (data.length > 0) {
        res.status(400).send({
          data: null,
          error: {
            details: "Usuário já cadastrado com este nº de CPF ou RG",
            status: 400,
          },
        });
      }
    });

  return await axios
    .post(`${serverUrl}/auth/local/register`, {
      email,
      password,
      name,
      phone,
      cpf,
      rg,
      userType: role,
      firstLetter: name.charAt(0).toUpperCase(),
      dateBorn,
      username,
      location,
      filial,
      permissions:
        role === "ADMIN" ? defaultAdminPermissions : defaultEmployeePermissions,
    })
    .then(
      ({ data, status, statusText }) => {
        return res
          .status(status)
          .send({ data, result: { details: statusText, status } });
      },
      (error: AxiosError<AxiosErrorResponseData, any>) => {
        let details = error.response?.data.error.message;

        if (details === "Email or Username are already taken") {
          details = "Email ou Nome de usuário existente!";
        }

        return res.status(500).send({
          data: null,
          error: {
            details: details as string,
            status: 500,
          },
        });
      }
    );
}
