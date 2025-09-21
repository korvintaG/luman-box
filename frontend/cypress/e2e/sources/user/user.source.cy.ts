//import { createAuthor, currentAuthor, moderateAuthor } from '../sources.test-utils';

import { createAuthor } from "../../authors/authors.test-utils";
import { routes } from "../../tests.constants";
import { createSource, createSourceCascade, currentSource, moderateSource, moderateSourceCascade } from "../sources.test-utils";

describe('проверяем список источников при авторизованном пользователе', function() {

    it('удаление ранее добавленных источников', function() {
        cy.loginSuperAdmin();
        cy.deleteSourceCascade();
        cy.logout();
    });

    it(`создание нового источника`, function() {
        cy.loginUser();
        createSourceCascade();
        cy.clickPublishEntityButton(routes.sources);
        cy.logout();
    });

    it('модерирование источника каскадное - одобрение', function() {
        cy.loginAdmin();
        moderateSourceCascade();
        cy.logout();
    });

    it('удаление ранее добавленных источников и проверка отсутствия картинки', function() {
        cy.loginSuperAdmin();
        cy.deleteSourceCascade();
        cy.checkImage(currentSource.imageURL, true);
        cy.logout();
    })

    
    it('попытка создания источника с некорректной картинкой', function() {
        cy.loginUser();
        cy.clickSourcesMenu();
        cy.clickAddRecordButton();
        cy.fillEntityImage('cypress/fixtures/large.jpg', true);
        cy.logout();
    });

});




