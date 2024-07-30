export type APIResponse = {
  result?: DetailsResponse;
  error?: DetailsResponse;
  data?: any;
  status?: number;
};

export interface DetailsResponse {
  status: number;
  details: string;
}
