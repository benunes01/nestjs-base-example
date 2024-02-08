import AppError from "../../../errors/AppError";
import IHashPasswordProvider from "../models/IHashPasswordProvider";
import { hash, genSalt, compare } from "bcrypt";

export default class HashPasswordProvider implements IHashPasswordProvider {
  async generateHash(payload: string): Promise<string> {
    const saltRounds = Number(process.env.PASSWORD_SALT_ROUNDS);
    if (Number.isNaN(saltRounds) || !Number.isInteger(saltRounds)) {
      console.log(
        "Falha no carregamento da variável de ambiente PASSWORD_SALT_ROUNDS."
      );
      throw new AppError("Internal Server Error", 500);
    }

    const generateSalt = await genSalt(saltRounds);
    return hash(payload, generateSalt);
  }

  async compareHash(payload: string, hashed: string): Promise<boolean> {
    return await compare(payload, hashed);
  }
}