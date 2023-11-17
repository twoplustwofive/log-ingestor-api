const generateRandomPrefix = () => {
  const randomString = Math.random().toString(36).substring(2);
  return randomString + '00000000'.substring(0, 8 - randomString.length);
};

export const generateRandomLogData = (timestamp?: string) => {
  const currentTimestamp = timestamp || new Date().toISOString();

  const levels = ['info', 'error', 'warning'];
  const randomLevel = levels[Math.floor(Math.random() * levels.length)];

  const randomResourceId = `res-${generateRandomPrefix()}-${Math.floor(
    Math.random() * 1000,
  )}`;
  const randomTraceId = `trace-${generateRandomPrefix()}-${Math.floor(
    Math.random() * 1000,
  )}`;
  const randomSpanId = `span-${generateRandomPrefix()}-${Math.floor(
    Math.random() * 1000,
  )}`;
  const randomCommit = `commit-${generateRandomPrefix()}-${Math.floor(
    Math.random() * 1000,
  )}`;
  const randomParentResourceId = `parent-${generateRandomPrefix()}-${Math.floor(
    Math.random() * 1000,
  )}`;
  const randomMessage = `Test log message ${generateRandomPrefix()}`;

  return {
    level: randomLevel,
    message: randomMessage,
    resourceId: randomResourceId,
    timestamp: currentTimestamp,
    traceId: randomTraceId,
    spanId: randomSpanId,
    commit: randomCommit,
    metadata: {
      parentResourceId: randomParentResourceId,
    },
  };
};
