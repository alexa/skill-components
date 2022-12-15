module.exports = {
  testEnvironment:"node",
  collectCoverage: true,
  collectCoverageFrom: [
      'lambda/**/*.{js,jsx,ts,tsx}'
  ],
  transform: {
      '^.+\\.(ts)$': 'ts-jest',
  },
  coverageReporters: ['text', 'html', 'cobertura', 'json-summary'],
  testRegex: '.+\.test.ts$',
  reporters: [
      "default",
      ["./node_modules/jest-html-reporter", {
          "pageTitle": "ACDL Catalog Explorer Test Report"
      }]
  ]
}