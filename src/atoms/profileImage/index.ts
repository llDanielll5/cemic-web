import { atom } from "recoil";

interface ProfileImageType {
  url: string;
  file: File;
  data: any;
}

const ProfileImage = atom<ProfileImageType | null>({
  key: "ProfileImage",
  default: null,
});

export default ProfileImage;
