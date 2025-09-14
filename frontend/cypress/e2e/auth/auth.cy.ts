import { baseUrl } from '../tests.constants';
import { routes } from '../tests.constants';
import cypress from 'cypress';

describe('проверяем авторизацию', function() {

    beforeEach(() => {
        cy.clearCookies();
      });
          
    const url = `${baseUrl}${routes.auth}`;
    it(`переход на страницу авторизации`, function() {
        cy.visit(url); 
        cy.url().should('include', `${routes.auth}`);
        //console.log('Cypress.env("REACT_APP_USER_NAME")', Cypress.env("REACT_APP_USER_NAME"));
        cy.get('[data-cy="login-form-title"]').should('be.visible');
        cy.get('body').then(($body) => {
            const loginFormExists = $body.find('[data-cy="login-form-title"]').length > 0;
            //console.log('loginFormExists', loginFormExists);
            if (loginFormExists) {
                cy.get('[data-cy="login-form-title"]').should('be.visible');
                cy.get('[data-cy="login-form-name-label"]').should('be.visible');
                cy.get('[data-cy="login-form-name-input"]').should('be.visible');
                cy.get('[data-cy="login-form-password-label"]').should('be.visible');
                cy.get('[data-cy="login-form-password-input"]').should('be.visible');
                cy.get('[data-cy="login-form-button"]').should('be.visible');
                cy.get('[data-cy="register-link"]').should('be.visible');
                cy.get('[data-cy="login-form-name-input"]').type(Cypress.env('REACT_APP_USER_NAME') || '');
                cy.get('[data-cy="login-form-password-input"]').type(Cypress.env('REACT_APP_USER_PASSWORD') || '');
                cy.get('[data-cy="login-form-button"]').click();
                cy.get('[data-cy="login-form-title"]').should('not.exist');
                cy.get('[data-cy="logout-form-title"]').should('be.visible');
                cy.get('[data-cy="logout-form-button"]').should('be.visible');
                cy.get('[data-cy="logout-form-button"]').click();
                cy.get('[data-cy="login-form-title"]').should('be.visible');
            }
            else {
                cy.get('[data-cy="logout-form-title"]').should('be.visible');
                cy.get('[data-cy="logout-form-button"]').should('be.visible');
            }
        });
        // проверяем, что на странице есть заголовок c data-cy="login-form-title"
/*        cy.get('body').then(($body) => {
            if ($body.find('[data-cy="login-form-title"]')) {
                cy.get('[data-cy="login-form-title"]').should('be.visible');
                // проверяем, что на странице есть поле для ввода никнэйма c data-cy="login-form-name"
                cy.get('[data-cy="login-form-name"]').should('be.visible');
                // проверяем, что на странице есть поле для ввода пароля c data-cy="login-form-password"
                cy.get('[data-cy="login-form-password"]').should('be.visible');
                // проверяем, что на странице есть кнопка для авторизации c data-cy="login-form-button"
                cy.get('[data-cy="login-form-button"]').should('be.visible');
            }
            else {
                cy.get('[data-cy="logout-form-title"]').should('be.visible');
                cy.get('[data-cy="logout-form-button"]').should('be.visible');
            }
        });*/
    });
});




