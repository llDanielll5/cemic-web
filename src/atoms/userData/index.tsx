import { atom } from "recoil";
import { AdminType } from "types";

const UserData = atom<AdminType | null>({
  key: "UserData",
  default: null,
});

export default UserData;
