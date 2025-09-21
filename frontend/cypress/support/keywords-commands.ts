/// <reference types="cypress" />

import { keywordToAdd, routes, timeout } from "../e2e/tests.constants";

declare global {
  namespace Cypress {
    interface Chainable {
      clickKeywordsMenu(): Chainable
      fillKeywordForm(): Chainable
      deleteKeywordIfExists(): Chainable
    }
  }
}

Cypress.Commands.add('deleteKeywordIfExists', () => {
  cy.clickKeywordsMenu();
  cy.deleteEntityIfExists('keyword_link_', keywordToAdd.name, routes.keywords);
})

Cypress.Commands.add('clickKeywordsMenu', () => {
  cy.get('[data-cy="keywords-menu"]').should('be.visible');
  cy.get('[data-cy="keywords-menu"]').click();
  cy.location('pathname', {timeout})
    .should('eq', '/keywords');
  cy.get('[data-cy="records-list"]').should('be.visible');
  for (let i = 0; i < 4; i++) {
    cy.get(`[data-cy="keyword_link_${i}"]`).should('be.visible');
  }
})

Cypress.Commands.add('fillKeywordForm', () => {
  cy.get('[data-cy="keyword_name-input"]').type(keywordToAdd.name);
  cy.get('[data-cy="keyword_definition-input"]').type(keywordToAdd.definition);
});



export {}