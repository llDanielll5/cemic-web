import { atom } from "recoil";
import { AdminType } from "types";

const UserData = atom<AdminType | {}>({
  key: "UserData",
  default: {},
});

export default UserData;
