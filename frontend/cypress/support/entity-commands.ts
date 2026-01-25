/// <reference types="cypress" />

import { baseUrl, routes, timeout } from "../e2e/tests.constants";

declare global {
  namespace Cypress {
    interface Chainable {
      deleteEntityIfExists(prefix: string, text: string, listUrl: string): Chainable
      deleteClassEntityIfExists(prefix: string, text: string, listUrl: string): Chainable
      fillEntityImage(imageFileName: string,isBad?: boolean): Chainable
      checkImage(imageURL?: string, checkAbsent?: boolean): Chainable
      clickAddRecordButton(addCmd?: string): Chainable
      clickSaveEntityButton(listUrl: string): Chainable
      clickPublishEntityButton(listUrl: string): Chainable
      classFindAndClickEntity(prefix: string, text: string): Chainable
    }
  }
}

// -- This is a parent command --
Cypress.Commands.add('classFindAndClickEntity', 
  (prefix: string, text: string) => { 
  let found = false;

    if (found) return;
    // если текст элемента начинается с text, то кликаем на него
    cy.get(`[data-cy^="${prefix}"]`).each(($el) => { 
    if (found) return;
    if ($el.text().trim().startsWith(text)) {
        found = true;
        cy.wrap($el).click();
        cy.location('pathname', { timeout })
          .should('match', new RegExp(`^\\/${prefix}s\\/\\d+\\/children$`));
        // Для class entities нужно кликнуть на заголовок, чтобы перейти на детальную страницу с кнопкой удаления
        cy.get(`[data-cy="${prefix}_link_detail"]`).should('be.visible');
        cy.get(`[data-cy="${prefix}_link_detail"]`).click();
        cy.location('pathname', { timeout })
          .should('match', new RegExp(`^\\/${prefix}s\\/\\d+$`));

    }
  });
})

// -- This is a parent command --
Cypress.Commands.add('deleteEntityIfExists', 
  (prefix: string, text: string, listUrl: string) => { 
  let found = false;
  cy.get(`[data-cy^="${prefix}"]`).each(($el) => { 
    if (found) return;
    // если текст элемента начинается с text, то удаляем его
    if ($el.text().trim().startsWith(text)) {
        //console.log(`Deleting entity with text: ${text}`);
        found = true;
        cy.wrap($el).click();
        cy.location('pathname', { timeout })
          .should('match', new RegExp(`^${listUrl.replace(/\/$/, '').replace(/\//g, '\\/')}\\/\\d+$`));
        cy.get('[data-cy="delete-record-button"]').should('be.visible');
        cy.get('[data-cy="delete-record-button"]').click();
        cy.get('[data-cy="yes-button"]').should('be.visible');                
        cy.get('[data-cy="yes-button"]').click();
        cy.location('pathname', {timeout })
          .should('eq', listUrl);
        
        }
    });
})

// -- This is a parent command --
Cypress.Commands.add('deleteClassEntityIfExists', 
  (prefix: string, text: string, listUrl: string) => { 
  let found = false;
  cy.get(`[data-cy^="${prefix}"]`).each(($el) => { 
    if (found) return;
    // если текст элемента начинается с text, то удаляем его
    if ($el.text().trim().startsWith(text)) {
        //console.log(`Deleting entity with text: ${text}`);
        found = true;
        cy.wrap($el).click();
        cy.location('pathname', { timeout })
          .should('match', new RegExp(`^\\/keywords\\/\\d+\\/children$`));
        // Для class entities нужно кликнуть на заголовок, чтобы перейти на детальную страницу с кнопкой удаления
        cy.get('[data-cy="keyword_link_detail"]').should('be.visible');
        cy.get('[data-cy="keyword_link_detail"]').click();
        cy.location('pathname', { timeout })
          .should('match', new RegExp(`^\\/keywords\\/\\d+$`));
        cy.get('[data-cy="delete-record-button"]').should('be.visible');
        cy.get('[data-cy="delete-record-button"]').click();
        cy.get('[data-cy="yes-button"]').should('be.visible');                
        cy.get('[data-cy="yes-button"]').click();
        cy.location('pathname', {timeout })
          .should('eq', listUrl);
        
        }
    });
})


Cypress.Commands.add('checkImage', (imageURL?: string, checkAbsent?: boolean) => {
  if (imageURL) {
    cy.then(() => {
      // проверка, что по адресу imageURL есть картинка
      cy.request({
        url: imageURL,
        method: 'GET',
        failOnStatusCode: false
      }).then((response) => {
        if (checkAbsent) {
          expect(response.status).to.eq(404);
        } else {
          expect(response.status).to.eq(200);
        }
      });
    });
  }
})

Cypress.Commands.add('clickAddRecordButton', (addCmd: string='add') => {
  cy.get('[data-cy="add-record-button"]').should('be.visible');
  cy.get('[data-cy="add-record-button"]').click();
  cy.location('pathname', {timeout})
  .should('satisfy', (pathname: string) => pathname.endsWith(`/${addCmd}`) || pathname === addCmd);
})


Cypress.Commands.add('fillEntityImage', (imageFileName: string,isBad?: boolean) => {
  cy.get('[data-cy="ok-button"]').should('not.exist');
  cy.get('[data-cy="error-message"]').should('not.exist');
  cy.get('[data-cy=file-input]').selectFile(imageFileName, { force: true });
  if (!isBad) {
    cy.get('[data-cy="image-preview"]').should('be.visible');
  } else {
    //cy.get('[data-cy="image-preview"]').should('not.exist');
    cy.get('[data-cy="error-message"]').should('be.visible');
    cy.get('[data-cy="ok-button"]').should('be.visible');
    cy.get('[data-cy="ok-button"]').click();
  }
});

Cypress.Commands.add('clickSaveEntityButton', (listUrl: string) => {
  cy.get('[data-cy="save-record-button"]').should('be.visible');
  cy.get('[data-cy="save-record-button"]').click();
  cy.location('pathname', {timeout})
  .should('match', new RegExp(`^${listUrl.replace(/\/$/, '').replace(/\//g, '\\/')}\\/\\d+$`));
})


Cypress.Commands.add('clickPublishEntityButton', (listUrl: string) => {
  cy.get('[data-cy="publish-record-button"]').should('be.visible');
  cy.get('[data-cy="publish-record-button"]').click();
  cy.get('[data-cy="yes-button"]').should('be.visible');                
  cy.get('[data-cy="yes-button"]').click();    
  cy.location('pathname', {timeout})
  .should('eq', listUrl);
})



export {}