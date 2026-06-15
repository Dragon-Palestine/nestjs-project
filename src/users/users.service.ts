import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  public getAll() {
    return [
      { id: 1, email: 'l.@gmail.ocm' },
      { id: 2, email: 'b@gmail.com' },
    ];
  }
}
