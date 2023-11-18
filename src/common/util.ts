const generateRandomPrefix = () => {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomString = '';

  for (let i = 0; i < 8; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters.charAt(randomIndex);
  }

  return randomString;
};

export const generateRandomLogData = (timestamp?: string) => {
  const currentTimestamp = timestamp || new Date().toISOString();

  const levels = ['info', 'error', 'warning'];
  const randomLevel = levels[Math.floor(Math.random() * levels.length)];

  const randomResourceId = `res-${generateRandomPrefix()}`;
  const randomTraceId = `tce-${generateRandomPrefix()}`;
  const randomSpanId = `spn-${generateRandomPrefix()}`;
  const randomCommit = `cmt-${generateRandomPrefix()}`;
  const randomParentResourceId = `prt-${generateRandomPrefix()}`;
  const randomMessage = `msg-${generateRandomPrefix()}`;

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

export const generateFilter = (filters: any): any => {
  const filter: any = {};
  const regexOptions = 'i';
  const logicalOperator = filters.combinator === 'or' ? '$or' : '$and';

  if (filters.startTime) {
    filter.timestamp = { $gte: filters.startTime };
  }

  if (filters.endTime) {
    filter.timestamp = { ...(filter.timestamp || {}), $lte: filters.endTime };
  }

  if (filters.level !== undefined) {
    filter[logicalOperator] = [
      ...(filter[logicalOperator] || []),
      {
        level: {
          $regex: new RegExp(
            getRegexForOperator(filters.level, filters.levelOperator),
            regexOptions,
          ),
        },
      },
    ];
  }
  if (filters.message !== undefined) {
    filter[logicalOperator] = [
      ...(filter[logicalOperator] || []),
      {
        message: {
          $regex: new RegExp(
            getRegexForOperator(filters.message, filters.messageOperator),
            regexOptions,
          ),
        },
      },
    ];
  }
  if (filters.resourceId !== undefined) {
    filter[logicalOperator] = [
      ...(filter[logicalOperator] || []),
      {
        resourceId: {
          $regex: new RegExp(
            getRegexForOperator(filters.resourceId, filters.resourceIdOperator),
            regexOptions,
          ),
        },
      },
    ];
  }
  if (filters.traceId !== undefined) {
    filter[logicalOperator] = [
      ...(filter[logicalOperator] || []),
      {
        traceId: {
          $regex: new RegExp(
            getRegexForOperator(filters.traceId, filters.traceIdOperator),
            regexOptions,
          ),
        },
      },
    ];
  }
  if (filters.spanId !== undefined) {
    filter[logicalOperator] = [
      ...(filter[logicalOperator] || []),
      {
        spanId: {
          $regex: new RegExp(
            getRegexForOperator(filters.spanId, filters.spanIdOperator),
            regexOptions,
          ),
        },
      },
    ];
  }
  if (filters.commit !== undefined) {
    filter[logicalOperator] = [
      ...(filter[logicalOperator] || []),
      {
        commit: {
          $regex: new RegExp(
            getRegexForOperator(filters.commit, filters.commitOperator),
            regexOptions,
          ),
        },
      },
    ];
  }
  if (filters.parentResourceId !== undefined) {
    filter[logicalOperator] = [
      ...(filter[logicalOperator] || []),
      {
        'metadata.parentResourceId': {
          $regex: new RegExp(
            getRegexForOperator(
              filters.parentResourceId,
              filters.parentResourceIdOperator,
            ),
            regexOptions,
          ),
        },
      },
    ];
  }

  return filter;
};
