/** @type {import("prettier").Config} */
const config = {
	semi: true,
	trailingComma: 'all',
	singleQuote: true,
	printWidth: 80,
	useTabs: true,
	tabWidth: 2,
	arrowParens: 'avoid',
	endOfLine: 'lf',
	bracketSpacing: true,
	plugins: [require.resolve('prettier-plugin-tailwindcss')],
};

module.exports = config;
