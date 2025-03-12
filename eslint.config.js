/**
 * @type {import('eslint').Linter.Config}
 */
module.exports = {
  parser: '@typescript-eslint/parser', // Specifies the ESLint parser
  extends: [
    'eslint:recommended', // Use the recommended rules from eslint
    'plugin:@typescript-eslint/recommended' // Use the recommended rules from @typescript-eslint/eslint-plugin
  ],
  parserOptions: {
    ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module' // Allows for the use of imports
  },
  rules: {
    // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
    // e.g. "@typescript-eslint/explicit-function-return-type": "off",
  }
};
