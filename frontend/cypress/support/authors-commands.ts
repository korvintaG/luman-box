/// <reference types="cypress" />

import { authorToAdd } from "../e2e/tests.constants";

declare global {
  namespace Cypress {
    interface Chainable {
      clickAuthorsMenu(): Chainable
      clickAddAuthorButton(): Chainable
      fillAuthorForm(): Chainable
      clickSaveAuthorButton(): Chainable
      clickPublishAuthorButton(): Chainable
    }
  }
}

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

   // Читаем файл и создаем File объект
   cy.fixture('test_author.jpg', 'base64').then(fileContent => {
    const blob = Cypress.Blob.base64StringToBlob(fileContent);
    const file = new File([blob], 'test_author.jpg', { type: 'image/jpeg' });
    
    // Получаем input элемент и устанавливаем файл
    cy.get('[data-cy="file-input"]').then(input => {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      input[0].files = dataTransfer.files;
      
      // Триггерим событие change
      input[0].dispatchEvent(new Event('change', { bubbles: true }));
    });
  });
})
//  cy.get('[data-cy="file-input"]').should('have.value');


Cypress.Commands.add('clickAddAuthorButton', () => {
  cy.get('[data-cy="add-record-button"]').should('be.visible');
  cy.get('[data-cy="add-record-button"]').click();
  cy.location('pathname', {timeout: 60000})
  .should('eq', '/authors/add');
})

Cypress.Commands.add('clickSaveAuthorButton', () => {
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

export {}