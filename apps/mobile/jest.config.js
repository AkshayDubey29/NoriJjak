const expoPreset = require('jest-expo/jest-preset');

module.exports = {
  ...expoPreset,
  transformIgnorePatterns: [
    'node_modules/(?!(.pnpm/)?((jest-)?react-native|@react-native(-community)?|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|@norijjak/shared|@react-navigation|@expo/vector-icons))',
  ],
  moduleNameMapper: {
    '^@norijjak/shared$': '<rootDir>/../../packages/shared/src/index.ts',
  },
};
