export interface SignupRequest {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  idNumber: number | null;
  cardNumber: string;
  expiryDate: string;
  securityCode: number | null;
  agreedToTerms: boolean;
}
