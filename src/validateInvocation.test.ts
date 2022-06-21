import {
  createMockExecutionContext,
  Recording,
} from '@jupiterone/integration-sdk-testing';
import { integrationConfig } from '../test/config';
import { setupProjectRecording } from '../test/recording';
import { IntegrationConfig, validateInvocation } from './config';
import { IntegrationProviderAuthorizationError } from '@jupiterone/integration-sdk-core';

describe('#validateInvocation', () => {
  let recording: Recording;

  afterEach(async () => {
    if (recording) {
      await recording.stop();
    }
  });

  test('requires valid config', async () => {
    const executionContext = createMockExecutionContext<IntegrationConfig>({
      instanceConfig: {} as IntegrationConfig,
    });

    await expect(validateInvocation(executionContext)).rejects.toThrow(
      'Config requires a companyId and provisioningHash',
    );
  });

  /**
   * Testing a successful authorization can be done with recordings
   */
  test('successfully validates invocation', async () => {
    recording = setupProjectRecording({
      directory: __dirname,
      name: 'validate-invocation',
    });

    // Pass integrationConfig to authenticate with real credentials
    const executionContext = createMockExecutionContext({
      instanceConfig: integrationConfig,
    });

    // successful validateInvocation doesn't throw errors and will be undefined
    await expect(validateInvocation(executionContext)).resolves.toBeUndefined();
  });

  describe('fails validating invocation', () => {
    describe('invalid user credentials', () => {
      test('should throw if companyId is invalid', async () => {
        recording = setupProjectRecording({
          directory: __dirname,
          name: 'client-id-auth-error',
          // Many authorization failures will return non-200 responses
          // and `recordFailedRequest: true` is needed to capture these responses
          options: {
            recordFailedRequests: true,
          },
        });

        const executionContext = createMockExecutionContext({
          instanceConfig: {
            companyId: 'INVALID',
            provisioningHash: integrationConfig.provisioningHash,
          },
        });

        await expect(validateInvocation(executionContext)).rejects.toThrow(
          new IntegrationProviderAuthorizationError({
            endpoint: 'https://lastpass.com/enterpriseapi.php',
            status: 401,
            statusText: 'Unauthorized',
          }),
        );
      });

      test('should throw if clientSecret is invalid', async () => {
        recording = setupProjectRecording({
          directory: __dirname,
          name: 'client-secret-auth-error',
          options: {
            recordFailedRequests: true,
          },
        });

        const executionContext = createMockExecutionContext({
          instanceConfig: {
            companyId: integrationConfig.companyId,
            provisioningHash: 'INVALID',
          },
        });

        await expect(validateInvocation(executionContext)).rejects.toThrow(
          new IntegrationProviderAuthorizationError({
            endpoint: 'https://lastpass.com/enterpriseapi.php',
            status: 401,
            statusText: 'Unauthorized',
          }),
        );
      });
    });
  });
});
