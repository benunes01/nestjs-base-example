import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from "@nestjs/common";
import { CreateUserDto } from "./dtos/create-user.dto";
import { UserService } from "./user.service";

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    async create(@Body() body: CreateUserDto) {
        return this.userService.create(body);
    }

    @Get()
    async read() {
        return this.userService.findAll();
    }

    @Get(':id')
    async readOne(@Param() param) {
        return {
            user: {}
        };
    }

    @Patch(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() body) {
        return {
            id,
            body
        };
    }

    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number) {
        return {
            user: {}
        };
    }
}