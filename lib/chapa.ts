"use client";

import ENV from "@/config/env";

export type chapaCheckoutProps = {
  amount: string;
  email: string;
  first_name: string;
  last_name: string;
  return_url: string;
  title: string;
  description: string;
};

export async function chapaCheckout({
  amount,
  email,
  first_name,
  last_name,
  return_url,
  title,
  description,
}: chapaCheckoutProps) {
  const myHeaders = new Headers();
  myHeaders.append("Authorization", "Bearer " + ENV.CHAPA_PUBLIC_KEY);
  myHeaders.append("Content-Type", "application/json");
  const randtx = `tx-${Math.random()}`;

  const raw = JSON.stringify({
    amount: amount,
    currency: "ETB",
    email,
    first_name,
    last_name,
    phone_number: "0912345678",
    tx_ref: randtx,
    callback_url: ENV.PAYMENT_WEBHOOK_URL,
    return_url,
    "customization[title]": title,
    "customization[description]": description,
    "meta[hide_receipt]": "true",
  });

  const response = await fetch(
    "https://api.chapa.co/v1/transaction/initialize",
    {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    },
  );

  const result = await response.text();
  console.log({ result });
}
