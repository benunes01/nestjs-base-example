import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "src/shared/infra/database/mongoose/schemas/user.model";
import { CreateUserDto } from "./dtos/create-user.dto";
import AuthTokenProvider from "src/shared/providers/AuthTokenProvider/implementations/AuthTokenProvider";
import HashPasswordProvider from "src/shared/providers/HashPasswordProvider/implementations/HashPasswordProvider";
import GenerateUUID from "src/shared/utils/GenerateUUID";
import { Token } from "src/shared/infra/database/mongoose/schemas/token.model";
import { IAuthToken } from "src/shared/providers/AuthTokenProvider/interfaces/AuthToken";
import { AuthUserDto } from "./dtos/auth-user.dto";

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>, 
  @InjectModel(Token.name) private readonly tokenModel: Model<Token>, 
  private authTokenProvider: AuthTokenProvider,
  private hashPasswordProvider: HashPasswordProvider) {}

  async create(createUserDto: CreateUserDto): Promise<{ user: User; token: IAuthToken }> {
    createUserDto.password = await this.hashPasswordProvider.generateHash(createUserDto.password);

    const _id = new GenerateUUID().getUUID();
    const createdUser = new this.userModel({ ...createUserDto, _id });
    await createdUser.save();

    const token = await this.authTokenProvider.signToken(createdUser._id);
    
    return { user: createdUser, token };
  }

  async update(userId: string, updateUserDto: Partial<User>): Promise<User> {
    if(updateUserDto.password) {
      updateUserDto.password = await this.hashPasswordProvider.generateHash(updateUserDto.password);
    }
    return this.userModel.findByIdAndUpdate(userId, updateUserDto, { new: true }).exec();
  }

  async auth(authUserDto: AuthUserDto): Promise<{ user: User; token: IAuthToken }> {
    const user = await this.userModel.findOne({ email: authUserDto.email }).exec();
    
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const isPasswordValid = await this.hashPasswordProvider.compareHash(authUserDto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Senha inválida');
    }

    const token = this.authTokenProvider.signToken(user._id);
    
    return { user, token };
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }
}
