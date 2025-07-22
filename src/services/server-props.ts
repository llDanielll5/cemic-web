import { getCookie } from "cookies-next";
import { GetServerSidePropsContext } from "next";

export const contextUserAdmin = (context: GetServerSidePropsContext) => {
  const jwt = getCookie("jwt", { req: context.req, res: context.res }) as
    | string
    | undefined;
  const user = getCookie("user", { req: context.req, res: context.res }) as
    | string
    | undefined;

  let userJson: AdminType | null = null;
  try {
    if (user) {
      userJson = JSON.parse(user);
    }
  } catch (err) {
    console.warn("Erro ao fazer parse do user cookie:", err);
  }

  const jwtHeader = {
    headers: {
      ...(jwt ? { Authorization: `Bearer ${jwt}` } : {}),
    },
  };

  return { jwtHeader, userJson };
};
