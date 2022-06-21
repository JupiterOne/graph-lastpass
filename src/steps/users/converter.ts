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
      source: {
        ...user,
        notes: undefined,
      },
      assign: {
        _key: 'lastpass_user:' + user.key!,
        _class: Entities.USER._class,
        _type: 'lastpass_user',
        name: user.fullname,
        displayName: user.username,
        username: user.username,
        createdOn: parseTimePropertyValue(user.created),
        passwordChangedOn: parseTimePropertyValue(user.last_pw_change),
        email: user.username,
        active: !user.disabled,
        neverLoggedIn: user.neverloggedin,
        admin: user.admin,
        shortLoginId,
        emailDomain: [emailDomain],

        duoUsername: user.duousername,
        masterPasswordStrength: user.mpstrength,
        passwordResetRequired: user.password_reset_required,
        sitesCount: user.sites,
        notesCount: user.notes,
        formfillsCount: user.formfills,
        applicationCount: user.applications,
        attachmentsCount: user.attachments,
      },
    },
  });
}
