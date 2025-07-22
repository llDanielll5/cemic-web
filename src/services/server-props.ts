import { getCookie } from "cookies-next";
import { GetServerSidePropsContext } from "next";

export const contextUserAdmin = (context: GetServerSidePropsContext) => {
  const jwt = getCookie("jwt", { req: context.req, res: context.res });
  const userCookie = getCookie("user", { req: context.req, res: context.res });

  let userJson: AdminType | null = null;

  try {
    userJson = userCookie ? JSON.parse(userCookie as string) : null;
  } catch (error) {
    console.warn("Erro ao parsear user do cookie:", error);
  }

  const jwtHeader = {
    headers: {
      ...(jwt && { Authorization: `Bearer ${jwt}` }),
    },
  };

  return { jwtHeader, userJson };
};
