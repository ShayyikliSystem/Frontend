export interface Support {
  id: number;
  supportArea: string;
  supportDescription: string;
  status: 'PENDING' | 'RESOLVED';
  createdAt: string;
  accountNumber: number;
  userName: string;
}
