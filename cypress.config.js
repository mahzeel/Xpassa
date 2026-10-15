const { defineConfig } = require("cypress");
const mailosaurEnv = require('./cypress/fixtures/cypress.env.json');

module.exports = defineConfig({
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    reportDir: 'cypress/reports',
    reportFilename: 'xpassa-test-report',
    reportPageTitle: 'Xpassa Test Report',
    charts: true,
    embeddedScreenshots: true,
    inlineAssets: true,      // single self-contained HTML file
    saveAllAttempts: false,
  },

  viewportWidth: 1920,
  viewportHeight: 1080,
  defaultCommandTimeout: 10000,
  screenshotOnRunFailure: true,
  video: false,

  env: {
    MAILOSAUR_API_KEY: mailosaurEnv.MAILOSAUR_API_KEY,
  },
  
  expose: {
    DEV_ENV_URL: 'https://xpassa-web-dev.digitvant.com/',
    STAGING_ENV_URL: '',
    DEV_CREATE_URL: 'https://xpassa-web-dev.digitvant.com/auth/register/account',
    DEV_LOGIN_URL: 'https://xpassa-web-dev.digitvant.com/auth/login',
    CYPRESS_MAILOSAUR_SERVER_ID: "an59wpvo",
    CYPRESS_MAILOSAUR_EMAIL_DOMAIN: "@an59wpvo.mailosaur.net",
    },
  
      e2e: {
        baseUrl: 'https://xpassa-web-dev.digitvant.com/',
         setupNodeEvents(on, config) {
          require('cypress-mochawesome-reporter/plugin')(on);
      // implement node event listeners here
    },
  },
});
