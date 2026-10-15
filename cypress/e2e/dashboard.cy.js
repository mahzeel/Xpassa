/// <reference types="cypress" />

const loginUrl = Cypress.expose('DEV_LOGIN_URL');

Cypress.on('uncaught:exception', () => false)

describe('Testing Dashboard Page', () => {
     let userData
    beforeEach(() => {
        cy.fixture('users.json').then((data) => {
                userData = data
            })
        })
    beforeEach(()=> {
                cy.visit(loginUrl);
            })

  it('Should be able to login and access the dashboard page ', () => {
        cy.get('[id="email"]').should('be.visible').type(userData.verifiedUser.username)
        cy.get('[name="password"]').should('be.visible').type(userData.verifiedUser.password)
        cy.get('button[type="submit"]').should('be.visible').click()
        cy.wait(3000)
    })






})