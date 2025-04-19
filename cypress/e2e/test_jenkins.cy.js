describe("Test de démo sur example.cypress.io", () => {
  it("Remplit un champ et vérifie le résultat", () => {
    cy.visit("https://example.cypress.io/commands/actions");

    // Tape du texte dans un champ
    cy.get(".action-email").type("aziz@example.com");

    // Vérifie que le champ contient bien ce qu’on a tapé
    cy.get(".action-email").should("have.value", "aziz@example.com");
  });
});
