describe("Mon premier test", () => {
  it("Visite Google", () => {
    cy.visit("https://google.com");
    cy.get('input[name="q"]').should("be.visible");
  });
});
