import { User } from '../../types';
import { createUserEntity } from './converter';
import { Entities } from '../constants';

describe('user converter', () => {
  test('entity converter', () => {
    const user: User = {
      username: 'someone@jupiterone.io',
      fullname: 'Someone J1',
      mpstrength: '100',
      created: '2022-05-11 11:02:26' as unknown as Date,
      last_pw_change: '2022-05-11 11:02:26' as unknown as Date,
      last_login: '2022-06-02 09:20:59' as unknown as Date,
      neverloggedin: false,
      disabled: false,
      admin: true,
      totalscore: '0',
      multifactor: 'googleauth',
      duousername: null,
      sites: 0,
      notes: 0,
      formfills: 0,
      applications: 0,
      attachments: 0,
      password_reset_required: false,
    };

    const entity = createUserEntity(user);
    expect(entity).toMatchGraphObjectSchema(Entities.USER);
    expect(entity.webLink).toBe(
      'https://admin.lastpass.com/users/view?users=eyJzZWFyY2giOiJzb21lb25lQGp1cGl0ZXJvbmUuaW8ifQ==',
    );
    expect(entity.shortLoginId).toBe('someone');
    expect(entity.emailDomain).toEqual(['jupiterone.io']);
  });
});
