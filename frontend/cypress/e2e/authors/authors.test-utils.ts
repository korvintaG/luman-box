import { authorToAdd, baseUrl, routes } from "../tests.constants";

const loginURL = `${baseUrl}${routes.auth}`;

export let currentAuthor: {
    authorId?:string;
    imageURL?:string;
} = {
    authorId: undefined,
    imageURL: undefined
};

function  getAuthorId() {
    cy.location('pathname').then((pathname) => {
        currentAuthor.authorId = pathname.split('/').pop();
    });

}
function getAuthorImageURL() {
    cy.get('[data-cy="image-preview"]')
      .should('be.visible')
      .invoke('attr', 'src')
      .then((url) => {
        currentAuthor.imageURL = url;
        console.log(`Image URL: ${currentAuthor.imageURL}`);
      });

    
}

export function createAuthor() {
    cy.clickAuthorsMenu();
    cy.clickAddRecordButton();
    cy.fillAuthorForm();
    cy.fillEntityImage('cypress/fixtures/test_author.jpg');
    cy.clickSaveEntityButton(routes.authors);
    getAuthorId();
    getAuthorImageURL();
}

export function moderateAuthor() {
    cy.clickAuthorsMenu();
    // найти элементы с data-cy="author_link_*" и текст которых равен authorToAdd.name
    cy.get('[data-cy^="author_link_"]').each(($el) => {
        if ($el.text().trim() === authorToAdd.name) {
            cy.wrap($el).click();
            cy.get('[data-cy="moderate-approve-button"]').should('be.visible');
            cy.get('[data-cy="moderate-approve-button"]').click();
            cy.get('[data-cy="moderate-approve-button"]').should('not.exist');
            cy.get('[data-cy="status-field"]').filter(':visible').should('have.text', 'Одобрено');
        }
    });

}