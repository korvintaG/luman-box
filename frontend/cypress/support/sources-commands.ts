/// <reference types="cypress" />

import { authorToAdd, routes, sourceToAdd } from "../e2e/tests.constants";

declare global {
  namespace Cypress {
    interface Chainable {
      clickSourcesMenu(): Chainable
      fillSourceForm(): Chainable
      /*fillSourceFormWithImage(imageFileName: string,isBad?: boolean): Chainable
      clickSaveSourceButton(): Chainable
      clickPublishSourceButton(): Chainable
      */
      deleteSourceIfExists(): Chainable
      deleteSourceCascade(): Chainable
    }
  }
}

Cypress.Commands.add('deleteSourceIfExists', () => {
  cy.clickSourcesMenu();
  cy.deleteEntityIfExists('source_link_', sourceToAdd.name, routes.sources);
})

Cypress.Commands.add('clickSourcesMenu', () => {
  cy.get('[data-cy="sources-menu"]').should('be.visible');
  cy.get('[data-cy="sources-menu"]').click();
  cy.location('pathname', {timeout: 60000})
    .should('eq', '/sources');
  cy.get('[data-cy="records-list"]').should('be.visible');
  for (let i = 0; i < 4; i++) {
    cy.get(`[data-cy="source_link_${i}"]`).should('be.visible');
}

})

Cypress.Commands.add('fillSourceForm', () => {
  cy.get('[data-cy="source_name-input"]').type(sourceToAdd.name);
  cy.get('[data-cy="source_publication_year-input"]').type(sourceToAdd.publicationYear);
  cy.get('[data-cy="source_about-input"]').type(sourceToAdd.aboutSource);
  cy.get('[data-cy="source_author-field"]').then(($select) => {
    // Найти option с текстом, содержащим authorToAdd.name
    cy.wrap($select).find('option').contains(authorToAdd.name).then(($option) => {
      const value = $option.val();
      cy.wrap($select).select(value as string);
    });
  });
});

Cypress.Commands.add('deleteSourceCascade', () => {
  cy.deleteSourceIfExists();
  cy.deleteAuthorIfExists();
})


/*Cypress.Commands.add('clickSaveAuthorButton', () => {
  cy.get('[data-cy="save-record-button"]').should('be.visible');
  cy.get('[data-cy="save-record-button"]').click();
  cy.location('pathname', {timeout: 60000})
  .should('match', /^\/authors\/\d+$/);
})

Cypress.Commands.add('clickPublishAuthorButton', () => {
  cy.get('[data-cy="publish-record-button"]').should('be.visible');
  cy.get('[data-cy="publish-record-button"]').click();
  cy.get('[data-cy="yes-button"]').should('be.visible');                
  cy.get('[data-cy="yes-button"]').click();    
  cy.location('pathname', {timeout: 60000})
  .should('eq', '/authors');
})

*/

export {}