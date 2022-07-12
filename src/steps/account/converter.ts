import { Entities } from '../constants';
import {
  createIntegrationEntity,
  Entity,
} from '@jupiterone/integration-sdk-core';

function createAccountId(companyId: string): string {
  return `lastpass-account-${companyId}`;
}

export function createAccountEntity(companyId: string): Entity {
  const accountId = createAccountId(companyId);

  return createIntegrationEntity({
    entityData: {
      source: {
        id: accountId,
        name: 'LassPass Company Account',
      },
      assign: {
        _key: accountId,
        _type: Entities.ACCOUNT._type,
        _class: Entities.ACCOUNT._class,
        accessURL: 'https://admin.lastpass.com',
      },
    },
  });
}
