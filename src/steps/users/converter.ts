import {
  createIntegrationEntity,
  Entity,
  parseStringPropertyValue,
  parseTimePropertyValue,
} from '@jupiterone/integration-sdk-core';
import { User } from '../../types';
import { Entities } from '../constants';

export function createUserEntity(user: User): Entity {
  const splitEmail = user.username.split('@');
  const shortLoginId = splitEmail[0];
  const emailDomain = splitEmail[1];
  const searchParamForWebLink = Buffer.from(
    JSON.stringify({ search: user.username }),
  ).toString('base64');

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
        lastLogin: parseTimePropertyValue(user.last_login),
        email: user.username,
        active: !user.disabled,
        ...(user.multifactor && {
          mfaEnabled: true,
        }),
        mfaType: user.multifactor,
        neverLoggedIn: user.neverloggedin,
        admin: user.admin,
        shortLoginId,
        emailDomain: [emailDomain],
        webLink: `https://admin.lastpass.com/users/view?users=${searchParamForWebLink}`,

        duoUsername: user.duousername,
        masterPasswordStrength: parseStringPropertyValue(user.mpstrength),
        passwordResetRequired: user.password_reset_required,
        securityScore: parseStringPropertyValue(user.totalscore),
        linkedAccount: user.linked,
        sitesCount: user.sites,
        notesCount: user.notes,
        formFillsCount: user.formfills,
        applicationCount: user.applications,
        attachmentsCount: user.attachments,
      },
    },
  });
}
