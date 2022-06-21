import { IntegrationConfig } from './config';
import { GaxiosOptions, GaxiosResponse, request } from 'gaxios';
import { User, UserResponse } from './types';
import {
  IntegrationProviderAPIError,
  IntegrationProviderAuthorizationError,
} from '@jupiterone/integration-sdk-core';

export type ResourceIteratee<T> = (each: T) => Promise<void> | void;

/**
 * An APIClient maintains authentication state and provides an interface to
 * third party data APIs.
 *
 * It is recommended that integrations wrap provider data APIs to provide a
 * place to handle error responses and implement common patterns for iterating
 * resources.
 */
export class APIClient {
  private BASE_URL = 'https://lastpass.com/enterpriseapi.php';

  constructor(readonly config: IntegrationConfig) {}

  public async verifyAuthentication(): Promise<void> {
    const body = this.createPostBody('getserdata', '');
    const requestOpts: GaxiosOptions = {
      url: this.BASE_URL,
      method: 'POST',
      data: body,
    };

    // TODO: limit response size with pagesize parameters
    const response = await request<UserResponse>(requestOpts);
    this.usersResponseIsOk(response);
  }

  private usersResponseIsOk(response: GaxiosResponse) {
    if (
      response.data.total === undefined ||
      response.data.count === undefined ||
      response.data.Users === undefined
    ) {
      if (response.data.includes?.('Authorization Error')) {
        throw new IntegrationProviderAuthorizationError({
          endpoint: response.config.url as string,
          status: 401,
          statusText: 'Unauthorized',
        });
      } else {
        // LastPass gives 200 OK for all responses, even when an error has
        // ocurred.
        throw new IntegrationProviderAPIError({
          endpoint: response.config.url as string,
          status: 500,
          statusText: 'Internal Server Error',
        });
      }
    }
  }

  private createPostBody(cmd: string, data: any) {
    return {
      cid: this.config.companyId,
      provhash: this.config.provisioningHash,
      cmd: cmd,
      data: data,
    };
  }

  public async iterateUsers(iteratee: ResourceIteratee<User>): Promise<void> {
    let pagesize = 1000;
    let pageindex = 0;
    let itemsSeen = pagesize * pageindex;
    let total = 0;
    do {
      const body = this.createPostBody('getuserdata', 'all');
      const requestOpts = {
        url: this.BASE_URL,
        body,
      };
      const response = await request<UserResponse>(requestOpts);
      for (const key in response.data.Users) {
        await iteratee(response.data.Users[key]);
      }

      pageindex++;
      itemsSeen = pageindex * pagesize;
    } while (itemsSeen < total);
  }
}

let client: APIClient;

export function createAPIClient(config: IntegrationConfig): APIClient {
  if (client) {
    return client;
  }
  client = new APIClient(config);
  return client;
}
