export interface SettlementResponseRequest {
  checkId: string;
  accepted: boolean;
}

export interface SettlementInitiatorDetailsDTO {
  targetUserName: string;
  checkId: string;
  status: string;
  transferDate: string;
  amount: number;
}
