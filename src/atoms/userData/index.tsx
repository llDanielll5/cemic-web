import { atom } from "recoil";
import { ClientType } from "types";

const UserData = atom<ClientType | {}>({
  key: "UserData",
  default: {},
});

export default UserData;
