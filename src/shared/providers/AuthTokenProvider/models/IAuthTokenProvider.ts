import { IAuthToken } from "../interfaces/AuthToken";

export default interface IAuthTokenProvider {
  signToken(userId: string, refreshToken: string): IAuthToken;
}