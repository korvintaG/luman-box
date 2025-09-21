import { baseUrl } from '../../tests.constants';
import { routes } from '../../tests.constants';

describe('проверяем список источников', function() {
    const url = `${baseUrl}${routes.sources}`;
    it(`переход на страницу источников`, function() {
        cy.visit(url); 
        cy.url().should('include', `${routes.sources}`);
        cy.get('[data-cy="records-list"]').should('be.visible');
        // Проверяем, что на странице есть хотя бы 4 авторов
        for (let i = 0; i < 4; i++) {
            cy.get(`[data-cy="source_link_${i}"]`).should('be.visible');
        }
        // Проверяем, что на странице нет кнопки добавления автора
        cy.get('[data-cy="add-record-button"]').should('not.exist');
    });
});




