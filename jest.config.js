const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: './',
})

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^react-markdown$': '<rootDir>/src/components/__mocks__/react-markdown.tsx',
    '^remark-gfm$': '<rootDir>/src/components/__mocks__/remark-gfm.js',
    '^pdfjs-dist$': '<rootDir>/src/components/__mocks__/pdfjs-dist.js',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(react-markdown|remark-gfm|unified|micromark|decode-named-character-reference|character-entities|property-information|hast-util-whitespace|space-separated-tokens|comma-separated-tokens|pretty-bytes)/)',
  ],
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig)