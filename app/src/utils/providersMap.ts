import { PaymentProviders } from "~/src/types/payment";

export const providersMap = {
  [PaymentProviders.STRIPE]: {
    path: "/images/connectors/stripe.svg",
    width: 28,
  },
  [PaymentProviders.MONGOPAY]: {
    path: "/images/connectors/mangopay.svg",
    width: 90,
  },
  [PaymentProviders.WIZE]: {
    path: "/images/connectors/wize.svg",
    width: "initial",
  },
  [PaymentProviders.PAYPAL]: {
    path: "/images/connectors/paypal.svg",
    width: 30,
  },
  [PaymentProviders.DEVENGO]: {
    path: "/images/connectors/devengo.svg",
    width: 80,
  },
};
