export const unmaskText = (text: string) => {
  return text?.replace(/\D/g, "");
};

export const someArrValues: (arr: any[]) => number = (arr: any[]) => {
  return arr.reduce((prev, curr) => prev + curr, 0) as number;
};

export const CEMIC_FILIALS = ["Brasilia-DF", "Uberlandia-MG"];
