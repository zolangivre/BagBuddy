import { gql } from "@apollo/client";
import {
  TRANSACTION_FIELDS,
  TRANSACTION_CARD_FIELDS,
} from "@/lib/graphql/fragments";

/**
 * Remplace GET /transactions/user/{sub}. La requête ne prend pas d'identifiant :
 * elle se cadre sur le jeton, achats et ventes confondus.
 */
export const MY_TRANSACTIONS = gql`
  query MyTransactions {
    myTransactions {
      ...TransactionCardFields
    }
  }
  ${TRANSACTION_CARD_FIELDS}
`;

/** Remplace GET /transactions/{id}. */
export const TRANSACTION_BY_ID = gql`
  query Transaction($id: ID!) {
    transaction(id: $id) {
      ...TransactionFields
    }
  }
  ${TRANSACTION_FIELDS}
`;

/**
 * Les trois chiffres du profil en un aller-retour, là où le REST demandait
 * /count, /total-spent et /total-earned séparément.
 */
export const TRANSACTION_STATS = gql`
  query TransactionStats($sub: String!) {
    transactionCount(userId: $sub)
    totalEarned(sellerId: $sub)
    totalSpent(buyerId: $sub)
  }
`;

/** Le compteur seul : tout ce dont le profil public a besoin. */
export const TRANSACTION_COUNT = gql`
  query TransactionCount($userId: String!) {
    transactionCount(userId: $userId)
  }
`;

/**
 * Remplace POST /transactions. Le prix n'est pas fourni par le client : il est
 * calculé contre l'annonce (pricePerKg × weight). La description du contenu et
 * l'acceptation des objets interdits sont exigées.
 */
export const CREATE_TRANSACTION = gql`
  mutation CreateTransaction($input: CreateTransactionInput!) {
    createTransaction(input: $input) {
      ...TransactionFields
    }
  }
  ${TRANSACTION_FIELDS}
`;

/**
 * Remplace PUT /transactions/{id}. Seuls les statuts, le poids et les drapeaux
 * d'avis sont acceptés : l'argent et le paiement ne sont jamais écrits ici.
 */
export const UPDATE_TRANSACTION = gql`
  mutation UpdateTransaction($id: ID!, $input: UpdateTransactionInput!) {
    updateTransaction(id: $id, input: $input) {
      ...TransactionFields
    }
  }
  ${TRANSACTION_FIELDS}
`;

/**
 * Un seul champ : sert à attendre le webhook Stripe après un paiement. Le
 * passage en « confirmé » est refusé tant que `paidAt` n'est pas posé, et c'est
 * le webhook signé — non le client — qui l'écrit.
 */
export const TRANSACTION_PAID_AT = gql`
  query TransactionPaidAt($id: ID!) {
    transaction(id: $id) {
      id
      paidAt
    }
  }
`;

const TRANSACTION_MESSAGE_FIELDS = gql`
  fragment TransactionMessageFields on TransactionMessage {
    id
    senderSub
    body
    createdAt
    mine
  }
`;

/**
 * Fil d'une transaction, du plus ancien au plus récent. Réservé aux
 * participants. 200 messages au plus.
 */
export const TRANSACTION_MESSAGES = gql`
  query TransactionMessages($transactionId: ID!, $afterId: ID) {
    transactionMessages(transactionId: $transactionId, afterId: $afterId) {
      ...TransactionMessageFields
    }
  }
  ${TRANSACTION_MESSAGE_FIELDS}
`;

/** Codes : invalid_message (1 à 2000 caractères), conversation_closed, too_many_messages. */
export const SEND_TRANSACTION_MESSAGE = gql`
  mutation SendTransactionMessage($transactionId: ID!, $body: String!) {
    sendTransactionMessage(transactionId: $transactionId, body: $body) {
      ...TransactionMessageFields
    }
  }
  ${TRANSACTION_MESSAGE_FIELDS}
`;

/**
 * Le voyageur clôt la transaction payée avec le code que le destinataire lui
 * donne à la livraison. Codes : invalid_handover_code, handover_locked
 * (5 essais), handover_not_expected.
 */
export const CONFIRM_HANDOVER = gql`
  mutation ConfirmHandover($id: ID!, $code: String!) {
    confirmHandover(id: $id, code: $code) {
      ...TransactionFields
    }
  }
  ${TRANSACTION_FIELDS}
`;
