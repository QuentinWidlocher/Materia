import User from "@/classes/user";

class UserService {
    public currentUser: User;

    constructor() {
    }
}

export const userService: UserService = new UserService();
