import { createIdeaCascade, moderateIdeaCascade } from "../ideas/ideas.test-utils";
import { baseUrl, routes } from "../tests.constants";

describe('проверяем оценку идей при авторизованном пользователе', function() {

    it('удаление ранее добавленных идей, источников, авторов и ключевых слов', function() {
        cy.loginSuperAdmin();
        cy.deleteIdeasCascade();
        cy.logout();
    });

    it('добавление данных для создания новой оценки', function() {
        cy.loginUser();
        createIdeaCascade();
        cy.logout();
    });

    it('модерация ранее добавленных идей', function() {
        cy.loginAdmin();
        moderateIdeaCascade();
        cy.logout();
    });

    it('получение ID идей', function() {
        cy.loginUser();
        cy.getIdeasIDs(); // обязательно в отдлеьном it
        cy.logout();
    });

    it('создание новой оценки', function() {
        cy.loginUser();
        const { ideaId, _ } =Cypress.env('ideas' );
        cy.visit(`${baseUrl}${routes.ideas}/${ideaId}`);
        cy.get('[data-cy="attitudes-block"]').should('be.visible');
        cy.get('[data-cy="attitude-like-0"]').should('be.visible');
        cy.get('[data-cy="attitude-like-label-0"]').should('have.text', '');
        cy.get('[data-cy="attitude-like-0"]').click();
        cy.get('[data-cy="attitude-like-label-0"]').should('have.text', '1');
        cy.logout();
    });

    it('проверка оценки под другим пользователем', function() {
        cy.loginUser2();
        const { ideaId, _ } =Cypress.env('ideas' );
        cy.visit(`${baseUrl}${routes.ideas}/${ideaId}`);
        cy.get('[data-cy="attitudes-block"]').should('be.visible');
        cy.get('[data-cy="attitude-like-0"]').should('be.visible');
        cy.get('[data-cy="attitude-like-label-0"]').should('have.text', '1');
        cy.get('[data-cy="attitude-like-0"]').click();
        cy.get('[data-cy="attitude-like-label-0"]').should('have.text', '2');
        cy.logout();
    });


    it ('повторное удаление ранее добавленных идей', function() {
        cy.loginSuperAdmin();
        cy.deleteIdeasCascade();
        cy.logout();
    });


});




