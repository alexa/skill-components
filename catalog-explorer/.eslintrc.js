module.exports = {
    env: {
        es6: true,
        node: true,
    },
    parser: '@typescript-eslint/parser',
    parserOptions: {
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
        tsconfigRootDir: __dirname,
        project: './tsconfig.json',
    },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:import/typescript',
    ],
    plugins: [
        '@typescript-eslint',
        'import',
    ],
    overrides: [
        {
            files: ['*'],
            rules: {
                '@typescript-eslint/no-explicit-any': ['off'],
            },
        }
    ]
};