"use client";
import React from "react";
import { useFlutterwave, closePaymentModal } from "flutterwave-react-v3";

export default function App(): JSX.Element {
  const config: any = {
    // Use 'any' as the type for the configuration object
    public_key: "FLWPUBK_TEST-00b01b55e9c9f1b803f17e394069273f-X",
    tx_ref: Date.now(),
    amount: 200,
    currency: "NGN",
    payment_options: "card,mobilemoney,ussd",
    customer: {
      email: "edwin_mongare@bat.com",
      name: "john doe",
    },
    customizations: {
      title: "Pacesetter",
      description: "Payment for items in cart",
      logo: "https://st2.depositphotos.com/4403291/7418/v/450/depositphotos_74189661-stock-illustration-online-shop-log.jpg",
    },
  };

  const handleFlutterPayment = useFlutterwave(config);

  return (
    <div className="App">
      <h1>Hello Test user</h1>

      <button
        onClick={() => {
          handleFlutterPayment({
            callback: (response: any) => {
              console.log(response);
              closePaymentModal(); // this will close the modal programmatically
            },
            onClose: () => {},
          });
        }}
      >
        Payment with React hooks
      </button>
    </div>
  );
}
