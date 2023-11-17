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

type DefaultOperatorName =
  | '='
  | '!='
  | '<'
  | '>'
  | '<='
  | '>='
  | 'contains'
  | 'beginsWith'
  | 'endsWith'
  | 'doesNotContain'
  | 'doesNotBeginWith'
  | 'doesNotEndWith'
  | 'null'
  | 'notNull'
  | 'in'
  | 'notIn'
  | 'between'
  | 'notBetween';

export const getRegexForOperator = (
  value: string,
  operator: DefaultOperatorName,
): RegExp => {
  const escapedValue = escapeRegex(value);

  switch (operator) {
    case '=':
      return new RegExp(`^${escapedValue}$`);
    case '!=':
      return new RegExp(`^(?!${escapedValue}$).*$`);
    case '<':
      return new RegExp(`^(?![\\s\\S]*${escapedValue}$).*$`);
    case '>':
      return new RegExp(`^(?![\\s\\S]*${escapedValue}$).*${escapedValue}.*$`);
    case '<=':
      return new RegExp(`^(?![\\s\\S]*${escapedValue}$).*${escapedValue}$`);
    case '>=':
      return new RegExp(`^${escapedValue}.*$`);
    case 'contains':
      return new RegExp(escapedValue.replace(/\s+/g, '').split('').join('.*'));
    case 'beginsWith':
      return new RegExp(`^${escapedValue}`);
    case 'endsWith':
      return new RegExp(`${escapedValue}$`);
    case 'doesNotContain':
      return new RegExp(`^(?!.*${escapedValue}).*$`);
    case 'doesNotBeginWith':
      return new RegExp(`^(?!${escapedValue}).*$`);
    case 'doesNotEndWith':
      return new RegExp(`^.*(?<!${escapedValue})$`);
    case 'null':
      return new RegExp(`^$`);
    case 'notNull':
      return new RegExp(`^(?!$)`);
    default:
      return new RegExp(escapedValue);
  }
};

export const escapeRegex = (text: string): string => {
  return (text || '').replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
};
