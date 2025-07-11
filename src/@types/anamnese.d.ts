type allAnamneseQuestions =
  | "Está tomando alguma medicação no momento?"
  | "Sofre ou sofreu de algum problema no coração?"
  | "É diabético?"
  | "Possui dificuldade de cicatrização?"
  | "Tem ou teve alguma doença nos rins ou fígado?"
  | "Sofre de epilepsia?"
  | "Já esteve hospitalizado por algum motivo?"
  | "Tem anemia?"
  | "É alérgico a algum medicamento?"
  | "Já teve algum problema com anestésicos?"
  | "Tem ansiedade?"
  | "Faz uso de AAS?"
  | "É fumante?"
  | "Consome bebidas alcoólicas?"
  | "É Hipertenso?"
  | "Está gravida?";

type AnamneseQuestions = Record<allAnamneseQuestions, AnswerType>;
