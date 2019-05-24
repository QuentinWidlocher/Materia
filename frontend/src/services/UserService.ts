import User from '@/classes/user';

export class UserService {
    public currentUser: User;

    // tslint:disable-next-line: no-empty
    constructor() {
    }
}

export const userService: UserService = new UserService();
