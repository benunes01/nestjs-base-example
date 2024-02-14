import AppError from "../../../errors/AppError";
import IHashPasswordProvider from "../models/IHashPasswordProvider";
import { hash, genSalt, compare } from "bcrypt";

export default class HashPasswordProvider implements IHashPasswordProvider {
  async generateHash(payload: string): Promise<string> {
    const saltRounds = Number(10);

    const generateSalt = await genSalt(saltRounds);
    return hash(payload, generateSalt);
  }

  async compareHash(payload: string, hashed: string): Promise<boolean> {
    return await compare(payload, hashed);
  }
}