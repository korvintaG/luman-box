import {  moderateAuthor } from "../authors/authors.test-utils";
import { createKeyword, moderateKeyword } from "../keywords/keywords.test-utils";
import {  createSourceCascade, moderateSource } from "../sources/sources.test-utils";
import {  baseUrl, IdeaToAdd, ideaToAdd, routes } from "../tests.constants";

//const loginURL = `${baseUrl}${routes.auth}`;

export let currentIdea: {
    ideaId?:string;
    ideaId2?:string;
} = {
    ideaId: undefined,
    ideaId2: undefined,
};

export function  getIdeaId(idea?: IdeaToAdd) {
    cy.location('pathname').then((pathname) => {
        if (idea) 
          currentIdea.ideaId2 = pathname.split('/').pop();
        else
          currentIdea.ideaId = pathname.split('/').pop();

    });

}

export function createIdea(idea?: IdeaToAdd) {
    cy.clickLogo();
    cy.clickIdeasMenu();
    cy.clickAddRecordButton();
    cy.fillIdeasForm(idea);
    cy.clickSaveEntityButton(routes.ideas);
    cy.get('[data-cy="svg-icon"]').should('be.visible');
    cy.clickPublishEntityButton(routes.ideas);
    //getIdeaId(idea);
}

export function createIdeaCascade() {
    createSourceCascade();
    createKeyword();
    createIdea();
    
}

export function deleteIdeaCascade() {
    cy.deleteIdeasIfExists();
    cy.deleteKeywordIfExists();
    cy.deleteSourceCascade();
}

export function moderateIdea(idea?: IdeaToAdd) {
    cy.clickIdeasMenu();
    // найти элементы с data-cy="source_link_*" и текст которых равен sourceToAdd.name
    let found = false;
    cy.get('[data-cy^="idea_link_"]').each(($el) => {
        if (found) return;
        if ($el.text().trim().startsWith(idea?.name || ideaToAdd.name)) {
            found = true;
            cy.wrap($el).click();
            cy.get('[data-cy="moderate-approve-button"]').should('be.visible');
            cy.get('[data-cy="moderate-approve-button"]').click();
            cy.get('[data-cy="moderate-approve-button"]').should('not.exist');
            cy.get('[data-cy="status-field"]').filter(':visible').should('have.text', 'Одобрено');
        }
    });
}

export function moderateIdeaCascade() {
    moderateAuthor();
    moderateSource();
    moderateKeyword();
    moderateIdea();
}
