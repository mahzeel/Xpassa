/// <reference types="cypress" />

const loginUrl = Cypress.expose('DEV_LOGIN_URL');

Cypress.on('uncaught:exception', () => false)

describe('Testing Login Page', () => {
    let userData
    beforeEach(() => {
        cy.fixture('users.json').then((data) => {
                userData = data
            })
        })
    beforeEach(()=> {
                cy.visit(loginUrl);
            })

    it('Should be able to verify the login URL', () => {
        cy.url().should('contain', 'https://xpassa').and('eq', loginUrl)
        cy.url().should('not.contain', '.ng').and('not.contain', '.net')
        cy.url().should('match', /^https:\/\/xpassa-web-dev\.digitvant\.com\/auth\/login$/)
        cy.url().should('match', /^https:\/\//);
        cy.url().should('match',/^https:\/\/xpassa-web-dev\.digitvant\.com/)
        cy.url().should('match',/^https:\/\/xpassa-web-dev\.digitvant\.com(?:\/|$)/);
        cy.location('pathname').should('match', /^\/auth\/login$/);
        cy.location('search').should('match', /^$/);
        cy.location('hash').should('match', /^$/);
        cy.url().should('not.match', /^http:\/\/xpassa-web-dev\.digitvant\.com\/auth\/login$/)
        cy.url().should('not.match', /^https:\/\/www\.xpassa-web-dev\.digitvant\.com\/auth\/login$/)
        cy.url().should('include', 'xpassa-web-dev.digitvant.com')
        cy.url().should('include', 'digitvant.com')
        cy.url().should('include', 'digitvant.co')
        cy.url().should('not.include', 'http://')
        cy.url().should('not.include', 'www')
        cy.url().should('not.include', 'digitvant.net')
        cy.url().should('not.include', 'digitvant.org')
        cy.url().should('not.include', 'digitvant.io')
        cy.location('protocol').should('contain', 'https:')
        cy.location('hostname').should('eq', 'xpassa-web-dev.digitvant.com')
    })

    it('Should not be able to login with empty fields', () => {
        cy.get('button[type="submit"]').should('be.visible').click()
        cy.get('[class="mt-1.5 text-sm text-red-400"]').eq(0).should('have.text', 'Email is required')
        cy.get('[class="mt-1.5 text-sm text-red-400"]').eq(1).should('have.text', 'Password is required.')

     })

      it('Should not be able to login with partial fields', () => {
        cy.get('[id="email"]').should('be.visible').type('zigger1@yopmail.com')
        cy.get('button[type="submit"]').should('be.visible').click()
        cy.get('[class="mt-1.5 text-sm text-red-400"]').should('have.text', 'Password is required.')

     })

     it('Verify Google play is visible and clickable', () => {
        cy.get('button[type="button"]').should('have.length', 5);
        cy.get('button[type="button"]').eq(0)
                .should('be.visible')
                .and('be.enabled');
        
     })

     it('Verify Apple Store is visible and clickable', () => {
          cy.get('button[type="button"]').eq(1).should('be.visible').and('be.enabled');
    })

     it('Should login but cannot perform actions until the device is verified', () => {
        cy.get('[id="email"]').should('be.visible').type(userData.user1.username)
        cy.get('[name="password"]').should('be.visible').type(userData.user1.password)
        cy.get('button[type="submit"]').should('be.visible').click()
        cy.wait(3000)
        cy.verifyDeviceModalIsVisible()

        cy.wait(3000)
        cy.clickSignOutInstead()
     })

  })
