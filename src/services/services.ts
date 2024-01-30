import { UserRole } from "types";

export function makeid(length: number) {
  let result = "";
  const characters = "0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

export const parseDateBr = (date: string) => {
  const [d, m, y] = date.split("/");
  let month = "";
  switch (m) {
    case "01":
      month = "Janeiro";
      break;
    case "02":
      month = "Fevereiro";
      break;
    case "03":
      month = "Março";
      break;
    case "04":
      month = "Abril";
      break;
    case "05":
      month = "Maio";
      break;
    case "06":
      month = "Junho";
      break;
    case "07":
      month = "Julho";
      break;
    case "08":
      month = "Agosto";
      break;
    case "09":
      month = "Setembro";
      break;
    case "10":
      month = "Outubro";
      break;
    case "11":
      month = "Novembro";
      break;
    case "12":
      month = "Dezembro";
      break;
  }

  return `${d} de ${month} de ${y}`;
};

export const phoneMask = (phone: string): string => {
  if (phone === "") return "";
  const phoneReplaced: string = phone
    ?.replace(/\D/g, "")
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d{4})/, "$1-$2");

  return phoneReplaced;
};

export const cpfMask = (cpf?: string) => {
  if (cpf === "") return "Sem CPF Cadastrado";
  if (!cpf) return "Sem CPF Cadastrado";

  cpf = cpf.replace(/\D/g, "");
  cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
  cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
  cpf = cpf.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  return cpf;
};

export const parseDateIso = (date?: string) => {
  if (date === "") return "Sem Data";
  if (!date) return "Sem Data";

  const [y, m, d] = date.split("-");
  return `${d}/${m}/${y}`;
};

export function maskValue(value: string) {
  const val = value.replace(/[\D]+/g, "");
  var tmp = val + "";
  tmp = tmp.replace(/([0-9]{2})$/g, ",$1");
  if (tmp.length > 6) tmp = tmp.replace(/([0-9]{3}),([0-9]{2}$)/g, ".$1,$2");
  return tmp;
}

export const defaultImage =
  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";

export const getImage = (img: string) => {
  if (img) return img;
  else return defaultImage;
};

export const getDayWeekString = (d: number) => {
  switch (d) {
    case 0:
      return "Domingo";
    case 1:
      return "Segunda";
    case 2:
      return "Terça";
    case 3:
      return "Quarta";
    case 4:
      return "Quinta";
    case 5:
      return "Sexta";
    case 6:
      return "Sábado";
  }
};

export const baseCode = "cemic123";

export const nameCapitalized = (name: string) => {
  const arrStr = name.split(" ");
  const capitalizeds = arrStr.map((v) => {
    const char = v.charAt(0);
    const rest = v.slice(1);

    return `${char.toUpperCase()}${rest.toLowerCase()}`;
  });

  const completeName = capitalizeds.join(" ");
  return completeName;
};

export const getCreditDiscount = (creditVal: number) => {
  let discount = (creditVal * 10) / 100;
  let discounted = creditVal - discount;
  return discounted.toFixed(2);
};

export const getUserTypeRole = (role: UserRole) => {
  if (role === "ADMIN") return "Administrador";
  if (role === "DENTIST") return "Dentista";
  if (role === "EMPLOYEE") return "Funcionário";
  return "Protético";
};

export const defaultErrorFunction = (err: any, setLoading: any) => {
  setLoading({ isLoading: false, loadingMessage: "" });
  if (err.response) console.log(err.response.data.error.details);
};
