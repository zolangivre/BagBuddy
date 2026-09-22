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
