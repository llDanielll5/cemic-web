"use server";

import type { NextApiRequest, NextApiResponse } from "next";
import { serverUrl } from "@/axios";
import axios, { AxiosError } from "axios";
import {
  defaultAdminPermissions,
  defaultEmployeePermissions,
} from "@/_mock/users";
import { AxiosErrorResponseData } from "@/pages/auth/register";
import { NextResponse } from "next/server";
import { APIResponse } from "types/utils";

export default async function registerNewUser(
  req: NextApiRequest,
  res: NextApiResponse<APIResponse>
) {
  const { email, password } = req.body;
}
