import { authorToAdd, baseUrl, keywordToAdd, routes, timeout } from "../tests.constants";

const loginURL = `${baseUrl}${routes.auth}`;

export let currentKeyword: {
    keywordId?:string;
    description?:string;
} = {
    keywordId: undefined,
    description: undefined
};

function  getKeywordId() {
    cy.location('pathname').then((pathname) => {
        currentKeyword.keywordId = pathname.split('/').pop();
    });

}


export function createKeyword() {
    cy.clickKeywordsMenu();
    cy.clickAddRecordButton('new');
    cy.fillKeywordForm();
    cy.clickSaveEntityButton(routes.keywordsOnly);
    /* getKeywordId();*/
}

export function moderateKeyword() {
    cy.clickKeywordsMenu();
    cy.classFindAndClickEntity('keyword', keywordToAdd.names[keywordToAdd.default_name_index]);

    // найти элементы с data-cy="author_link_*" и текст которых равен authorToAdd.name
    cy.get('[data-cy="moderate-approve-button"]').should('be.visible');
    cy.get('[data-cy="moderate-approve-button"]').click();
    cy.get('[data-cy="moderate-approve-button"]').should('not.exist');
    cy.get('[data-cy="status-field"]').filter(':visible').should('have.text', 'Одобрено');


}