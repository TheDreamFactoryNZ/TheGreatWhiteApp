const neutrino = require('neutrino');

module.exports = {
    extends: [require('@neutrinojs/react').eslintrc()],
    rules: {
      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 'off'
    }
  };
  