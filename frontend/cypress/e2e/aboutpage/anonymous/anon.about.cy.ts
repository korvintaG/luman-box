import { baseUrl } from '../../tests.constants';

describe('проверяем главную страницу', function() {
    it('сервис должен быть доступен по адресу ${baseUrl}', function() {
        cy.visit(baseUrl); 
        // Проверяем, что на странице нет горизонтального скроллбара
        cy.get('body').then(($body) => {
            const bodyWidth = $body[0].scrollWidth;
            const viewportWidth = $body[0].clientWidth;
            expect(bodyWidth).to.be.at.most(viewportWidth);
        });
        // Проверяем, что на странице есть все нужные пп. меню
        cy.get('[data-cy="authors-menu"]').should('be.visible');
        cy.get('[data-cy="sources-menu"]').should('be.visible');
        cy.get('[data-cy="ideas-menu"]').should('be.visible');
        cy.get('[data-cy="keywords-menu"]').should('be.visible');
        // Проверяем, что на странице есть логотип
        cy.get('[data-cy="logo-link"]').should('be.visible');
        // Проверяем, что на странице есть кнопка авторизации
        cy.get('[data-cy="auth-button"]').should('be.visible');
        // Проверяем, что на странице есть хотя бы 4 карточки
        for (let i = 0; i < 4; i++) {
            cy.get(`[data-cy="about-card-${i}"]`).should('be.visible');
        }
        // Проверяем, что на странице есть викино карточка
        cy.get('[data-cy="wikino-card"]').should('be.visible');
        // Проверяем, что на странице есть футер
        cy.get('[data-cy="footer"]').should('be.visible');
    });
});


