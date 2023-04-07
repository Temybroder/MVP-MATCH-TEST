
/*
 * Create and export configuration variables
 *
 */

// Container for all environments
let environments = {};

// Development (default) environment
environments.development = {
  'httpPort' : process.env.dev_http_Port,
 // 'httpsPort' : process.env.dev_https_Port,
  'envName' : process.env.devEnvName,
  'templateGlobals' : {
    'appName' : 'MvpMatch Test',
    'companyName' : 'MvpMatch',
    'yearCreated' : '2023'
  }
};

// Testing environment
environments.testing = {
  'httpPort' : process.env.ts_http_Port,
 // 'httpsPort' : process.env.ts_https_Port,
  'envName' : process.env.tsEnvName,
  'templateGlobals' : {
    'appName' : 'MvpMatch Test',
    'companyName' : 'MvpMatch',
    'yearCreated' : '2023'
  }
};

// Production environment
environments.production = {
  'httpPort' : process.env.prod_http_Port,
 // 'httpsPort' : process.env.prod_https_Port,
  'envName' : process.env.prodEnvName,
  'templateGlobals' : {
    'appName' : 'MvpMatch Test',
    'companyName' : 'MvpMatch',
    'yearCreated' : '2023'
  }
};

// Determine which environment was passed as a command-line argument
let currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// Check that the current environment is one of the environments above, if not, default to Development
let environmentToExport = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.development;

// Export the module
module.exports = environmentToExport;