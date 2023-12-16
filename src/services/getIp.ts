export const getIP = async () => {
  const response = await fetch("https://api.ipify.org?format=json")
    .then((response) => response.json())
    .then((data) => data)
    .catch((error) => {});
  return response.ip;
};
