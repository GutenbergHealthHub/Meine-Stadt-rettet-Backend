module.exports = {
    root: true,
    env: {
        node: true,
    },
    parser: '@typescript-eslint/parser', // Specifies the ESLint parser
    extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier', 'plugin:prettier/recommended'],
};
