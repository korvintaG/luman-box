/// <reference types="cypress" />

import { authorToAdd, routes } from "../e2e/tests.constants";

declare global {
  namespace Cypress {
    interface Chainable {
      clickAuthorsMenu(): Chainable
      fillAuthorForm(): Chainable
      deleteAuthorIfExists(): Chainable
    }
  }
}

Cypress.Commands.add('deleteAuthorIfExists', () => {
  cy.clickAuthorsMenu();
  cy.deleteEntityIfExists('author_link_', authorToAdd.name, routes.authors);
})

Cypress.Commands.add('clickAuthorsMenu', () => {
  cy.get('[data-cy="authors-menu"]').should('be.visible');
  cy.get('[data-cy="authors-menu"]').click();
  cy.location('pathname', {timeout: 60000})
    .should('eq', '/authors');
  cy.get('[data-cy="records-list"]').should('be.visible');
  for (let i = 0; i < 4; i++) {
    cy.get(`[data-cy="author_link_${i}"]`).should('be.visible');
  }
})

Cypress.Commands.add('fillAuthorForm', () => {
  cy.get('[data-cy="author_name-input"]').type(authorToAdd.name);
  cy.get('[data-cy="author_birth_date-input"]').type(authorToAdd.birthDate);
  cy.get('[data-cy="author_birth_place-input"]').type(authorToAdd.birthPlace);
  cy.get('[data-cy="author_about-input"]').type(authorToAdd.about);
});



export {}