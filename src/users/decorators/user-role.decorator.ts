import { SetMetadata } from '@nestjs/common';
import { UserType } from 'src/util/enums';

export const Roles = (...roles: UserType[]) => SetMetadata('roles', roles);
