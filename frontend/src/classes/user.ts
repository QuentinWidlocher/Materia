import Message from './message';

export default class User {

    public static newEmpty(): User {
        return new User('', '', '', []);
    }

    public id: string;
    public username: string;
    public password: string;
    public lastMessages: Message[];

    constructor(id: string, username: string, password: string, lastMessages: Message[]) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.lastMessages = lastMessages;
    }

    public toJSON(): object {
        const plainObject: object = {
            username: this.username,
            password: this.password,
        };

        return plainObject;
    }
}
