import {
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../config';
import { createAccountEntity } from './converter';
import { Entities, Steps } from '../constants';

export const ACCOUNT_ENTITY_KEY = 'entity:account';

export async function buildAccount({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const accountEntity = await jobState.addEntity(
    createAccountEntity(instance.config.companyId),
  );

  await jobState.setData(ACCOUNT_ENTITY_KEY, accountEntity);
}

export const accountStep: IntegrationStep<IntegrationConfig> = {
  id: Steps.ACCOUNT,
  name: 'Build Account',
  entities: [Entities.ACCOUNT],
  relationships: [],
  dependsOn: [],
  executionHandler: buildAccount,
};
