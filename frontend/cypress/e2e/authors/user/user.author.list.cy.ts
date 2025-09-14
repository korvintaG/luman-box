import { createAuthor, moderateAuthor } from '../../../support/utils';
import { authorToAdd, baseUrl } from '../../tests.constants';
import { routes } from '../../tests.constants';

describe('проверяем список авторов при авторизованном пользователе', function() {

    const url = `${baseUrl}${routes.authors}`;
    const loginURL = `${baseUrl}${routes.auth}`;
    const superAdminName = Cypress.env("REACT_APP_SUPER_ADMIN_LOGIN");
    const superAdminPassword = Cypress.env("REACT_APP_SUPER_ADMIN_PASSWORD");
    
    it('удаление ранее добавленных авторов', function() {
        cy.login(superAdminName, superAdminPassword);
        cy.clickAuthorsMenu();
        cy.deleteEntityIfExists('author_link_', authorToAdd.name, routes.authors);
    });

    it(`создание нового автора`, function() {
        createAuthor();
    });

    /*it('модерирование автора - прием', function() {
        moderateAuthor();
    })*/    

});




