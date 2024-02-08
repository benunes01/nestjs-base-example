export interface IAuthToken {
    token: string;
    expiresIn: Date | string;
  }

export interface AuthTokenOptions {
    expiresIn: string;
    subject: string;
  }