import {
  setupRecording,
  Recording,
  SetupRecordingInput,
  mutations,
} from '@jupiterone/integration-sdk-testing';

export { Recording };

function isRecordingEnabled(): boolean {
  return Boolean(process.env.LOAD_ENV);
}

export function setupProjectRecording(
  input: Omit<SetupRecordingInput, 'mutateEntry'>,
): Recording {
  return setupRecording({
    ...input,
    redactedRequestHeaders: ['Authorization'],
    redactedResponseHeaders: ['set-cookie'],
    mutateEntry: (entry) => {
      entry.request.postData.text = '[REDACTED]';
      mutations.unzipGzippedRecordingEntry(entry);
    },
    options: {
      mode: isRecordingEnabled() ? 'record' : 'replay',
      recordFailedRequests: true,
      ...input.options,
    },
  });
}
