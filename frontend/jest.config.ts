import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  // Jest 설정 옵션
  verbose: true,
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  testMatch: ['**/*.test.ts'],
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  coverageDirectory: './coverage',
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/index.tsx',
    '!**/node_modules/**',
  ],
  coverageReporters: ['json', 'lcov', 'text', 'text-summary'],
};

export default config;
