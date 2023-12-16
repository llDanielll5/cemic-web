import { atom } from "recoil";

const LoadingServer = atom<{ isLoading?: boolean; loadingMessage?: string }>({
  key: "LoadingServer",
  default: {
    isLoading: false,
    loadingMessage: "",
  },
});

export default LoadingServer;
