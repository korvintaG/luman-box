import { authorToAdd, baseUrl, routes } from "../e2e/tests.constants";

const loginURL = `${baseUrl}${routes.auth}`;
const superAdminName = Cypress.env("REACT_APP_SUPER_ADMIN_LOGIN");
const superAdminPassword = Cypress.env("REACT_APP_SUPER_ADMIN_PASSWORD");
const userName = Cypress.env("REACT_APP_USER_NAME");
const userPassword = Cypress.env("REACT_APP_USER_PASSWORD");
const adminName=Cypress.env("REACT_APP_ADMIN_LOGIN");
const adminPassword=Cypress.env("REACT_APP_ADMIN_PASSWORD");

/*export function delOldAuthorIfExists() {
    cy.login(superAdminName, superAdminPassword);
    cy.clickAuthorsMenu();
    cy.deleteEntityIfExists('author_link_', authorToAdd.name, routes.authors);
};*/

export function createAuthor() {
    cy.login(userName, userPassword);
    cy.clickAuthorsMenu();
    cy.clickAddAuthorButton();
    cy.fillAuthorForm();
    //cy.clickSaveAuthorButton();
    //cy.clickPublishAuthorButton();
}

export function moderateAuthor() {
    cy.login(adminName, adminPassword);
    cy.clickAuthorsMenu();
    // найти элементы с data-cy="author_link_*" и текст которых равен authorToAdd.name
    cy.get('[data-cy^="author_link_"]').each(($el) => {
        if ($el.text().trim() === authorToAdd.name) {
            cy.wrap($el).click();
            cy.get('[data-cy="moderate-approve-button"]').should('be.visible');
            cy.get('[data-cy="moderate-approve-button"]').click();
            //cy.get('[data-cy="yes-button"]').should('be.visible');                
            //cy.get('[data-cy="yes-button"]').click();
            cy.location('pathname', {timeout: 60000})
            .should('eq', '/authors');
        
        }
    });

}