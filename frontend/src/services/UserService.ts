import User from '@/classes/user';

export class UserService {
    public currentUser: User;
}

export const userService: UserService = new UserService();
