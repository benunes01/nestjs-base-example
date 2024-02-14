export interface IAuthToken {
    jwt: string;
    expiresIn: Date | string;
  }

export interface AuthTokenOptions {
    expiresIn: string;
    subject: string;
  }