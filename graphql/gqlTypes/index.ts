import { scalarType } from 'nexus';

export * from './Org'
export * from './Location';
export * from './Members';
export * from './Attendance';
export * from './User'

export const DateTime = scalarType({
  name: 'DateTime',
  asNexusMethod: 'dateTime',
  parseValue: (value) => new Date(value as string),
  serialize: (value) => (value as Date).toISOString(),
});
