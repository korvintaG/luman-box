/// <reference types="cypress" />

import { baseUrl, routes } from "../e2e/tests.constants";

declare global {
  namespace Cypress {
    interface Chainable {
      deleteEntityIfExists(prefix: string, text: string, listUrl: string): Chainable
    }
  }
}

// -- This is a parent command --
Cypress.Commands.add('deleteEntityIfExists', 
  (prefix: string, text: string, listUrl: string) => { 
  cy.get(`[data-cy^="${prefix}"]`).each(($el) => { 
    if ($el.text().trim() === text) {
        //console.log(`Deleting entity with text: ${text}`);
        cy.wrap($el).click();
        cy.location('pathname', {timeout: 60000})
          .should('match', /^\/authors\/\d+$/);
        cy.get('[data-cy="delete-record-button"]').should('be.visible');
        cy.get('[data-cy="delete-record-button"]').click();
        cy.get('[data-cy="yes-button"]').should('be.visible');                
        cy.get('[data-cy="yes-button"]').click();
        cy.location('pathname', {timeout: 60000})
          .should('eq', listUrl);
        
        }
    });
})



export {}