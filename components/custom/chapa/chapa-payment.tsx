"use client";

import { useEffect } from "react";
import { ENV } from "@/config/env";

import "./chapa.css";
import { CommonUserData } from "@/types";

import { errorToast } from "../toasts";
import Stack from "../stack";
import LogJSON from "../log-json";
import { Badge } from "@/components/ui/badge";

// import ChapaCheckout from '@chapa_et/inline.js';

// Declaration
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ChapaCheckout: any;
  }
}

type ChapaPaymentProps = {
  amount: number;
  currency: string;
  user?: Omit<CommonUserData, "password" | "role">;
  txRef: string;
  onClose: () => void;
  setNewTxRef: () => void;
  onSuccessfulPayment: () => void;
};

const ChapaPayment = ({
  user,
  amount,
  txRef,
  onClose,
  setNewTxRef,
  onSuccessfulPayment,
}: ChapaPaymentProps) => {
  console.log({ user, onClose });

  const roundedAmount = Math.ceil(amount);

  useEffect(() => {
    try {
      const chapa = new window.ChapaCheckout({
        publicKey: ENV.CHAPA_PUBLIC_KEY,
        amount: roundedAmount + "",
        currency: "ETB",
        tx_ref: txRef,
        showPaymentMethodsNames: false,
        availablePaymentMethods: ["telebirr", "cbebirr", "ebirr", "mpesa"],
        customizations: {
          buttonText: "Pay Now",
        },
        onSuccessfulPayment: async () => {
          onSuccessfulPayment();
        },
        onPaymentFailure: () => {
          errorToast(
            "Error occurred while processing chapa transaction. try again",
          );
          // setNewTxRef();

          onSuccessfulPayment();
        },
      });

      chapa.initialize("chapa-inline-form");
    } catch (error) {
      if (error instanceof Error) {
        errorToast(
          error?.message || "Error occured while intalizing chapa payment",
        );
      }

      setNewTxRef();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roundedAmount, txRef]);

  return (
    <Stack className="relative">
      <Badge className="w-fit">{txRef}</Badge>
      <LogJSON data={{ txRef, user, roundedAmount }} />
      <div id="chapa-inline-form" />
    </Stack>
  );
};

export default ChapaPayment;
