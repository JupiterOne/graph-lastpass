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
  created: string; // parseTimePropertyValue()
  last_pw_change: string;
  last_login: string;
  neverloggedin: boolean;
  duousername: string | null;
  disabled: boolean;
  totalscore: string | null;
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
