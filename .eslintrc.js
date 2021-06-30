module.exports = {
    root: true,
    parser: '@typescript-eslint/parser', // Specifies the ESLint parser
    plugins: ['@typescript/eslint'],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier/@typescript-eslint',
        'plugin:prettier/recommended',
    ],
};
