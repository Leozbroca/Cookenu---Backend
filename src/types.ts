export enum USER_ROLES {
  ADMIN = "ADMIN",
  NORMAL = "NORMAL",
}

export interface authenticationData {
  id: string;
  role: USER_ROLES;
}

export interface user {
  id: string;
  email: string;
  name: string;
  password: string;
  role: USER_ROLES;
}

export interface recipe {
  title: string;
  description: string;
  creation_date: string;
  creator_id: string;
}

export interface follow {
  follower: string;
  following: string;
}

export interface userBasic {
  id: string;
  name: string;
  email: string;
}

export interface feed {
  id: number;
  title: string;
  description: string;
  createdAt: string;
  creator_id: string;
  creator_name: string;
}
