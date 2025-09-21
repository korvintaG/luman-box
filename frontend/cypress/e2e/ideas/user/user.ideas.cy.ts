import { createIdeaCascade, deleteIdeaCascade, moderateIdeaCascade } from "../ideas.test-utils";

describe('проверяем список идей при авторизованном пользователе', function() {

    it('удаление ранее добавленных идей', function() {
        cy.loginSuperAdmin();
        deleteIdeaCascade();
        cy.logout();
    });

    it(`создание новой идеи`, function() {
        cy.loginUser();
        createIdeaCascade();
        cy.logout();
    });

    it('модерирование идеи каскадное - одобрение', function() {
        cy.loginAdmin();
        moderateIdeaCascade();
        cy.logout();
    });

    it('удаление всех добавленных идей каскадно', function() {
        cy.loginSuperAdmin();
        deleteIdeaCascade();
        cy.logout();
    });

});




