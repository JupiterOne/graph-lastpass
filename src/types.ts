export interface UserResponse {
  total: number;
  count: number;
  Users: Users;
  Groups?: Groups;
}

export interface Groups {
  [key: string]: string[];
}

export interface Users {
  [key: string]: User;
}

export interface User {
  username: string;
  fullname: string;
  mpstrength: string;
  created: Date;
  last_pw_change: Date;
  last_login: Date;
  neverloggedin: boolean;
  duousername: string | null;
  disabled: boolean;
  totalscore: string | null;
  multifactor?: string;
  admin: boolean;
  linked?: string;
  sites: number;
  notes: number;
  formfills: number;
  applications: number;
  attachments: number;
  password_reset_required: boolean;
  groups?: string[];
  key?: string;
}
