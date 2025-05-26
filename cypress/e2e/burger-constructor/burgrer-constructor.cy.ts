const baseURL = process.env.BURGER_API_URL;
import ingredients from '../../fixtures/ingredients.json';
import orderCreated from '../../fixtures/orders-created.json'

describe('Modal window testing', () =>{
    beforeEach(() => {
        cy.intercept(`${baseURL}/ingredients`, ingredients);
        cy.visit('/');
        cy.contains('Соберите бургер').should('exist');
    })
    it('Modal window can be opened and closed', () => {
        cy.get('#modals').as('modalWindow');
        const modalWindowSelector = '@modalWindow';
        cy.contains('Краторная булка').click();
        cy.get(modalWindowSelector).contains('Краторная булка');
        cy.get(modalWindowSelector).find('button').click();
        cy.contains(modalWindowSelector).should('not.exist');
    })
})

describe('User auth testing', () => {
    beforeEach(() => {
        cy.clearCookies();
        cy.clearAllLocalStorage();
    })
    afterEach(() => {
        cy.clearCookies();
        cy.clearAllLocalStorage();
    })
    it('User can auth through login page', () => {
        cy.login();
        cy.location('pathname').should('eq', '/');
        cy.contains('Test User').should('exist');
        cy.getCookie('accessToken').should('have.property', 'value', 'mock');
    })
})

describe('Order constructor testing', () =>{
    beforeEach(() => {
        cy.clearCookies();
        cy.clearAllLocalStorage();
    })
    afterEach(() => {
        cy.clearCookies();
        cy.clearAllLocalStorage();
    })
    beforeEach(() => {
        cy.intercept(`${baseURL}/ingredients`, ingredients);
        cy.setCookie('accessToken', 'mocktoken');
        cy.visit('/');
        cy.contains('Соберите бургер').should('exist');
    })
    it('Redirects to the login page if user is not authed', () => {
        cy.contains('Краторная булка').closest('li').find('button').click();
        cy.contains('Биокотлета').closest('li').find('button').click();

        cy.contains('2934');
        cy.contains('Оформить заказ').click();
        cy.location('pathname').should('eq', '/login');
    })
    it('When user is authed order can be created', () => {
        cy.get('#modals').as('modalWindow');
        const modalWindowSelector = '@modalWindow';
        cy.intercept('POST',`**/api/orders`, orderCreated);
        cy.login();
        cy.contains('Краторная булка').closest('li').find('button').click();
        cy.contains('Биокотлета').closest('li').find('button').click();
        cy.contains('Оформить заказ').click();

        cy.contains('идентификатор заказа');
        cy.contains('78651');

        cy.get(modalWindowSelector).find('button').click();
        cy.contains('Выберите булки');
        cy.contains('Выберите начинку');
    })
})
