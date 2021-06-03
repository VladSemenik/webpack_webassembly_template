module.exports = {
  roots: [
    '<rootDir>/src'
  ],
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
  moduleFileExtensions: [
    'ts',
    'tsx',
    'js',
    'jsx',
    'json',
    'node'
  ],
  moduleDirectories: ["node_modules", "src"],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/index.tsx',
  ],
  testURL: 'http://localhost/',
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"]
}