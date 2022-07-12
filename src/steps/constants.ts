import {
  RelationshipClass,
  StepEntityMetadata,
  StepRelationshipMetadata,
} from '@jupiterone/integration-sdk-core';

export const Steps = {
  ACCOUNT: 'build-account',
  USERS: 'fetch-users',
};

export const Entities: Record<'ACCOUNT' | 'USER', StepEntityMetadata> = {
  ACCOUNT: {
    resourceName: 'Account',
    _type: 'lastpass_account',
    _class: ['Account'],
    schema: {
      properties: {},
    },
  },
  USER: {
    resourceName: 'User',
    _type: 'lastpass_user',
    _class: ['User'],
    schema: {
      properties: {
        username: { type: 'string' },
        email: { type: 'string' },
        active: { type: 'boolean' },
        firstName: { type: 'string' },
        lastName: { type: 'string' },
      },
      required: ['username', 'email', 'active'],
    },
  },
};

export const Relationships: Record<
  'ACCOUNT_HAS_USER',
  StepRelationshipMetadata
> = {
  ACCOUNT_HAS_USER: {
    _type: 'lastpass_account_has_user',
    sourceType: Entities.ACCOUNT._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.USER._type,
  },
};
