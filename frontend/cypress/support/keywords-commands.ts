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
  cy.deleteClassEntityIfExists('keyword_link_', 
    keywordToAdd.names[keywordToAdd.default_name_index], 
    routes.keywords.replace(':id', keywordToAdd.class_keyword_id.toString()));
})

Cypress.Commands.add('clickKeywordsMenu', () => {
  cy.get('[data-cy="keywords-menu"]').should('be.visible');
  cy.get('[data-cy="keywords-menu"]').click();
  cy.location('pathname', {timeout})
    .should('match', new RegExp(`^${routes.keywords.replace(':id', '0').replace(/\/$/, '').replace(/\//g, '\\/')}$`));
  cy.get('[data-cy="records-list"]').should('be.visible');
  for (let i = 0; i < 4; i++) {
    cy.get(`[data-cy="keyword_link_${i}"]`).should('be.visible');
  }
})

Cypress.Commands.add('fillKeywordForm', () => {
  cy.get('[data-cy="names_array_0-input"]').type(keywordToAdd.names[0]);
  cy.get('[data-cy="names_array_1-input"]').type(keywordToAdd.names[1]);
  cy.get('[data-cy="keyword_memo-input"]').type(keywordToAdd.definition);
});



export {}