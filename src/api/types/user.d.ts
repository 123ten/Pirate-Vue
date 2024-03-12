export interface UserInfo {
  id: string;
  username: string;
  nickname: string;
  avatar: string;
  email: string;
  phone: string;
  roles: string[];
  permissions: string[];
}

export interface LoginResult {
  data: {
    accessToken: string;
    refreshToken: string;
    userInfo: UserInfo;
  }
}
