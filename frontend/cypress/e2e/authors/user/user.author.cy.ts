import { routes } from '../../tests.constants';
import { createAuthor, currentAuthor, moderateAuthor } from '../authors.test-utils';

describe('проверяем список авторов при авторизованном пользователе', function() {

    it('удаление ранее добавленных авторов', function() {
        cy.loginSuperAdmin();
        cy.deleteAuthorIfExists();
        cy.logout();
    });

    it(`создание нового автора`, function() {
        cy.loginUser();
        createAuthor();
        cy.clickPublishEntityButton(routes.authors);
        cy.checkImage(currentAuthor.imageURL);
        cy.logout();
    });

    it('модерирование автора - одобрение', function() {
        cy.loginAdmin();
        moderateAuthor();
        cy.logout();
    })

    it('удаление ранее добавленных авторов и проверка отсутствия картинки', function() {
        cy.loginSuperAdmin();
        cy.deleteAuthorIfExists();
        cy.checkImage(currentAuthor.imageURL, true);
        cy.logout();
    });

    it('попытка создания автора с некорректной картинкой', function() {
        cy.loginUser();
        cy.clickAuthorsMenu();
        cy.clickAddRecordButton();
        cy.fillEntityImage('cypress/fixtures/large.jpg', true);
        cy.logout();
    });


});




