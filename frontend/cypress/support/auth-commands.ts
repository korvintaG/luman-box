/// <reference types="cypress" />

import { baseUrl, loginAdmin, loginError, loginSuperAdmin, loginUser, loginUser2, passwordAdmin, passwordError, passwordSuperAdmin, passwordUser, passwordUser2, routes } from "../e2e/tests.constants";

declare global {
  namespace Cypress {
    interface Chainable {
      login(login: string, password: string): Chainable
      loginSuperAdmin(): Chainable
      loginAdmin(): Chainable
      loginUser(): Chainable
      loginError(): Chainable
      loginUser2(): Chainable
      logout(): Chainable
    }
  }
}

Cypress.Commands.add('login', (login: string, password: string) => { 
  const loginURL = `${baseUrl}${routes.auth}`;
  cy.visit(loginURL);
  cy.get('[data-cy="login-form-name-input"]').type(login);
  cy.get('[data-cy="login-form-password-input"]').type(password);
  cy.get('[data-cy="login-form-button"]').click();
  cy.location('pathname', {timeout: 60000})
    .should('eq', '/');
})

Cypress.Commands.add('logout', () => {
  cy.visit(`${baseUrl}${routes.auth}`);
  cy.get('[data-cy="logout-form-button"]').should('be.visible');
  cy.get('[data-cy="logout-form-button"]').click();
  // подождать пока не станет видимой элемент data-cy=login-form-button
  cy.get('[data-cy="login-form-button"]').should('be.visible');
})

Cypress.Commands.add('loginSuperAdmin', () => {
  cy.login(loginSuperAdmin, passwordSuperAdmin);
})

Cypress.Commands.add('loginAdmin', () => {  
  cy.login(loginAdmin, passwordAdmin);
})

Cypress.Commands.add('loginUser', () => {
  cy.login(loginUser, passwordUser);
})

Cypress.Commands.add('loginError', () => {
  cy.login(loginError, passwordError);
})

Cypress.Commands.add('loginUser2', () => {
  cy.login(loginUser2, passwordUser2);
})


export {}