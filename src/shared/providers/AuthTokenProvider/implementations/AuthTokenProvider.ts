import { sign } from "jsonwebtoken";
import AppError from "../../../errors/AppError";
import { IAuthToken, AuthTokenOptions } from "../interfaces/AuthToken";

export default class AuthTokenProvider {
  private static readonly PRIVATE_KEY: string = process.env.PRIVATE_KEY
    ? process.env.PRIVATE_KEY.replace(/\\n/gm, "\n")
    : "";

  private static readonly TOKEN_EXPIRATION_TIME: string = "600m";

  private static getTokenOptions(subject: string): AuthTokenOptions {
    return {
      expiresIn: AuthTokenProvider.TOKEN_EXPIRATION_TIME,
      subject,
    };
  }

  static signToken(userId: string, refreshToken: string): IAuthToken {
    if (!AuthTokenProvider.PRIVATE_KEY) {
      throw new AppError("Failed to load PRIVATE_KEY environment variable.", 500);
    }

    const tokenOptions = AuthTokenProvider.getTokenOptions(userId);
    const token = sign({ userId, refreshToken }, AuthTokenProvider.PRIVATE_KEY, {
      algorithm: "RS256",
      ...tokenOptions,
    });

    const expiresIn = new Date();
    expiresIn.setMinutes(expiresIn.getMinutes() + parseInt(tokenOptions.expiresIn));

    return { token, expiresIn };
  }
}
