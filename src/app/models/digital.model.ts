export interface DigitalCheck {
  IdOfCheckbook: string;
  amount: number;
  checkId: string;
  createdAt: string;
  docType: string;
  shayyikliSystemNumber: string;
  shyyiklinumberOfBeneficiary: number;
  shyyiklinumberOfEndorsers: number | null;
  shyyiklinumberOfUsers: number;
  status: 'Active' | 'Transfer' | 'Return' | 'Settle';
  transferDate: string;
}

export interface DigitalCheckExtended extends DigitalCheck {
  issuerName?: string;
  beneficiaryName?: string;
  endorsersNames?: string;
  transferDate: string;
  rawTransferDate: string;
}
