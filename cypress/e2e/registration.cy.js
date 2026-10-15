/// <reference types="cypress" />

const serverId = Cypress.expose('CYPRESS_MAILOSAUR_SERVER_ID');
const emailDomain = Cypress.expose('CYPRESS_MAILOSAUR_EMAIL_DOMAIN');
const createUrl = Cypress.expose('DEV_CREATE_URL');
let emailAddress

Cypress.on('uncaught:exception', () => false)

describe('Testing the Registration Page', () => {
  beforeEach(() => {
    cy.visit(createUrl);
  })

  it('Should be able to verify the registration URL', () => {
    cy.url().should('contain', 'https://xpassa').and('eq', 'https://xpassa-web-dev.digitvant.com/auth/register/account')
    cy.url().should('not.contain', '.ng').and('not.contain', '.net')
    cy.url().should('match', /^https:\/\/xpassa-web-dev\.digitvant\.com\/auth\/register\/account$/)
    cy.url().should('match', /^https:\/\//);
    cy.url().should('match',/^https:\/\/xpassa-web-dev\.digitvant\.com/)
    cy.url().should('match',/^https:\/\/xpassa-web-dev\.digitvant\.com(?:\/|$)/);
    cy.location('pathname').should('match', /^\/auth\/register\/account$/);
    cy.location('search').should('match', /^$/);
    cy.location('hash').should('match', /^$/);
    cy.url().should('not.match', /^http:\/\/xpassa-web-dev\.digitvant\.com\/auth\/register\/account$/)
    cy.url().should('not.match', /^https:\/\/www\.xpassa-web-dev\.digitvant\.com\/auth\/register\/account$/)
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

  it('Should be able to view the Xpassa Terms of use and Privacy policy', () => {
    cy.wait(1000)
    cy.get('a[href="/terms"]').should('be.visible').click()
    cy.wait(3000)
    cy.url().should('contain', 'https://xpassa').and('eq', 'https://xpassa-web-dev.digitvant.com/terms')
    cy.url().should('match', /^https:\/\/xpassa-web-dev\.digitvant\.com\/terms$/)
    cy.go('back')
  })
  
  it('Should not be able to register with empty fields', () => {
      cy.get('[id="email"]').should('be.visible')
      cy.get('[id="phoneNumber"]').should('be.visible')
      cy.get('[id="password"]').should('be.visible')
      cy.get('[id="confirmPassword"]').should('be.visible')
      cy.get('[id="register-accept-terms"]').should('be.visible')
      cy.get('button[type="submit"').should('be.visible').click()
      cy.get('p.text-red-400.text-sm').eq(0).should('have.text', 'Email address is required.')
      cy.get('p.text-red-400.text-sm').eq(1).should('have.text', 'Phone number is required.')
      cy.get('p.text-red-400.text-sm').eq(2).should('have.text', 'Password is required.')  
      cy.get('p#confirm-password-error').should('have.text', 'Please confirm your password.') 
      cy.get('[class="pl-7 text-sm text-red-400"]').should('have.text', 'Please accept the Terms of use and Privacy policy to continue.')
  })

 it('Should not be able to register with partial fields', () => {
      cy.get('[id="email"]').should('be.visible').type('aol@example.com')
      cy.get('[id="phoneNumber"]').should('be.visible')
      cy.get('[id="password"]').should('be.visible').type('Test@123')
      cy.get('[id="confirmPassword"]').should('be.visible').type('Test@123')
      cy.get('[id="register-accept-terms"]').should('be.visible').check()
      cy.get('button[type="submit"').should('be.visible').click()
      cy.get('[id="phone-error"]').should('have.text', 'Phone number is required.')
    
 })

  it('Should register and receive an email in Mailosaur', () => {
      const randomString = new Date().getTime();
      const randomNumber = Math.floor(1000000000 + Math.random() * 9000000000).toString();
      emailAddress = `${randomString}${emailDomain}`

      cy.intercept('POST', 'https://digitfx.etechnosoft.org/api/v1/otp/initiate').as('register')

      cy.get('[id="email"]').should('be.visible').type(emailAddress)
      cy.get('[id="phoneNumber"]').should('be.visible').type(randomNumber, { force: true })
      cy.get('[id="password"]').should('be.visible').type('Test@1234')
      cy.get('[id="confirmPassword"]').should('be.visible').type('Test@1234')
      cy.get('[id="register-accept-terms"]').check({ force: true })
      cy.get('button[type="submit"').should('be.visible').click()
      
      cy.wait('@register').then(({ response }) => {
      cy.log(`Register status: ${response.statusCode}`)
          expect(response.statusCode).to.be.oneOf([200, 201])
          })

  // Get the OTP from Mailosaur and enter it in the UI
      cy.getOtpFromEmail(emailAddress).then((otp) => {
      cy.enterOtp(otp)
      cy.get('button[type="submit"]').eq(1).should('be.visible').click()
        })
      cy.wait(10000)
      cy.url({timeout: 30000}).should('contain', 'https://xpassa').and('eq', 'https://xpassa-web-dev.digitvant.com/onboarding/identity')

  })
})
