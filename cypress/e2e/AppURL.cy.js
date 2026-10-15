describe('Testing URL', () => {
  const devUrl = Cypress.expose('DEV_ENV_URL');
  
  beforeEach(() => {
    expect(devUrl, 'Development URL is configured')
      .to.be.a('string')
      .and.not.be.empty;

    cy.visit(devUrl);
    
  })

  it('URL Verification', () => {
    cy.url().should('contain', 'https://xpassa').and('eq', 'https://xpassa-web-dev.digitvant.com/')
    cy.url().should('not.contain', '.ng').and('not.contain', '.net')
    cy.url().should('match', /^https:\/\/xpassa-web-dev\.digitvant\.com\/$/)
    cy.url().should('match', /^https:\/\//);
    cy.url().should('match',/^https:\/\/xpassa-web-dev\.digitvant\.com/)
    cy.url().should('match',/^https:\/\/xpassa-web-dev\.digitvant\.com(?:\/|$)/);
    cy.location('pathname').should('match', /^\/$/);
    cy.location('search').should('match', /^$/);
    cy.location('hash').should('match', /^$/);
    cy.url().should('not.match', /^http:\/\/xpassa-web-dev\.digitvant\.com\/$/)
    cy.url().should('not.match', /^https:\/\/www\.xpassa-web-dev\.digitvant\.com\/$/)
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
    cy.contains('Login').should('be.visible').click()
    cy.url().should('eq', 'https://xpassa-web-dev.digitvant.com/auth/login')
    cy.location('pathname').should('eq', '/auth/login')
    })
  })
