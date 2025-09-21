import { createIdea, createIdeaCascade, currentIdea, getIdeaId, moderateIdea, moderateIdeaCascade } from "../ideas/ideas.test-utils";
import { createKeyword } from "../keywords/keywords.test-utils";
import { createSourceCascade } from "../sources/sources.test-utils";
import { baseUrl, ideaToAdd, ideaToAdd2, interconnectionToAdd, routes, timeout } from "../tests.constants";

describe('проверяем список идей при авторизованном пользователе', function() {

   it('получение старых ID идей', function() {
        cy.loginUser();
        cy.getIdeasIDs(); // обязательно в отдлеьном it
        cy.logout();
    });

    it('удаление ранее добавленных взаимосвязей, идей, источников, авторов и ключевых слов', function() {
        cy.loginSuperAdmin();
        const { ideaId, ideaId2 } =Cypress.env('ideas' );
        cy.deleteInterconnectionsCascade(ideaId, ideaId2);
        cy.logout();
    });

    it('добавление данных для создания новой взаимосвязи', function() {
        cy.loginUser();
        createIdeaCascade();
        createIdea(ideaToAdd2);
        cy.logout();
    });

    it('модерация ранее добавленных идей', function() {
        cy.loginAdmin();
        moderateIdeaCascade();
        moderateIdea(ideaToAdd2);
        cy.logout();
    }); 

    it('получение ID идей', function() {
        cy.loginUser();
        cy.getIdeasIDs(); // обязательно в отдлеьном it
        cy.logout();
    });

    it('создание новой взаимосвязи прямой', function() {
        cy.loginUser();
        const { ideaId, ideaId2 } =Cypress.env('ideas' );
        cy.createInterconnection(ideaId, ideaId2);
        cy.logout();
    });

    it ('повторное удаление ранее добавленных взаимосвязей', function() {
        cy.loginSuperAdmin();
        const { ideaId, ideaId2 } =Cypress.env('ideas' );
        cy.deleteInterconnectionIfExists(ideaId);
        cy.logout();
    });

    it('создание новой взаимосвязи обратной', function() {
        cy.loginUser();
        const { ideaId, ideaId2 } =Cypress.env('ideas' );
        cy.createInterconnection(ideaId, ideaId2, true);
        cy.logout();
    });

    it('окончательное удаление ранее добавленных взаимосвязей, идей, источников, авторов и ключевых слов', function() {
        cy.loginSuperAdmin();
        const { ideaId, ideaId2 } =Cypress.env('ideas' );
        cy.deleteInterconnectionsCascade(ideaId, ideaId2);
        cy.logout();
    });


});




