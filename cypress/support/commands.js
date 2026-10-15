// Fetches the email sent to `emailAddress` and returns the OTP code from it
Cypress.Commands.add('getOtpFromEmail', (emailAddress, { timeout = 30000 } = {}) => {
  const serverId = Cypress.expose('CYPRESS_MAILOSAUR_SERVER_ID')

  return cy
    .mailosaurGetMessage(serverId, { sentTo: emailAddress }, { timeout })
    .then((message) => {
     
      const code =
        message.html?.codes?.[0]?.value ||
        message.text?.codes?.[0]?.value ||
        (message.text?.body || '').match(/\b\d{4,8}\b/)?.[0]

      expect(code, 'OTP code found in email').to.match(/^\d{4,8}$/)
      cy.log(`OTP: ${code}`)
      return cy.wrap(code)
    })
})

Cypress.Commands.add('enterOtp', (code) => {
  const digits = String(code).split('')

  // Wait for the OTP modal to appear
  cy.get('div.fixed.inset-0').should('be.visible')

  cy.get('div.fixed.inset-0 input')
    .not('#phoneNumber')
    .filter(':visible')
    .should('have.length', digits.length)
    .each(($input, index) => {
      cy.wrap($input)
        .clear({ force: true })
        .type(digits[index], { force: true })
    })
})


// Check for the "Verify this device" modal and asserts it is visible.
Cypress.Commands.add('getVerifyDeviceModal', () => {
  return cy
    .wait(2000)
    .contains('div.fixed.inset-0.z-70', 'Verify this device', { timeout: 20000 })
    .should('be.visible')
})


Cypress.Commands.add('verifyDeviceModalIsVisible', () => {
  cy.getVerifyDeviceModal().within(() => {
    cy.contains('Verify this device').should('be.visible')
    cy.contains('This device is not recognized').should('be.visible')
    cy.contains('button', 'Verify with a face check')
      .should('be.visible')
      .and('be.enabled')
    cy.contains('Sign out instead').should('be.visible')
  })
})


Cypress.Commands.add('clickVerifyWithFaceCheck', () => {
  cy.getVerifyDeviceModal()
    .contains('button', 'Verify with a face check')
    .click()
})

Cypress.Commands.add('clickSignOutInstead', () => {
  cy.getVerifyDeviceModal()
    .contains('Sign out instead')
    .click()
})

