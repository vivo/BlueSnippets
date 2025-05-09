module.exports = {
  root: true,
  env: {
    node: true,
    browser: true // Add browser environment for Vue projects
  },
  extends: [
    'plugin:vue/essential', // Use 'essential' for Vue 2
    '@vue/standard'
  ],
  parserOptions: {
    parser: '@babel/eslint-parser',
    requireConfigFile: false, // Important if you don't have a separate babel.config.js
    ecmaVersion: 2020, // Or newer, aligned with your project target
    sourceType: 'module'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off'
    // Add any project-specific rule overrides here
  }
}
