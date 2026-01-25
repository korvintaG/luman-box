import { routes } from '../../tests.constants';
import { createKeyword, moderateKeyword } from '../keywords.test-utils';

describe('проверяем список ключевых слов при авторизованном пользователе', function() {

    it('удаление ранее добавленных ключевых слов', function() {
        cy.loginSuperAdmin();
        cy.deleteKeywordIfExists();
        cy.logout();
    });

    it(`создание нового ключевого слова`, function() {
        cy.loginUser();
        createKeyword();
        cy.clickPublishEntityButton(routes.keywords.replace(':id', '0'));
        cy.logout();
    });

    it('модерирование ключевого слова - одобрение', function() {
        cy.loginAdmin();
        moderateKeyword();
        cy.logout();
    })

     it('удаление ранее добавленных ключевых слов', function() {
        cy.loginSuperAdmin();
        cy.deleteKeywordIfExists();
        cy.logout();
    });

});




