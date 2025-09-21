import { authorToAdd, baseUrl, keywordToAdd, routes } from "../tests.constants";

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
    cy.clickAddRecordButton();
    cy.fillKeywordForm();
    cy.clickSaveEntityButton(routes.keywords);
    getKeywordId();
}

export function moderateKeyword() {
    cy.clickKeywordsMenu();
    // найти элементы с data-cy="author_link_*" и текст которых равен authorToAdd.name
    cy.get('[data-cy^="keyword_link_"]').each(($el) => {
        if ($el.text().trim() === keywordToAdd.name) {
            cy.wrap($el).click();
            cy.get('[data-cy="moderate-approve-button"]').should('be.visible');
            cy.get('[data-cy="moderate-approve-button"]').click();
            cy.get('[data-cy="moderate-approve-button"]').should('not.exist');
            cy.get('[data-cy="status-field"]').filter(':visible').should('have.text', 'Одобрено');
        }
    });

}