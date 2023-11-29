import { UserEntity } from "../../database/entities/user.entity";

export type CreateUserDto = Omit<UserEntity, 'id' | 'createdAt' | 'updatedAt' | 'qrcode' | 'permissions'>