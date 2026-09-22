export const globalStyles = {
  card: {
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderBottomWidth: 1,
    marginTop: 55,
  },
  /** Espacement d'une carte empilant titre, texte et action. */
  cardStack: {
    gap: 12,
  },
  /** Ligne « icône + titre » en tête de carte. */
  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  /** Occupe l'écran et centre son contenu (chargement, état vide). */
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
};