/* eslint-env node */
module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	parserOptions: {
		project: './tsconfig.eslint.json',
		tsconfigRootDir: __dirname
	},
	plugins: ['@typescript-eslint'],
	extends: [
		'eslint:recommended',
		'airbnb-base',
		'airbnb-typescript/base',
		'plugin:@typescript-eslint/recommended',
		'prettier'
	],
	overrides: [
		{
			extends: ['plugin:@typescript-eslint/recommended-requiring-type-checking'],
			files: ['./**/*.{ts,tsx}']
		}
	],
	rules: {
		'import/no-extraneous-dependencies': ['warn', { packageDir: './' }]
	},
	ignorePatterns: ['build', 'node_modules']
};