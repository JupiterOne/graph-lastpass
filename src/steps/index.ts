import { userSteps } from './users';
import { accountStep } from './account';

const integrationSteps = [accountStep, ...userSteps];

export { integrationSteps };
