/* eslint-disable react-hooks/exhaustive-deps */
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getIP } from "@/services/getIp";

export const useGetIP = async () => {
  const router = useRouter();
  const [ipCEMIC, setIpCEMIC] = useState<boolean | null>(null);
  const [ipVal, setIpVal] = useState("");

  const handleGetIP = async () =>
    await getIP().then((res) => {
      if (
        res === "187.4.88.174" ||
        res === "191.56.48.3" ||
        res === "200.173.248.161"
      ) {
        return alert("igualizou");
      } else {
        return alert(res + "deu");
      }
    });

  useEffect(() => {
    handleGetIP();
  }, [ipCEMIC]);

  useEffect(() => {
    if (ipCEMIC === null) return;
    else if (!ipCEMIC)
      return alert(
        "Não possui o IP necessário" + " Seu IP é:" + ipVal + ipCEMIC
      );
    else if (ipCEMIC) return alert(" Seu IP é:" + ipVal);
  }, [ipCEMIC]);

  return;
};
