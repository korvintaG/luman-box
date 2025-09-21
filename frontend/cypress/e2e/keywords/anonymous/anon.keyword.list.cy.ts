import { baseUrl } from '../../tests.constants';
import { routes } from '../../tests.constants';

describe('проверяем список ключевых слов', function() {
    const url = `${baseUrl}${routes.keywords}`;
    it(`переход на страницу ключевых слов`, function() {
        cy.visit(url); 
        cy.url().should('include', `${routes.keywords}`);
        cy.get('[data-cy="records-list"]').should('be.visible');
        // Проверяем, что на странице есть хотя бы 4 ключевых слова
        for (let i = 0; i < 4; i++) {
            cy.get(`[data-cy="keyword_link_${i}"]`).should('be.visible');
        }
        // Проверяем, что на странице нет кнопки добавления автора
        cy.get('[data-cy="add-record-button"]').should('not.exist');
    });
});




