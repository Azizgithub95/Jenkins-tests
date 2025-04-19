describe("Mon premier test", () => {
  it("Visite Google et tape une recherche", () => {
    // Aller sur Google
    cy.visit("https://www.google.com");

    // Attendre un peu que la page charge (utile en headless / Jenkins)
    cy.wait(2000);

    // Fermer le message de consentement si présent (RGPD)
    cy.get("body").then(($body) => {
      if ($body.find('button:contains("J’accepte")').length > 0) {
        cy.contains("J’accepte").click({ force: true });
      }
    });

    // Vérifie que la barre de recherche est présente, avec un timeout plus long
    cy.get('input[name="q"]', { timeout: 10000 }).should("be.visible");

    // Tape du texte
    cy.get('input[name="q"]').type("Jenkins{enter}");

    // Vérifie que les résultats apparaissent
    cy.get("#search", { timeout: 10000 }).should("exist");
  });
});
