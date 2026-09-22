import { gql } from "@apollo/client";
import { REVIEW_FIELDS } from "@/lib/graphql/fragments";

/** Remplace GET /reviews/reviewee/{sub}. */
export const REVIEWS_BY_REVIEWEE = gql`
  query ReviewsByReviewee($revieweeId: String!, $limit: Int, $offset: Int) {
    reviewsByReviewee(revieweeId: $revieweeId, limit: $limit, offset: $offset) {
      ...ReviewFields
    }
  }
  ${REVIEW_FIELDS}
`;

/**
 * Avis reçus et moyenne en une requête : remplace les deux appels
 * GET /reviews/reviewee/{sub} et GET /reviews/reviewee/{sub}/average.
 */
export const REVIEW_SUMMARY = gql`
  query ReviewSummary($revieweeId: String!) {
    reviewsByReviewee(revieweeId: $revieweeId) {
      ...ReviewFields
    }
    averageRating(revieweeId: $revieweeId)
  }
  ${REVIEW_FIELDS}
`;

/** Remplace GET /reviews/transaction/{id}. */
export const REVIEWS_BY_TRANSACTION = gql`
  query ReviewsByTransaction($transactionId: ID!) {
    reviewsByTransaction(transactionId: $transactionId) {
      ...ReviewFields
    }
  }
  ${REVIEW_FIELDS}
`;

/**
 * Remplace POST /reviews. `CreateReviewInput` n'accepte ni reviewerId ni
 * revieweeId : l'auteur vient du jeton et le destinataire est l'autre partie de
 * la transaction, résolus côté serveur.
 */
export const CREATE_REVIEW = gql`
  mutation CreateReview($input: CreateReviewInput!) {
    createReview(input: $input) {
      ...ReviewFields
    }
  }
  ${REVIEW_FIELDS}
`;

/** Remplace PUT /reviews/{id}. Seul le contenu est modifiable. */
export const UPDATE_REVIEW = gql`
  mutation UpdateReview($id: ID!, $input: UpdateReviewInput!) {
    updateReview(id: $id, input: $input) {
      ...ReviewFields
    }
  }
  ${REVIEW_FIELDS}
`;

/** Moyenne seule. Null tant que le membre n'a reçu aucun avis. */
export const AVERAGE_RATING = gql`
  query AverageRating($revieweeId: String!) {
    averageRating(revieweeId: $revieweeId)
  }
`;
