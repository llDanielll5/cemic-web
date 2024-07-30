export type EnterpriseBrancheLocation = "DF" | "MG";

export interface EnterpriseBranches {
  createdAt: string;
  filial: string;
  location: EnterpriseBrancheLocation;
  updatedAt?: string;
  id?: string;
}
