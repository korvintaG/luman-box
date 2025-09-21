import { baseUrl } from '../../tests.constants';
import { routes } from '../../tests.constants';

describe('проверяем страницу источника', function() {
    const url = `${baseUrl}${routes.sources}`;
    it(`переход на страницу источника`, function() {
        cy.visit(url); 
        // Находим первую ссылку на странице
        cy.get('[data-cy="source_link_0"]').click();
        // Проверяем, что есть поле ФИО
        cy.get('[data-cy="source_name-label"]').should('be.visible');
        cy.get('[data-cy="source_name-field-readonly"]').should('be.visible');
        cy.get('[data-cy="source_author-label"]').should('be.visible');
        cy.get('[data-cy="source_author-field-readonly"]').should('be.visible');
        cy.get('[data-cy="status-label"]').should('be.visible');
        cy.get('[data-cy="status-field"]').should('be.visible');
        cy.get('[data-cy="back-record-button"]').should('be.visible');
        cy.get('[data-cy="save-record-button"]').should('not.exist');
        cy.get('[data-cy="publish-record-button"]').should('not.exist');
        cy.get('[data-cy="delete-record-button"]').should('not.exist');
        cy.get('[data-cy="moderate-approve-button"]').should('not.exist');
        cy.get('[data-cy="moderate-reject-button"]').should('not.exist');
        cy.get('[data-cy="moderate-notes-input"]').should('not.exist');
     
    });
});




