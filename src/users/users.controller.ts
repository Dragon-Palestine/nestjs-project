import { Controller, Get } from '@nestjs/common';
@Controller()
export class UsersController {
  // GET: ~/api/reviews
  @Get()
  public getAllUsers() {
    return [
      { id: 1, email: 'l.@gmail.ocm' },
      { id: 2, email: 'b@gmail.com' },
    ];
  }
}
