// contexts/KeyPressContext.tsx
import { useRouter } from "next/router";
import { createContext, useContext, useEffect } from "react";
import { toast } from "react-toastify";

interface KeyPressContextProps {
  // Pode expor alguma função ou estado se necessário no futuro
}

const KeyPressContext = createContext<KeyPressContextProps>({});

export const KeyPressProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { push } = useRouter();
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "F1") {
        e.preventDefault(); // Impede a ajuda padrão do navegador
        push("/admin/patients?new_patient=true");
        // aqui você pode abrir um modal, navegar para outra página, etc
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  return (
    <KeyPressContext.Provider value={{}}>{children}</KeyPressContext.Provider>
  );
};

// Hook para consumir o context futuramente
export const useKeyPress = () => useContext(KeyPressContext);
