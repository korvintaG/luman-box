import { createAuthor, moderateAuthor } from "../authors/authors.test-utils";
import { authorToAdd, baseUrl, routes, sourceToAdd } from "../tests.constants";

const loginURL = `${baseUrl}${routes.auth}`;

export let currentSource: {
    sourceId?:string;
    imageURL?:string;
} = {
    sourceId: undefined,
    imageURL: undefined
};

function  getSourceId() {
    cy.location('pathname').then((pathname) => {
        currentSource.sourceId = pathname.split('/').pop();
        console.log(`Source ID: ${currentSource.sourceId}`);
        // Используйте authorId дальше в тесте
    });

}
function getSourceImageURL() {
    cy.get('[data-cy="image-preview"]')
      .should('be.visible')
      .invoke('attr', 'src')
      .then((url) => {
        currentSource.imageURL = url;
        console.log(`Image URL: ${currentSource.imageURL}`);
      });

    
}

export function createSource() {
    cy.clickSourcesMenu();
    cy.clickAddRecordButton();
    cy.fillSourceForm();
    cy.fillEntityImage('cypress/fixtures/test_source.jpg');
    cy.clickSaveEntityButton(routes.sources);
    getSourceId();
    getSourceImageURL();
}

export function createSourceCascade() {
    createAuthor();
    cy.clickAuthorsMenu();
    createSource();
    cy.checkImage(currentSource.imageURL);
}

export function moderateSource(needLogin: boolean = true) {
    cy.clickSourcesMenu();
    // найти элементы с data-cy="source_link_*" и текст которых равен sourceToAdd.name
    cy.get('[data-cy^="source_link_"]').each(($el) => {
        if ($el.text().trim().startsWith(sourceToAdd.name)) {
            cy.wrap($el).click();
            cy.get('[data-cy="moderate-approve-button"]').should('be.visible');
            cy.get('[data-cy="moderate-approve-button"]').click();
            cy.get('[data-cy="moderate-approve-button"]').should('not.exist');
            cy.get('[data-cy="status-field"]').filter(':visible').should('have.text', 'Одобрено');
        }
    });
}

export function moderateSourceCascade() {
    moderateAuthor();
    moderateSource();
}