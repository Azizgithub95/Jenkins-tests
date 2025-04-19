describe("Mon premier test", () => {
  it("Visite Google et tape une recherche", () => {
    // Aller sur Google
    cy.visit("https://www.google.com");

    // Attendre un peu que la page charge
    cy.wait(2000);

    // Gérer le consentement RGPD si visible
    cy.get("body").then(($body) => {
      if ($body.find('button:contains("J’accepte")').length > 0) {
        cy.contains("J’accepte").click({ force: true });
      } else if ($body.find('button:contains("Tout accepter")').length > 0) {
        cy.contains("Tout accepter").click({ force: true });
      }
    });

    // Attendre à nouveau un peu après consentement
    cy.wait(2000);

    // Trouver la barre de recherche
    cy.get('input[name="q"]', { timeout: 10000 }).should("be.visible");

    // Entrer une recherche
    cy.get('input[name="q"]').type("Jenkins{enter}");

    // Vérifier que les résultats apparaissent
    cy.get("#search", { timeout: 10000 }).should("exist");
  });
});
