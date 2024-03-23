import { ServiceDataResponse } from "./service.response";

export interface UpgradeServiceDataResponse {
  id: number;
  count: number;
  pricing: number;
  active: boolean;
  createAt: string;
  updateAt: string;
  deleteAt: string;
  services: ServiceDataResponse;
}
