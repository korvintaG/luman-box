/// <reference types="cypress" />

import { authorToAdd, IdeaToAdd, ideaToAdd, keywordToAdd, routes, sourceToAdd, timeout } from "../e2e/tests.constants";

declare global {
  namespace Cypress {
    interface Chainable {
      clickIdeasMenu(): Chainable
      fillIdeasForm(idea?: IdeaToAdd): Chainable
      deleteIdeasIfExists(idea?: IdeaToAdd): Chainable
      deleteIdeasCascade(): Chainable
    }
  }
}

Cypress.Commands.add('deleteIdeasIfExists', (idea?: IdeaToAdd) => {
  const ideaAdd: IdeaToAdd = idea || ideaToAdd;
  cy.clickIdeasMenu();
  cy.deleteEntityIfExists('idea_link_', ideaAdd.name, routes.ideas);
})

Cypress.Commands.add('clickIdeasMenu', () => {
  cy.get('[data-cy="ideas-menu"]').should('be.visible');
  cy.get('[data-cy="ideas-menu"]').click();
  cy.location('pathname', {timeout})
    .should('eq', '/ideas');
  cy.get('[data-cy="records-list"]').should('be.visible');
  for (let i = 0; i < 4; i++) {
    cy.get(`[data-cy="idea_link_${i}"]`).should('be.visible');
}

})

Cypress.Commands.add('fillIdeasForm', (idea?: IdeaToAdd) => {
  const ideaAdd: IdeaToAdd = idea || ideaToAdd;
  cy.get('[data-cy="idea_name-input"]').should('be.visible');
  cy.get('[data-cy="idea_name-input"]').should('have.value', '');
  cy.get('[data-cy="svg-icon"]').should('not.exist');
  cy.get('[data-cy="idea_name-input"]').clear().type(ideaAdd.name, { delay: 0 });  cy.get('[data-cy="idea_original_text-input"]').type(ideaAdd.original_text);
  cy.get('[data-cy="idea_content-input"]').type(ideaAdd.content);
  cy.get('[data-cy="idea_SVG-input"]').type(ideaAdd.SVG);
  /*cy.get('[data-cy="idea_source-field"]').then(($select) => {
    // Найти option с текстом, содержащим authorToAdd.name
    cy.wrap($select).find('option').contains(sourceToAdd.name).then(($option) => {
      const value = $option.val();
      cy.wrap($select).select(value as string);
    });
  });*/
  cy.get('[data-cy="idea_source-field"]').then(($select) => {
    // Найти option с текстом, начинающимся с sourceToAdd.name
    cy.wrap($select).find('option').then(($options) => {
      const targetOption = Array.from($options).find(option => 
        option.textContent?.startsWith(sourceToAdd.name)
      );
      if (targetOption) {
        const value = targetOption.getAttribute('value');
        cy.wrap($select).select(value as string);
      }
    });
  });  
  cy.get('[data-cy="keyword-field"]').then(($select) => {
    // Найти option с текстом, начинающимся с keywordToAdd.name
    cy.wrap($select).find('option').then(($options) => {
      const targetOption = Array.from($options).find(option => 
        option.textContent?.startsWith(keywordToAdd.name)
      );
      if (targetOption) {
        const value = targetOption.getAttribute('value');
        cy.wrap($select).select(value as string);
      }
    });
  });  
});

Cypress.Commands.add('deleteIdeasCascade', () => {
  cy.deleteIdeasIfExists();
  cy.clickLogo();
  cy.deleteKeywordIfExists();
  cy.deleteSourceCascade();
});

export {}