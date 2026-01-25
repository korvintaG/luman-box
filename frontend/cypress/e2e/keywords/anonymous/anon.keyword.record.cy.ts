import { baseUrl } from '../../tests.constants';
import { routes } from '../../tests.constants';

describe('проверяем страницу ключевого слова', function() {
    const url = `${baseUrl}${routes.keywords.replace(':id', '0')}`;
    it(`переход на страницу ключевого слова`, function() {
        cy.visit(url); 
        // Находим первую ссылку на странице
        cy.get('[data-cy="keyword_link_0"]').click();
        cy.get('[data-cy="keyword_link_detail"]').should('be.visible');
        cy.get('[data-cy="keyword_link_detail"]').click();
        cy.get('[data-cy="keyword_name-label"]').should('be.visible');
        cy.get('[data-cy="keyword_name-field-readonly"]').should('be.visible');
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




