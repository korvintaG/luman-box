/// <reference types="cypress" />

import { baseUrl, loginAdmin, loginError, loginSuperAdmin, loginUser, loginUser2, passwordAdmin, passwordError, passwordSuperAdmin, passwordUser, passwordUser2, routes, timeout } from "../e2e/tests.constants";

declare global {
  namespace Cypress {
    interface Chainable {
      clickLogo(): Chainable
    }
  }
}

Cypress.Commands.add('clickLogo', () => { 
  cy.get('[data-cy="logo-link"]').should('be.visible');
  cy.get('[data-cy="logo-link"]').click();
  cy.location('pathname', {timeout})
    .should('eq', '/');
  cy.get('[data-cy="logo-link"]').should('be.visible');
})




export {}