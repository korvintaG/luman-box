/// <reference types="cypress" />

import { baseUrl, routes } from "../e2e/tests.constants";

declare global {
  namespace Cypress {
    interface Chainable {
      login(login: string, password: string): Chainable
    }
  }
}

// -- This is a parent command --
Cypress.Commands.add('login', (login: string, password: string) => { 
  // Implementation will go here
  const loginURL = `${baseUrl}${routes.auth}`;
  cy.visit(loginURL);
  cy.get('[data-cy="login-form-name-input"]').type(login);
  cy.get('[data-cy="login-form-password-input"]').type(password);
  cy.get('[data-cy="login-form-button"]').click();
  //cy.wait(1000);
  cy.location('pathname', {timeout: 60000})
    .should('eq', '/');
})



export {}