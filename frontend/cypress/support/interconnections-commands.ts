/// <reference types="cypress" />

import { baseUrl, ideaToAdd, ideaToAdd2, interconnectionToAdd, routes, sourceToAdd, timeout } from "../e2e/tests.constants";

declare global {
  namespace Cypress {
    interface Chainable {
      getIdeasIDs(): Chainable
      deleteInterconnectionIfExists(ideaId: string): Chainable
      createInterconnection(ideaId: string, ideaId2: string, isReverse?: boolean): Chainable
      deleteInterconnectionsCascade(ideaId: string | undefined, ideaId2: string | undefined): Chainable
    }
  }
}

/*Cypress.Commands.add('deleteSourceIfExists', () => {
  cy.clickSourcesMenu();
  cy.deleteEntityIfExists('source_link_', sourceToAdd.name, routes.sources);
})*/

Cypress.Commands.add('getIdeasIDs', () => {
  Cypress.env('ideas', { ideaId: undefined, ideaId2: undefined });
  cy.visit(`${baseUrl}`);
  cy.get('[data-cy="logo-link"]').should('be.visible');
  cy.get('[data-cy="logo-link"]').click();
  cy.get('[data-cy="ideas-menu"]').should('be.visible');
  cy.get('[data-cy="ideas-menu"]').click();
  cy.get('[data-cy="records-list"]').should('be.visible');

  cy.get('body').then(($body) => {
    let ideaId: string | undefined;
    let ideaId2: string | undefined;
    const $match = $body.find('[data-cy^="idea_link_"]').filter((i, el) =>
      el.innerText.startsWith(ideaToAdd.name)
    );
    if ($match.length > 0) {
      const href = $match.attr('href');
      if (href) {
        ideaId = href?.match(/\/(\d+)$/)?.[1];
        //Cypress.env('ideas', { ideaId });
      }
    }
    const $match2 = $body.find('[data-cy^="idea_link_"]').filter((i, el) =>
      el.innerText.startsWith(ideaToAdd2.name)
    );
    if ($match2.length > 0) {
      const href = $match2.attr('href');
      ideaId2 = href?.match(/\/(\d+)$/)?.[1];
    }
    Cypress.env('ideas', { ideaId, ideaId2 });
  });

  /*  if ($body.find('[data-cy="idea_link_"]').length > 0) {
      cy.get(`[data-cy^="idea_link_"]`)
        .filter((i, el) => el.innerText.startsWith(ideaToAdd.name)) 
        .invoke('attr', 'href')
        .then((href) => {
          const ideaId = href?.match(/\/(\d+)$/)?.[1];
          cy.get(`[data-cy^="idea_link_"]`)
            .filter((i, el) => el.innerText.startsWith(ideaToAdd2.name)) 
            .invoke('attr', 'href')
            .then((href) => {
              const ideaId2 = href?.match(/\/(\d+)$/)?.[1];
              Cypress.env('ideas', { ideaId, ideaId2 });
            });
        });
    }*/
/*
  cy.get(`[data-cy^="idea_link_"]`)
    .filter((i, el) => el.innerText.startsWith(ideaToAdd.name)) 
    .invoke('attr', 'href')
    .then((href) => {
      // допустим href = "/authors/1262"
      const ideaId = href?.match(/\/(\d+)$/)?.[1];
      //cy.log(`Нашли ID = ${ideaId}`);
      cy.get(`[data-cy^="idea_link_"]`)
          .filter((i, el) => el.innerText.startsWith(ideaToAdd2.name)) 
          .invoke('attr', 'href')
          .then((href) => {
              const ideaId2 = href?.match(/\/(\d+)$/)?.[1];
              Cypress.env('ideas', { ideaId, ideaId2 });
      });
  });*/


  Cypress.Commands.add('deleteInterconnectionIfExists', (ideaId: string) => {
    cy.visit(`${baseUrl}${routes.ideas}${routes.interconnections}/${ideaId}/3`);
    cy.get('[data-cy="interconnection-add-button-reverse"]').should('be.visible');
    let found=false;
    cy.get('body').then(($body) => {
        if ($body.find('[data-cy="interconnection-link-direct-0"]').length > 0) {
            cy.get('[data-cy="interconnection-link-direct-0"]').click();
            cy.get('[data-cy="delete-record-button"]').should('be.visible');
            cy.get('[data-cy="delete-record-button"]').click();
            cy.get('[data-cy="yes-button"]').should('be.visible');                
            cy.get('[data-cy="yes-button"]').click();    
            found=true;
        }
        if (!found && $body.find('[data-cy="interconnection-link-reverse-0"]').length > 0) {
          cy.get('[data-cy="interconnection-link-reverse-0"]').click();
          cy.get('[data-cy="delete-record-button"]').should('be.visible');
          cy.get('[data-cy="delete-record-button"]').click();
          cy.get('[data-cy="yes-button"]').should('be.visible');                
          cy.get('[data-cy="yes-button"]').click();    
      }
    });
  });

  Cypress.Commands.add('createInterconnection', (ideaId: string, ideaId2: string, isReverse?: boolean) => {
    cy.visit(`${baseUrl}${routes.ideas}/${ideaId}`);
    cy.get('[data-cy="interconnection-icon-3"]').should('be.visible');
    cy.get('[data-cy="interconnection-icon-3"]').click();
    if (isReverse) {
      cy.get('[data-cy="interconnection-add-button-reverse"]').should('be.visible');
      cy.get('[data-cy="interconnection-add-button-reverse"]').click();
    } else {
      cy.get('[data-cy="interconnection-add-button-direct"]').should('be.visible');
      cy.get('[data-cy="interconnection-add-button-direct"]').click();
    }
    cy.get('[data-cy="idea-id-input"]').should('be.visible');
    cy.get('[data-cy="idea-id-input"]').type(ideaId2);
    cy.get('[data-cy="idea-id-input"]').type('{enter}');
    cy.get('[data-cy="interconnection-name-direct-input"]').should('be.visible');
    cy.get('[data-cy="interconnection-name-direct-input"]').type(interconnectionToAdd.name_direct);
    cy.get('[data-cy="interconnection-name-reverse-input"]').should('be.visible');
    cy.get('[data-cy="interconnection-name-reverse-input"]').type(interconnectionToAdd.name_reverse);
    cy.get('[data-cy="save-record-button"]').should('be.visible');
    cy.get('[data-cy="save-record-button"]').click();
    cy.get('[data-cy="publish-record-button"]').should('be.visible');
    cy.get('[data-cy="publish-record-button"]').click();
    cy.get('[data-cy="yes-button"]').should('be.visible');                
    cy.get('[data-cy="yes-button"]').click();    
    cy.location('pathname', {timeout})
      .should('match', new RegExp(`^${routes.interconnections.replace(/\/$/, '').replace(/\//g, '\\/')}`));
    if (isReverse) {
      cy.get(`[data-cy="interconnection-link-reverse-0"]`).should('be.visible');
      cy.get('[data-cy="interconnection-link-reverse-0"]').should('have.text', interconnectionToAdd.name_direct);
    }
    else {
      cy.get(`[data-cy="interconnection-link-direct-0"]`).should('be.visible');
      cy.get('[data-cy="interconnection-link-direct-0"]').should('have.text', interconnectionToAdd.name_direct);
    }
  });

  Cypress.Commands.add('deleteInterconnectionsCascade', (ideaId: string | undefined, ideaId2: string | undefined) => {
    if (ideaId) {
      cy.deleteInterconnectionIfExists(ideaId);
    }
    cy.deleteIdeasIfExists();
    cy.clickLogo();
    cy.deleteIdeasIfExists(ideaToAdd2);
    cy.deleteKeywordIfExists();
    cy.deleteSourceCascade();
  });
});




export {}