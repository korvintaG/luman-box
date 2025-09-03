import {  ServerResponse } from "../../shared/types/types-for-hooks";
import { NameObject  } from "../../shared/types/entity-types";

export type UserInner = NameObject & { password: string };

export const enum Role {
  User = 0,
  Admin = 1,
  //Blocked = 2,
  SuperAdmin = 3,
}

export const RoleNames = {
  [Role.User]: "Пользователь",
  [Role.Admin]: "Админ",
  [Role.SuperAdmin]: "Супермодератор",
};

export type User = {
  name: string;
  id: number;
  role_id: Role;
};

export type UserPartial = Partial<User>;

export type LoginData = {
  name: string;
  password: string;
};


export type LoginResult = {
    access_token: string;
    user: User;
  };
  
  export type UserResponseToken = ServerResponse<{
    user: User;
    access_token: string;
    refreshToken: string;
  }>;
  