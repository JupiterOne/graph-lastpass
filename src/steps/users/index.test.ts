import {
  executeStepWithDependencies,
  Recording,
} from '@jupiterone/integration-sdk-testing';
import { setupProjectRecording } from '../../../test/recording';
import { buildStepTestConfigForStep } from '../../../test/config';
import { Steps } from '../constants';

describe('Users step', () => {
  let recording: Recording;

  afterEach(async () => {
    if (recording) {
      await recording.stop();
    }
  });

  test('user integration and converters', async () => {
    // Arrange
    recording = setupProjectRecording({
      directory: __dirname,
      name: 'fetch-users',
    });

    const stepConfig = buildStepTestConfigForStep(Steps.USERS);

    // Act
    const stepResult = await executeStepWithDependencies(stepConfig);

    // Assert
    expect(stepResult).toMatchStepMetadata(stepConfig);
  });
});
