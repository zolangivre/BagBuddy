INSERT INTO review (
  reviewer_id, reviewee_id, trip_id, transaction_id,
  rating, comment, created_at
) VALUES
(10, 20, 1, 1, 5, 'Super échange, très ponctuel.', NOW()),
(11, 20, null, 2, 4, 'Bon contact, tout s''est bien passé.', NOW());
