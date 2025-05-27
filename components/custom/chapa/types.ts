/* eslint-disable @typescript-eslint/no-unused-vars */
export type ChapaCustomization = {
  buttonText?: string;
  styles?: string;
  successMessage?: string;
};

export type ChapaOptions = {
  publicKey: string;
  amount: string;
  currency?: string;
  availablePaymentMethods?: string[];
  customizations?: ChapaCustomization;
  callbackUrl?: string;
  returnUrl?: string;
  showFlag?: boolean;
  showPaymentMethodsNames?: boolean;
  onSuccessfulPayment?: (transaction: ChapaTransaction) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onPaymentFailure?: (error: any) => void;
  onClose?: () => void;
};

export type ChapaTransaction = {
  message: string;
  trx_ref: string;
  data: {
    amount: string;
    charge: string;
    status: string;
  };
};

export class ChapaCheckout {
  constructor(public options: ChapaOptions) {}
  initialize(_containerId: string): void {}
}
