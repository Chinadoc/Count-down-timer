// Mock the react-native modules that might cause issues in test environment
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

// Mock react-native components that might not be available in test environment
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  
  // Add any components that need custom mocking
  RN.Platform.OS = 'ios'; // Default to iOS for tests
  
  return RN;
});
