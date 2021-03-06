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
    const body = this.createPostBody('getuserdata', { pagesize: 1 });
    const requestOpts: GaxiosOptions = {
      url: this.BASE_URL,
      method: 'POST',
      data: body,
    };

    const response = await request<UserResponse>(requestOpts);
    APIClient.usersResponseIsOk(response);
  }

  private static usersResponseIsOk(response: GaxiosResponse) {
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

  private createRequestOptions({
    url,
    cmd,
    data,
  }: {
    url: string;
    cmd: string;
    data: any;
  }): GaxiosOptions {
    const body = this.createPostBody(cmd, data);
    return {
      url,
      data: body,
      method: 'POST',
    };
  }

  /**
   * Iterates through all users.
   * @param iteratee
   */
  public async iterateUsers(iteratee: ResourceIteratee<User>): Promise<void> {
    const pagesize = 200;
    let pageindex = 0;
    let itemsSeen = pagesize * pageindex;
    let total = 0;
    do {
      const requestOpts = this.createRequestOptions({
        url: this.BASE_URL,
        cmd: 'getuserdata',
        data: { pagesize: pagesize, pageindex: pageindex },
      });
      const response = await request<UserResponse>(requestOpts);
      APIClient.usersResponseIsOk(response);

      total = response.data.total;
      for (const key in response.data.Users) {
        const user: User = {
          ...response.data.Users[key],
          key: key,
        };
        await iteratee(user);
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
