import { gql } from "@apollo/client";

/** Clé publiable à passer au SDK Stripe. Sert aussi à détecter que le service est éteint (dev). */
export const STRIPE_CONFIG = gql`
  query StripeConfig {
    stripeConfig {
      publishableKey
    }
  }
`;

/**
 * Remplace POST /stripe/payment-intent. Le montant n'est plus envoyé par le
 * client : le serveur lit la transaction, vérifie qu'on en est l'acheteur et
 * calcule la somme à partir de l'annonce.
 */
export const CREATE_PAYMENT_INTENT = gql`
  mutation CreatePaymentIntent($transactionId: ID!) {
    createPaymentIntent(transactionId: $transactionId) {
      clientSecret
    }
  }
`;

/** Où en est le compte de versement (Stripe Connect) de l'appelant. */
export const PAYOUT_ACCOUNT = gql`
  query PayoutAccount {
    payoutAccount {
      connected
      detailsSubmitted
      payoutsEnabled
      transfersActive
    }
  }
`;

/**
 * Lien d'onboarding Stripe Connect. À usage unique et de courte durée : à
 * ouvrir aussitôt, jamais à stocker.
 */
export const START_PAYOUT_ONBOARDING = gql`
  mutation StartPayoutOnboarding {
    startPayoutOnboarding {
      url
    }
  }
`;
