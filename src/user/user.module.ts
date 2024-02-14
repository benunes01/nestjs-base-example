import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { UserSchema } from "src/shared/infra/database/mongoose/schemas/user.model";
import { UserService } from "./user.service";
import AuthTokenProvider from "src/shared/providers/AuthTokenProvider/implementations/AuthTokenProvider";
import HashPasswordProvider from "src/shared/providers/HashPasswordProvider/implementations/HashPasswordProvider";
import { TokenSchema } from "src/shared/infra/database/mongoose/schemas/token.model";

@Module({
    imports: [
        MongooseModule.forFeature([{
            name: 'User', schema: UserSchema,
          },
          {
            name: 'Token', schema: TokenSchema,
          }
        ]),
    ],
    controllers: [UserController],
    providers: [
        UserService,
        AuthTokenProvider,
        HashPasswordProvider,
    ],
    exports: []
})
export class UserModule {}