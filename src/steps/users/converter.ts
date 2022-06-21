import {
  createIntegrationEntity,
  Entity,
  parseTimePropertyValue,
} from '@jupiterone/integration-sdk-core';
import { User } from '../../types';
import { Entities } from '../constants';

export function createUserEntity(user: User): Entity {
  const splitEmail = user.username.split('@');
  const shortLoginId = splitEmail[0];
  const emailDomain = splitEmail[1];

  return createIntegrationEntity({
    entityData: {
      source: user,
      assign: {
        _key: user.key!,
        _class: Entities.USER._class,
        _type: 'lastpass_user',
        name: user.fullname,
        username: user.username,
        createdOn: parseTimePropertyValue(user.created),
        passwordChangedOn: user.last_pw_change,
        email: user.username,
        active: !user.disabled,
        neverLoggedIn: user.neverloggedin,
        admin: user.admin,
        shortLoginId,
        emailDomain,

        duoUsername: user.duousername,
        masterPasswordStrength: user.mpstrength,
        passwordResetRequired: user.password_reset_required,
        sites: user.sites,
        notes: user.notes,
        formfills: user.formfills,
        applications: user.applications,
        attachments: user.attachments,
      },
    },
  });
}
