import { baseUrl } from '../../tests.constants';
import { routes } from '../../tests.constants';

describe('проверяем страницу идеи', function() {
    const url = `${baseUrl}${routes.ideas}`;
    it(`переход на страницу идеи`, function() {
        cy.visit(url); 
        // Находим первую ссылку на странице
        cy.get('[data-cy="idea_link_0"]').click();
        // Проверяем, что есть поле ФИО
        cy.get('[data-cy="idea_name-label"]').should('be.visible');
        cy.get('[data-cy="idea_name-field-readonly"]').should('be.visible');
        cy.get('[data-cy="idea_source-label"]').should('be.visible');
        cy.get('[data-cy="idea_source-field-readonly"]').should('be.visible');
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




