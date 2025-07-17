import { CircularProgress, Stack, Typography } from "@mui/material";
import { createContext, useContext, useState } from "react";

interface LoadingProps {
  handleLoading: (b: boolean, m?: string) => void;
}

const LoadingContext = createContext<LoadingProps>({} as LoadingProps);

export const LoadingProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLoading = (isLoading: boolean, message?: string) => {
    setIsLoading(isLoading);
    setMessage(message ?? "");
  };

  return (
    <LoadingContext.Provider value={{ handleLoading }}>
      {isLoading && (
        <Stack
          position={"fixed"}
          zIndex={999999}
          height={"100vh"}
          width={"100vw"}
          alignItems={"center"}
          justifyContent={"center"}
          bgcolor={"rgba(0,0,0,0.2)"}
        >
          <CircularProgress size={50} color="primary" />
          <Typography color="primary" sx={{ fontSize: "18px", mt: "8px" }}>
            {message}
          </Typography>
        </Stack>
      )}

      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  return context;
};
