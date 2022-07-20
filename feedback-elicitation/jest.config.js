module.exports = {
    testEnvironment:"node",
    collectCoverage: true,
    collectCoverageFrom: [
        'src/**/*.{js,jsx,ts,tsx}'
    ],
    transform: {
        '^.+\\.(ts)$': 'ts-jest',
    },
    coverageReporters: ['text', 'html', 'cobertura', 'json-summary'],
    testRegex: '.+\.test.ts$',
    reporters: [
        "default",
        ["./node_modules/jest-html-reporter", {
            "pageTitle": "Feedback Elicitation"
        }]
    ]
}