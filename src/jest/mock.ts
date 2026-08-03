/**
 * Built-in Jest mock for host applications running unit tests with `react-native-hkia-sdk`.
 */
export const mockHKIASDK = {
  CheckInSDKService: {
    initializeConfig: jest.fn().mockResolvedValue(true),
    initializeWithNames: jest.fn().mockResolvedValue(true),
    scanPassport: jest.fn().mockResolvedValue(true),
    processPassport: jest.fn().mockResolvedValue({
      success: true,
      message: 'Mock Token Enrolled',
      enrollmentToken: 'TOK_JEST_MOCK_123',
    }),
    isPassportEnrolled: jest.fn().mockResolvedValue(true),
  },
  BagDropSDKService: {
    initializeConfig: jest.fn().mockResolvedValue(true),
    startBagDropFlow: jest.fn().mockResolvedValue({
      success: true,
      claimTagJson: '{"claimTag":"MOCK_TAG"}',
    }),
  },
  HKIALogger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    getLogs: jest.fn().mockReturnValue([]),
  },
};

export default mockHKIASDK;
