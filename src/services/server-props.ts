import { getCookie } from "cookies-next";
import { GetServerSidePropsContext } from "next";

export const contextUserAdmin = (context: GetServerSidePropsContext) => {
  const jwt = context
    ? getCookie("jwt", { req: context.req, res: context.res })
    : undefined;

  const user = context
    ? getCookie("user", { req: context.req, res: context.res })
    : undefined;

  const userJson: AdminType = JSON.parse(user as string);
  const jwtHeader = {
    headers: {
      ...(jwt && { Authorization: `Bearer ${jwt}` }),
    },
  };

  return { jwtHeader, userJson };
};
