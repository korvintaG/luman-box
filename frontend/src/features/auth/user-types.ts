import { NameObject, ServerResponse } from "../../shared/common-types";

export type UserInner = NameObject & { password: string };

export const enum Role {
  User = 0,
  Admin = 1,
  //Blocked = 2,
  SuperAdmin = 3,
}

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
  