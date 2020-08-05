module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ["plugin:vue/essential", "eslint:recommended", "@vue/standard"],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'generator-star-spacing': 'off',
    "indent": ["off", 2],
    "key-spacing":'off',
    'eqeqeq':'off',
    'comma-spacing':'off',
    'space-before-function-paren':'off'
  },
  globals:{
    sysConfig: true,
    $: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
